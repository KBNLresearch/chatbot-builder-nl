const fs = require("fs"),
    uuid = require("uuid"),
    rp = require("request-promise");

const dialogFile = "./files/dialogs.json";

const makeNewDialog = (userText, tagResponse) => {

    const tagAnalysis = tagResponse
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

    return {
        id: uuid(),
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
    }).then(tagAnalysis => {
        const newDialog = makeNewDialog(userText, tagAnalysis);
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

module.exports = { addDialog, listDialogs, removeDialog, togglePhrasePart, addAnswer }