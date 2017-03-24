const dialogs = require("../dialogs"),
    rp = require("request-promise");

const scoreWord = (a, b) => {
    let score = a.exact.toLowerCase() === b.exact.toLowerCase() ? 50 : 0;
    score += a.norm.toLowerCase() === b.norm.toLowerCase() ? 35 : 0;
    score +=  a.form === "UH" && a.form === b.form ? 35 : 0;

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

    return scored.filter(d => d.score > 15).length > 0 ? scored[0] : null;
};

const applyBindVars = (text, bindVars) => {
    let boundText = text;
    for (let i = 0; i < bindVars.length; i++) {
        boundText = boundText.split(`$${i + 1}`).join(bindVars[i]);
    }
    return boundText;
};

module.exports = (fb) => {

    const handleAnswers = (senderID, dialogId, answers, bindVars =[]) => {
        let curDelay = 0;
        answers.forEach(answer => {
            curDelay += answer.responseDelay;
            setTimeout(() => {
                switch (answer.responseType) {
                    case "text":
                        return fb.sendTextMessage(senderID, applyBindVars(answer.responseText, bindVars));

                    case "url":
                        return fb.sendURL(senderID,
                            applyBindVars(answer.url, bindVars), applyBindVars(answer.responseText, bindVars));

                    case "image":
                        return fb.sendImageMessage(senderID, applyBindVars(answer.url, bindVars));

                    case "typing":
                        setTimeout(() => { fb.sendTypingOff(senderID); }, answer.typeDelay);
                        return fb.sendTypingOn(senderID);

                    case "buttons":
                        return fb.sendButtonMessage(senderID, ({
                            text: applyBindVars(answer.responseText, bindVars),
                            data: answer.buttons.map(b => ({
                                title: applyBindVars(b.text, bindVars),
                                payload: [dialogId, b.id]
                                    .concat(bindVars)
                                    .concat(applyBindVars(b.text, bindVars)).join("|")
                            }))
                        }))
                }
            }, curDelay);
            curDelay += answer.responseType === "typing" ? answer.typeDelay : 0;
        });
    };


    const onTextMessage = (messageText, senderID) => {
        rp.get({
            uri: `${process.env.FROG}?text=${encodeURIComponent(messageText)}`,
        }).then(tagAnalysis => {
            const bestMatch = matchNlp(dialogs.transformAnalysis(tagAnalysis));
            if (bestMatch === null) {
                fb.sendTextMessage(senderID, "[TODO]: terugvaltekst");
            } else {
                const {answers} = bestMatch.dialog;
                handleAnswers(senderID, bestMatch.dialog.id, answers.filter(a => a.parentId === null));
            }
        });
    };

    const onAttachments = (senderID) => {};


    const onPostback = (senderID, payload) => {

        if (payload === dialogs.START_CONV_ID) {
            const { answers } = dialogs.listDialogs().find(d => d.id === dialogs.START_CONV_ID) || {};
            if (typeof answers !== 'undefined') {
                handleAnswers(senderID, dialogs.START_CONV_ID, answers.filter(a => a.parentId === null));
            }
        } else {
            const [dialogId, parentId, ...bindVars] = payload.split("|");
            const dialog = dialogs.listDialogs().find(d => d.id === dialogId);
            if (typeof dialog === 'undefined') {
                return;
            }
            const {answers} = dialog;
            handleAnswers(senderID, dialog.id, answers.filter(a => a.parentId === parentId), bindVars);
        }
    };

    return {
        onAttachments: onAttachments,
        onPostback: onPostback,
        onTextMessage: onTextMessage
    }
};