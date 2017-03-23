const crypto = require('crypto'),
    https = require('https'),
    request = require('request');

/*
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
module.exports = (config) => {

    // Arbitrary value used to validate a webhook
    const VALIDATION_TOKEN = config.validationToken;
    // App Secret can be retrieved from the App Dashboard
    const APP_SECRET = config.appSecret;
    // Generate a page access token for your page from the App Dashboard
    const PAGE_ACCESS_TOKEN = config.pageAccessToken;

    /*
     * Use your own validation token. Check that the token used in the Webhook
     * setup is the same token used here.
     *
     */
    function validateWebhook(req, res) {
        if (req.query['hub.mode'] === 'subscribe' &&
            req.query['hub.verify_token'] === VALIDATION_TOKEN) {
            console.log("Validating webhook");
            res.status(200).send(req.query['hub.challenge']);
        } else {
            console.error("Failed validation. Make sure the validation tokens match.");
            res.sendStatus(403);
        }
    }


    /*
     * Call the Send API. The message data goes in the body. If successful, we'll
     * get the message id in a response
     *
     */
    function callSendAPI(messageData) {
        if (process.env.MODE === 'mock') {
            console.log(JSON.stringify(messageData, null, 2));
            return;
        }

        request({
            uri: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token: PAGE_ACCESS_TOKEN},
            method: 'POST',
            json: messageData

        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                const recipientId = body.recipient_id;
                const messageId = body.message_id;

                if (messageId) {
                    console.log("Successfully sent message with id %s to recipient %s", messageId, recipientId);
                } else {
                    console.log("Successfully called Send API for recipient %s", recipientId);
                }
                console.log("Message data was:", JSON.stringify(messageData, null, 2));
                console.log("=====\n\n")

            } else {
                console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
                console.error("Message data was:", JSON.stringify(messageData, null, 2));
                console.error("=====\n\n")
            }
        });
    }

    /*
     * Turn typing indicator on
     *
     */
    function sendTypingOn(recipientId) {
        console.log("Turning typing indicator on");

        const messageData = {
            recipient: {
                id: recipientId
            },
            sender_action: "typing_on"
        };

        callSendAPI(messageData);
    }

    /*
     * Turn typing indicator off
     *
     */
    function sendTypingOff(recipientId) {
        console.log("Turning typing indicator off");

        const messageData = {
            recipient: {
                id: recipientId
            },
            sender_action: "typing_off"
        };

        callSendAPI(messageData);
    }

    /*
     * Verify that the callback came from Facebook. Using the App Secret from
     * the App Dashboard, we can verify the signature that is sent with each
     * callback in the x-hub-signature field, located in the header.
     *
     * https://developers.facebook.com/docs/graph-api/webhooks#setup
     *
     */
    function verifyRequestSignature(req, res, buf) {
        if (req.path.indexOf("/webhook") !== 0) {
            return;
        }
        const signature = req.headers["x-hub-signature"];

        if (!signature) {
            // For testing, let's log an error. In production, you should throw an
            // error.
            console.error("Couldn't validate the signature.");
        } else {
            const elements = signature.split('=');
            const method = elements[0];
            const signatureHash = elements[1];

            const expectedHash = crypto.createHmac('sha1', APP_SECRET)
                .update(buf)
                .digest('hex');

            if (signatureHash != expectedHash) {
                throw new Error("Couldn't validate the request signature.");
            }
        }
    }

    /*
     * Message Event
     *
     * This event is called when a message is sent to your page. The 'message'
     * object format can vary depending on the kind of message that was received.
     * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received
     *
     * For this example, we're going to echo any text that we get. If we get some
     * special keywords ('button', 'generic', 'receipt'), then we'll send back
     * examples of those bubbles to illustrate the special message bubbles we've
     * created. If we receive a message with an attachment (image, video, audio),
     * then we'll simply confirm that we've received the attachment.
     *
     */
    function receivedMessage(event, { onTextMessage, onAttachments}) {
        const senderID = event.sender.id;
        const recipientID = event.recipient.id;
        const timeOfMessage = event.timestamp;
        const message = event.message;

        console.log("Received message for user %d and page %d at %d with message:", senderID, recipientID, timeOfMessage);
        console.log(JSON.stringify(message));

        const isEcho = message.is_echo;
        const messageId = message.mid;
        const appId = message.app_id;
        const metadata = message.metadata;
        const quickReply = message.quick_reply;

        if (isEcho) {
            // Just logging message echoes to console
            console.log("Received echo for message %s and app %d with metadata %s", messageId, appId, metadata);
            return;
        } else if (quickReply) {
            const quickReplyPayload = quickReply.payload;
            console.log("Quick reply for message %s with payload %s", messageId, quickReplyPayload);
            fb.sendTextMessage(senderID, "Quick reply tapped");
            return;
        }
        // You may get a text or attachment but not both
        const messageText = message.text;

        // Currently the only type we support is text
        if (messageText) {
            onTextMessage(messageText, senderID)
        } else {
            onAttachments(senderID);
        }
    }

    /*
     * Postback Event
     *
     * This event is called when a postback is tapped on a Structured Message.
     * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
     *
     */
    function receivedPostback(event, {onPostback}) {
        const senderID = event.sender.id;
        const recipientID = event.recipient.id;
        const timeOfPostback = event.timestamp;

        // The 'payload' param is a developer-defined field which is set in a postback
        // button for Structured Messages.
        const payload = event.postback.payload;

        console.log("Received postback for user %d and page %d with payload '%s' " +
            "at %d", senderID, recipientID, payload, timeOfPostback);

        onPostback(senderID, payload);
    }

    /*
     * Delivery Confirmation Event
     *
     * This event is sent to confirm the delivery of a message. Read more about
     * these fields at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-delivered
     *
     */
    function receivedDeliveryConfirmation(event) {
        const delivery = event.delivery;
        const messageIDs = delivery.mids;
        const watermark = delivery.watermark;
        if (messageIDs) {
            messageIDs.forEach(function (messageID) {
                console.log("Received delivery confirmation for message ID: %s",
                    messageID);
            });
        }

        console.log("All message before %d were delivered.", watermark);
    }

    /*
     * Message Read Event
     *
     * This event is called when a previously-sent message has been read.
     * https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-read
     *
     */
    function receivedMessageRead(event) {
        // All messages before watermark (a timestamp) or sequence have been seen.
        const watermark = event.read.watermark;
        const sequenceNumber = event.read.seq;

        console.log("Received message read event for watermark %d and sequence " +
            "number %d", watermark, sequenceNumber);
    }

    /*
     * Send an image using the Send API.
     *
     */
    function sendImageMessage(recipientId, url) {
        url = `${url}`;

        callSendAPI({
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: 'image',
                    payload: {
                        url: url
                    }
                }
            }
        });
    }

    /*
     * Send a text message using the Send API.
     *
     */
    function sendTextMessage(recipientId, messageText) {
        const messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                text: messageText,
                metadata: "DEVELOPER_DEFINED_METADATA"
            }
        };

        callSendAPI(messageData);
    }

    /*
     * Send a button message using the Send API.
     *
     */
    function sendButtonMessage(recipientId, buttons) {
        const data = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        "template_type": "button",
                        "text": buttons.text,
                        buttons: buttons.data.map((b) => {
                            return {
                                type: "postback",
                                title: b.title,
                                payload: b.payload
                            }
                        })
                    }
                }
            }
        };

        callSendAPI(data);
    }

    function sendURL(recId, url, text) {
        callSendAPI({
            recipient: {
                id: recId
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        "template_type": "button",
                        "text": text,
                        buttons: [{
                            type: "web_url",
                            url: url,
                            title: "Lees verder"
                        }]
                    }
                }
            }
        })
    }


    return {
        validateWebhook: validateWebhook,
        verifyRequestSignature: verifyRequestSignature,
        sendTypingOn: sendTypingOn,
        sendTypingOff: sendTypingOff,
        sendURL: sendURL,
        sendButtonMessage: sendButtonMessage,
        sendTextMessage: sendTextMessage,
        sendImageMessage: sendImageMessage,
        receivedDeliveryConfirmation: receivedDeliveryConfirmation,
        receivedMessageRead: receivedMessageRead,
        receivedMessage: receivedMessage,
        receivedPostback: receivedPostback
    }
};