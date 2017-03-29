module.exports = (webSocket) => {

    const sendTypingOn = (...args) => webSocket.send(JSON.stringify({type: 'sendTypingOn', data: args}));
    const sendTypingOff =  (...args) => webSocket.send(JSON.stringify({type: 'sendTypingOff', data: args}));
    const sendURL = (...args) => webSocket.send(JSON.stringify({type: 'sendURL', data: args}));
    const sendButtonMessage = (...args) => webSocket.send(JSON.stringify({type: 'sendButtonMessage', data: args}));
    const sendTextMessage = (...args) => webSocket.send(JSON.stringify({type: 'sendTextMessage', data: args}));
    const sendImageMessage = (...args) => webSocket.send(JSON.stringify({type: 'sendImageMessage', data: args}));

    return {
        sendTypingOn: sendTypingOn,
        sendTypingOff: sendTypingOff,
        sendURL: sendURL,
        sendButtonMessage: sendButtonMessage,
        sendTextMessage: sendTextMessage,
        sendImageMessage: sendImageMessage,
    };
};