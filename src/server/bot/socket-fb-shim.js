module.exports = (webSocket) => {

    const sendData = (payload) => {
        try {
            webSocket.send(payload);
        } catch (e) {
            console.log("failed to send to socket");
        }
    };

    const sendTypingOn = (recipientID) => sendData(JSON.stringify({type: 'sendTypingOn', recipientID: recipientID}));
    const sendTypingOff =  (recipientID) => sendData(JSON.stringify({type: 'sendTypingOff', recipientID: recipientID}));

    const sendTextMessage = (recipientID, text) => sendData(JSON.stringify({
        type: 'sendTextMessage',
        recipientID: recipientID,
        data: {
            responseText: text
        }
    }));

    const sendURL = (recipientID, url, text) => sendData(JSON.stringify({
        type: 'sendURL',
        recipientID: recipientID,
        data: {
            responseText: text,
            url: url
        }
    }));

    const sendButtonMessage = (recipientID, {text, data}) => sendData(JSON.stringify({
        type: 'sendButtonMessage',
        recipientID: recipientID,
        data: {
            responseText: text,
            buttons: data
        }
    }));

    const sendImageMessage = (recipientID, url) => sendData(JSON.stringify({
        type: 'sendImageMessage',
        recipientID: recipientID,
        data: {
            url: url
        }
    }));

    const sendImageCarousel = (recipientID, images) => sendData(JSON.stringify({
        type: 'sendImageCarousel',
        recipientID: recipientID,
        data: {
            images: images
        }
    }));

    return {
        sendTypingOn: sendTypingOn,
        sendTypingOff: sendTypingOff,
        sendURL: sendURL,
        sendButtonMessage: sendButtonMessage,
        sendTextMessage: sendTextMessage,
        sendImageMessage: sendImageMessage,
        sendImageCarousel: sendImageCarousel
    };
};