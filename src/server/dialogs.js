const fs = require("fs");
const uuid = require("uuid");
const dialogFile = "./files/dialogs.json";

const makeNewDialog = (userText) => ({
    id: uuid(),
    userText: userText
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


const addDialog = (userText) => {
    const dialogs = listDialogs();

    dialogs.push(makeNewDialog(userText));

    saveDialogs(dialogs);
};

const removeDialog = (id) => {
    const dialogs = listDialogs();

    saveDialogs(dialogs.filter(dialog => dialog.id !== id));
};


module.exports = { addDialog, listDialogs, removeDialog }