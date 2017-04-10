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