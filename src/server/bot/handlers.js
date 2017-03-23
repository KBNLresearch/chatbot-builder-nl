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

    console.log(scored);
    return scored.filter(d => d.score > 15).length > 0 ? scored[0] : null;
};

module.exports = (fb) => {

    const handleAnswers = (senderID, dialogId, answers) => {
        let curDelay = 0;
        answers.forEach(answer => {
            curDelay += answer.responseDelay;
            setTimeout(() => {
                switch (answer.responseType) {
                    case "text": return fb.sendTextMessage(senderID, answer.responseText);
                    case "url": return fb.sendURL(senderID, answer.url, answer.responseText);
                    case "image": return fb.sendImageMessage(senderID, answer.url);
                    case "typing":
                        setTimeout(() => { fb.sendTypingOff(senderID); }, answer.typeDelay);
                        return fb.sendTypingOn(senderID);
                    case "buttons":
                        return fb.sendButtonMessage(senderID, ({
                            text: answer.responseText,
                            data: answer.buttons.map(b => ({
                                title: b.text,
                                payload: `${dialogId}|${b.id}`
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
        const [dialogId, parentId] = payload.split("|");
        const dialog = dialogs.listDialogs().find(d => d.id === dialogId);
        if (typeof dialog === 'undefined') { return; }
        const { answers } = dialog;
        handleAnswers(senderID, dialog.id, answers.filter(a => a.parentId === parentId));
    };

    return {
        onAttachments: onAttachments,
        onPostback: onPostback,
        onTextMessage: onTextMessage
    }
};