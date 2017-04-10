const dialogs = require("../dialogs"),
    rp = require("request-promise");

const scoreWord = (a, b) => {
    let score = a.exact.toLowerCase() === b.exact.toLowerCase() ? 50 : 0;
    score += a.norm.toLowerCase() === b.norm.toLowerCase() ? 35 : 0;
    score += a.form === "UH" && a.form === b.form ? 35 : 0;
    score += a.exact === "%" ? 15 : 0;

    return score;
};

const scoreSentence = (messageData, dialogData) => {
    const scores = dialogData
        .filter(word => word.selected)
        .map(word => messageData
            .map(messageWord => scoreWord(word, messageWord))
            .reduce((a, b) => a + b, 0)
        );

    return scores.reduce((a, b) => a + b, 0);
};

const matchNlp = (messageData) => {

    const scored = dialogs.listDialogs()
        .map(dialog => ({
            score: scoreSentence(messageData, dialog.tagAnalysis),
            dialog: dialog,
        }))
        .sort((a, b) => b.score - a.score);

    return scored.filter(d => d.score > 10).length > 0 ? scored[0] : null;
};

const applyBindVars = (text, bindVars, transform = str => str) => {
    let boundText = text;
    for (let i = 0; i < bindVars.length; i++) {
        boundText = boundText.split(`$${i + 1}`).join(transform(bindVars[i]));
    }
    return boundText;
};

const grabVariableWords = (messageWords, stop) => {
    let binding = [];
    while (messageWords.length > 0) {
        const nextWord  = messageWords.shift();
        if (nextWord === stop) {
            messageWords.unshift(nextWord);
            return binding.join(" ");
        }
        binding.push(nextWord);
    }

    return binding.join(" ");
};

const matchBoundVariables = (dialogAnalysis, messageAnalysis) => {
    const matchWords = dialogAnalysis.filter(a => a.selected).map(a => a.exact.toLowerCase());
    let boundVars = [];
    let messageWords = messageAnalysis.map(a => a.exact.toLowerCase());
    for (let i = 0; i < matchWords.length; i++) {
        const matchWord = matchWords[i];
        if (matchWord === "%") {
            const stop = matchWords[i + 1];
            boundVars.push(grabVariableWords(messageWords, stop));
        } else if (messageWords.indexOf(matchWord) > -1) {
            messageWords.splice(messageWords.indexOf(matchWord), 1);
        }
    }

    return boundVars;
};

module.exports = (fb) => {

    const handleWebhookAnswer = (url, senderID, dialogId, answerId, bindVars = []) => {
        rp.post({
            uri: applyBindVars(url, bindVars, encodeURIComponent),
            json: true,
            body: {
                payload: [dialogId, answerId].join("|"),
                params: bindVars,
                recipientID: senderID
            }
        }).catch(() => {
            fb.sendURL(senderID,
                "https://github.com/KBNLresearch/chatbot-builder-nl",
                `De webhook ${url} lijkt niet goed te werken.`
            );
            console.error(`Failed reach webhook at ${answer.url}`);
        }).then((returnedAnswers) => {
            try {
                handleAnswers(senderID, dialogId, returnedAnswers);
            } catch (e) {
                fb.sendURL(senderID,
                    "https://github.com/KBNLresearch/chatbot-builder-nl",
                    `De webhook ${url} lijkt niet goed te werken.`
                );
                console.error(`Failed to use returned answers from webhook at ${answer.url}`, e)
            }
        });
    }


    const handleAnswers = (senderID, dialogId, answers, bindVars = []) => {
        let curDelay = 0;
        answers.forEach(answer => {
            curDelay += answer.responseDelay;
            setTimeout(() => {
                switch (answer.responseType) {
                    case "text":
                        return fb.sendTextMessage(senderID,
                            applyBindVars(answer.responseText, bindVars));

                    case "url":
                        return fb.sendURL(senderID,
                            applyBindVars(answer.url, bindVars, encodeURIComponent),
                            applyBindVars(answer.responseText, bindVars));

                    case "image":
                        return fb.sendImageMessage(senderID,
                            applyBindVars(answer.url, bindVars, encodeURIComponent));

                    case "imageCarousel":
                        return fb.sendImageCarousel(senderID, answer.images);

                    case "typing":
                        setTimeout(() => { fb.sendTypingOff(senderID); }, answer.typeDelay);
                        return fb.sendTypingOn(senderID);

                    case "buttons":
                        return fb.sendButtonMessage(senderID, ({
                            text: applyBindVars(answer.responseText, bindVars),
                            data: answer.buttons.map(b => ({
                                title: applyBindVars(b.text, bindVars),
                                payload: b.payload || [dialogId, b.id]
                                    .concat(bindVars)
                                    .concat(applyBindVars(b.text, bindVars)).join("|")
                            }))
                        }));

                    case "webhook":
                        return handleWebhookAnswer(answer.url, senderID, dialogId, answer.id, bindVars);
                }
            }, curDelay);
            curDelay += answer.responseType === "typing" ? answer.typeDelay : 0;
        });
    };

    const sendCallToAction = (senderID) => {
        const { answers } = dialogs.listDialogs().find(d => d.id === dialogs.START_CONV_ID) || {};
        if (typeof answers !== 'undefined') {
            handleAnswers(senderID, dialogs.START_CONV_ID, answers.filter(a => a.parentId === null));
        }
    };


    const onTextMessage = (messageText, senderID) => {
        rp.get({
            uri: `${process.env.FROG}?text=${encodeURIComponent(messageText)}`,
        }).then(tagAnalysis => {
            const messageAnalysis = dialogs.transformAnalysis(tagAnalysis);
            const bestMatch = matchNlp(messageAnalysis);
            if (bestMatch === null) {
                sendCallToAction(senderID);
            } else {
                const {answers, tagAnalysis: dialogAnalysis} = bestMatch.dialog;
                const bindVars = matchBoundVariables(dialogAnalysis, messageAnalysis);

                handleAnswers(senderID, bestMatch.dialog.id, answers.filter(a => a.parentId === null), bindVars);
            }
        });
    };

    const onAttachments = (senderID) => {};


    const onPostback = (senderID, payload) => {

        if (payload === dialogs.START_CONV_ID) {
            sendCallToAction(senderID);
        } else {
            const [dialogId, parentId, ...bindVars] = payload.split("|");

            if (dialogId === 'webhook') {
                return handleWebhookAnswer(parentId, senderID, dialogId, parentId, bindVars);
            }

            const dialog = dialogs.listDialogs().find(d => d.id === dialogId);
            if (typeof dialog === 'undefined') {
                return;
            }
            const {answers} = dialog;
            // if a.parentId matches parentId it is a button postback answer,
            // else if a.id matches parentId it is a webhook's button postback answer
            handleAnswers(senderID, dialog.id, answers.filter(a => a.id === parentId || a.parentId === parentId), bindVars);
        }
    };

    return {
        onAttachments: onAttachments,
        onPostback: onPostback,
        onTextMessage: onTextMessage,
        handleAnswers: handleAnswers
    }
};