const fs = require("fs");
const chatbot = require("chatbot-builder-nl");
const gvn = require("./gvn");
const CronJob = require('cron').CronJob;

const fileDir = process.env.FILE_DIR || "./files";
const registrationsFile = `${fileDir}/registrations.json`;

const saveRegistrations = (registrations) => {
    console.log("saving", registrations)
    if (!fs.existsSync(fileDir)) { fs.mkdirSync(fileDir); }
    fs.writeFileSync(registrationsFile, JSON.stringify(registrations));
};

const listRegistrations = () => {
    if (fs.existsSync(registrationsFile)) {
        return JSON.parse(fs.readFileSync(registrationsFile));
    } else {
        return [];
    }
};

const register = (recipientID, time) => {
    console.log(recipientID, typeof recipientID);
    if (`${recipientID}`.match(/^[0-9]+$/)) {
        saveRegistrations(listRegistrations()
            .filter(r => r.recipientID !== recipientID)
            .concat({recipientID: `${recipientID}`, time: time}));
    }
};

const unregister = (recipientID) =>
    saveRegistrations(listRegistrations().filter(r => r.recipientID !== `${recipientID}`));

const sendDigest = (time) =>
    listRegistrations().filter(r => r.time === time).forEach(r => {
        console.log(`Sending the ${time} digest to ${r.recipientID}`);
        gvn.surpise({payload: `webhook|${process.env.PROXY_A_WEBHOOK}?operation=surprise`, params: [], onSucces: (answers) =>
            chatbot.handlers.handleAnswers(r.recipientID, "webhook", answers.concat({
                responseText: "Klik hier om af te melden voor de dagelijkse update",
                responseType: "buttons",
                responseDelay: 1000,
                buttons: [{
                    text: "Afmelden",
                    payload: `webhook|${process.env.PROXY_A_WEBHOOK}?operation=unregister`
                }]
            }))
        });
    });

new CronJob({
    cronTime: '00 00 07 * * *',
    timeZone: "Europe/Amsterdam",
    onTick: () => sendDigest('07.00 uur')
}).start();

new CronJob({
    cronTime: '00 00 12 * * *',
    timeZone: "Europe/Amsterdam",
    onTick: () => sendDigest('12.00 uur')
}).start();

new CronJob({
    cronTime: '00 00 17 * * *',
    timeZone: "Europe/Amsterdam",
    onTick: () => sendDigest('17.00 uur')
}).start();

module.exports = { register, unregister };
