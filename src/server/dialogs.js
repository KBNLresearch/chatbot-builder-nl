const fs = require("fs"),
    uuid = require("uuid"),
    rp = require("request-promise");

const dialogFile = "./files/dialogs.json";

const makeNewDialog = (userText, frogResponse) => {

    const frogAnalysis = frogResponse
        .split("\n")
        .filter(row => row.trim().length > 0)
        .map(wordAnalysis => {
            const [_i, exact, norm, _j, form, _a, _b, _c, _d, pos] = wordAnalysis.split("\t");
            return {
                exact: exact,
                norm: norm,
                form: form,
                pos: pos
            }
        });

    return {
        id: uuid(),
        userText: userText,
        frogAnalysis: frogAnalysis,
        answers: [],
        matchPhrase: frogAnalysis.length > 1
            ? frogAnalysis
                .filter(f => f.form.indexOf("N") === 0)
                .map(f => f.exact)
            : [ frogAnalysis[0].exact ]
    };
};

const makeNewAnswer = (data, parentId = null) => ({
    responseType: data.responseType,
    responseText: data.responseText,
    responseDelay: parseInt(data.responseDelay, 10),
    typeDelay: parseInt(data.typeDelay, 10),
    buttons: data.buttons.map(button => ({text: button, id: uuid()})),
    url: data.url,
    parentId: parentId
});

const saveDialogs = (dialogs) => {
    fs.writeFileSync(dialogFile, JSON.stringify(dialogs));
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
    }).then(frogAnalysis => {
        const newDialog = makeNewDialog(userText, frogAnalysis);
        dialogs.push(newDialog);
        saveDialogs(dialogs);
        next(newDialog.id);
    });

};

const removeDialog = (id) => {
    const dialogs = listDialogs();

    saveDialogs(dialogs.filter(dialog => dialog.id !== id));
};

const togglePhrasePart = (id, word) => {
    const dialogs = listDialogs();

    saveDialogs(dialogs.map(dialog => (
       dialog.id === id
           ? Object.assign(
               dialog, {
               matchPhrase: dialog.matchPhrase.indexOf(word) > -1
                   ? dialog.matchPhrase.filter(w => w !== word)
                   : dialog.matchPhrase.concat(word)
           })
       : dialog
    )));
};

const addAnswer = (id, data) => {
    const dialogs = listDialogs();

    saveDialogs(dialogs.map(dialog => (
        dialog.id === id
            ? Object.assign(
                dialog, {
                    answers: dialog.answers.concat(makeNewAnswer(data))
                })
            : dialog
    )));
};

module.exports = { addDialog, listDialogs, removeDialog, togglePhrasePart, addAnswer }