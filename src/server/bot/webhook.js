module.exports = (fb, handlers) => function (req, res) {
    const data = req.body;

    // Make sure this is a page subscription
    if (data.object == 'page') {
        // Iterate over each entry
        // There may be multiple if batched
        data.entry.forEach(function (pageEntry) {

            // Iterate over each messaging event
            pageEntry.messaging.forEach(function (messagingEvent) {
                if (messagingEvent.message) {
                    fb.receivedMessage(messagingEvent, handlers);
                } else if (messagingEvent.delivery) {
                    fb.receivedDeliveryConfirmation(messagingEvent);
                } else if (messagingEvent.postback) {
                    fb.receivedPostback(messagingEvent, handlers);
                } else if (messagingEvent.read) {
                    fb.receivedMessageRead(messagingEvent);
                } else {
                    console.log("Webhook received unimplemented messagingEvent: ", messagingEvent);
                }
            });
        });

        // Assume all went well.
        //
        // You must send back a 200, within 20 seconds, to let us know you've
        // successfully received the callback. Otherwise, the request will time out.
        res.sendStatus(200);
    }
};