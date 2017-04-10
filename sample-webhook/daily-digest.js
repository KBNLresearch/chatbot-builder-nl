const chatbot = require("chatbot-builder-nl");
const gvn = require("./gvn");
const CronJob = require('cron').CronJob;

/*

const test = new CronJob({
    cronTime: '00 59 08 * * *',
    timeZone: "Europe/Amsterdam",
    onTick: () => {
        console.log("testing")
    }
});
test.start();


gvn.surpise({payload: `webhook|${process.env.PROXY_A_WEBHOOK}?operation=surprise`, params: [], onSucces: (answers) =>
    chatbot.handlers.handleAnswers(1397278930293852, "webhook", answers) /!*senderID, dialogId, answers, bindVars =[]*!/
});
*/
