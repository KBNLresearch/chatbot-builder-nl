const fs = require("fs"),
    uuid = require("uuid"),
    rp = require("request-promise");

const fileDir = process.env.FILE_DIR || "./files";
const dialogFile = `${fileDir}/dialogs.json`;
const greetingFile = `${fileDir}/greeting.txt`;

const START_CONV_ID = "__start_conversation__";

const transformAnalysis = (tagResponse) =>
    tagResponse
        .split("\n")
        .filter(row => row.trim().length > 0)
        .map(wordAnalysis => {
            const [exact, norm, form, pos] = wordAnalysis.split("\t");
            return {
                exact: exact,
                norm: norm,
                form: form,
                pos: pos,
                selected: form.indexOf("N") === 0 || form === "UH"
            }
        });

const makeNewDialog = (userText, tagResponse, id = null) => {

    const tagAnalysis = transformAnalysis(tagResponse);

    return {
        id: id || uuid(),
        userText: userText,
        tagAnalysis: tagAnalysis,
        answers: []
    };
};

const makeNewAnswer = (data, parentId = null) => ({
    id: uuid(),
    responseType: data.responseType,
    responseText: data.responseText,
    responseDelay: parseInt(data.responseDelay, 10),
    typeDelay: parseInt(data.typeDelay, 10),
    buttons: data.buttons.map(button => ({text: button, id: uuid()})),
    url: data.url,
    parentId: parentId
});

const saveDialogs = (dialogs) => {
    if (!fs.existsSync(fileDir)) { fs.mkdirSync(fileDir); }
    fs.writeFileSync(dialogFile, JSON.stringify(dialogs));
    const fd = fs.openSync(dialogFile, "r+");
    fs.fsyncSync(fd);
};

const saveGreeting = (greeting) => {
    if (!fs.existsSync(fileDir)) { fs.mkdirSync(fileDir); }
    fs.writeFileSync(greetingFile, greeting);
    const fd = fs.openSync(greetingFile, "r+");
    fs.fsyncSync(fd);
};

const loadGreeting = () => {
    if (fs.existsSync(greetingFile)) {
        return fs.readFileSync(greetingFile).toString('utf8');
    } else {
        return ""
    }
};

const listDialogs = () => {
    if (fs.existsSync(dialogFile)) {
        return JSON.parse(fs.readFileSync(dialogFile));
    } else {
        return [];
    }
};


const addDialog = (userText, next) => {
    const dialogs = listDialogs();


    rp.get({
        uri: `${process.env.FROG}?text=${encodeURIComponent(userText)}`,
    }).then(tagAnalysis => {
        const newDialog = makeNewDialog(userText, tagAnalysis);
        dialogs.push(newDialog);
        saveDialogs(dialogs);
        next(newDialog.id);
    });
};

const updateDialog = (userText, id, next) => {
    const currentDialog = listDialogs().find(d => d.id === id);

    rp.get({
        uri: `${process.env.FROG}?text=${encodeURIComponent(userText)}`,
    }).then(tagAnalysis => {
        const updatedDialog = Object.assign(
            makeNewDialog(userText, tagAnalysis, id),
            { answers: currentDialog.answers});

        saveDialogs(listDialogs().map(d => d.id === id ? updatedDialog : d));
        next();
    });
};

const addStartDialog = () => {
    const dialogs = listDialogs().filter(d => d.id !== START_CONV_ID);
    dialogs.push(makeNewDialog("Aan de slag", "", START_CONV_ID));
    saveDialogs(dialogs);

    rp.post({
        uri: `https://graph.facebook.com/v2.6/me/messenger_profile?access_token=${process.env.MESSENGER_PAGE_ACCESS_TOKEN}`,
        body: {
            "get_started":{
                "payload": START_CONV_ID
            }
        },
        json: true
    }).catch((err) =>
        console.error(err, JSON.stringify(err, null, 2))
    ).then((body) =>
        console.log("Created get started button: ", JSON.stringify(body, null, 2))
    )
};

