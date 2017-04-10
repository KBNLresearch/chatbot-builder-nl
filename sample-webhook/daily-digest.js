const chatbot = require("chatbot-builder-nl");
const gvn = require("./gvn");
const CronJob = require('cron').CronJob;


const test = new CronJob({
    cronTime: '00 59 08 * * *',
    timeZone: "Europe/Amsterdam",
    onTick: () => {
        console.log("testing")
    }
});
console.log("hello?");
test.start();


console.log(chatbot);

/*
gvn.surpise({payload: "", params: [], onSucces: (answers) =>
    chatbot.handlers.han
})*/
