const config = {
    "appId": process.env.FB_APP_ID,
    "appSecret": process.env.MESSENGER_APP_SECRET,
    "pageId": process.env.FB_PAGE_ID,
    "pageAccessToken": process.env.MESSENGER_PAGE_ACCESS_TOKEN,
    "validationToken": process.env.MESSENGER_VALIDATION_TOKEN,
    "serverURL": process.env.SERVER_URL,
    "pathPrefix": "",
    "port": process.env.PORT
};

const
    dialogs = require('./dialogs'),
    fb = require("./fb/fb-lib")(config),
    botHandlers = require("./bot/handlers")(fb);

module.exports = {
    dialogs: dialogs,
    fb: fb,
    handlers: botHandlers
};