const removeDialog = (id) => {
    const dialogs = listDialogs();
    if (id === START_CONV_ID) {
        rp.delete({
            uri: `https://graph.facebook.com/v2.6/me/messenger_profile?access_token=${process.env.MESSENGER_PAGE_ACCESS_TOKEN}`,
            body: {
                "fields": ["get_started"]
            },
            json: true
        }).catch((err) =>
            console.error(err, JSON.stringify(err, null, 2))
        ).then((body) =>
            console.log("Deleted get started button: ", JSON.stringify(body, null, 2))
        )
    }
    saveDialogs(dialogs.filter(dialog => dialog.id !== id));
};

const togglePhrasePart = (id, word) => {
    const dialogs = listDialogs();

    saveDialogs(dialogs.map(dialog => (
       dialog.id === id
           ? Object.assign(dialog, {
                tagAnalysis: dialog.tagAnalysis.map((w) => w.exact === word
                    ? Object.assign(w, {selected: !w.selected})
                    : w
                )
           })
       : dialog
    )));
};

const addAnswer = (id, data, parentId) => {
    const dialogs = listDialogs();

    saveDialogs(dialogs.map(dialog => (
        dialog.id === id
            ? Object.assign(
                dialog, {
                    answers: dialog.answers.concat(makeNewAnswer(data, parentId))
                })
            : dialog
    )));
};

const swapAnswers = (answers, answerId, direction) => {
    const { parentId } = answers.find(a => a.id === answerId);
    const neighboursWithIdx = answers
        .map((a, idx) => ({idx: idx, answer: a}))
        .filter(a => a.answer.parentId === parentId)
        .map((n, idx) => ({idx: idx, neighbour: n}));

    const answerWithIdx = neighboursWithIdx.find(n => n.neighbour.answer.id === answerId);

    const {idx: nIdx, neighbour: {idx: aIdx, answer } } = answerWithIdx;
    const swapWith = direction === "up"
        ? neighboursWithIdx[nIdx - 1]
        : neighboursWithIdx[nIdx + 1];

    if (typeof swapWith === 'undefined') { return answers; }

    answers[aIdx] = answers[swapWith.neighbour.idx];
    answers[swapWith.neighbour.idx] = answer;
    return answers;
};

const swapAnswer = (id, answerId, direction) => {
    const dialogs = listDialogs();

    saveDialogs(dialogs.map(dialog =>
        dialog.id === id
            ? Object.assign(dialog, {
                answers: swapAnswers(dialog.answers, answerId, direction)
            })
            : dialog
    ));
};

const findDescendantsFor = (answers, buttonIds, result = []) => {
    const descendants = answers.filter(a => buttonIds.indexOf(a.parentId) > -1);

    if (descendants.length === 0) {
        return result;
    } else {
        return findDescendantsFor(answers, descendants
            .map(d => (d.buttons || []).map(b => b.id))
            .reduce((a, b) => a.concat(b), []),
            result.concat(descendants.map(d => d.id)));
    }
};

const removeFromAnswers = (answers, answerId) => {
    const { buttons } = answers.find(a => a.id === answerId);

    const childAnswers = findDescendantsFor(answers, (buttons || []).map(b => b.id));

    return answers
        .filter(a => a.id !== answerId)
        .filter(a => childAnswers.indexOf(a.id) < 0);

};

const removeAnswer = (id, answerId) => {
    const dialogs = listDialogs();

    saveDialogs(dialogs.map(dialog =>
        dialog.id === id
            ? Object.assign(dialog, {
                answers: removeFromAnswers(dialog.answers, answerId)
            })
            : dialog
    ));
};

const updateAnswer = (id, answerId, data) => {
    if (answerId !== data.id) {
        return;
    }

    saveDialogs(listDialogs().map(dialog =>
        dialog.id === id
            ? Object.assign(dialog, {
            answers: dialog.answers.map(a => a.id === answerId ? data : a)
        })
        : dialog
    ));
};

const importFile = (dialogs) => {
    saveDialogs(dialogs);
};

module.exports = {
    addDialog, updateDialog, listDialogs, removeDialog, togglePhrasePart, addAnswer, transformAnalysis, swapAnswer,
    removeAnswer, updateAnswer, addStartDialog, importFile, START_CONV_ID,
    saveGreeting, loadGreeting
};