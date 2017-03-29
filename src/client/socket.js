import store from "./store";
import uuid from "uuid";
import ActionTypes from "./action-types";

const senderID = uuid();
// Use a web socket to get status updates
const connectSocket = () => {

    const webSocket = new WebSocket(globals.wsProtocol + "://" + globals.hostName + "/chat-socket");

    webSocket.onmessage = ({ data }) => {
        const { type, recipientID, data: messageData } = JSON.parse(data);
        if (recipientID === senderID) {
            store.dispatch({
                type: ActionTypes.RECEIVE_CHAT_RESPONSE,
                responseData: messageData,
                responseType: type
            });
        }
    };

    // Keep the websocket alive
    const pingWs = () => {
        webSocket.send("* ping! *");
        window.setTimeout(pingWs, 8000);
    };

    webSocket.onopen = pingWs;

    webSocket.onclose = () => {
        window.setTimeout(connectSocket, 500);
    };

    return (type, data) => {
        webSocket.send(JSON.stringify({
            senderID: senderID,
            type: type,
            data: data
        }));
    }
};


export default connectSocket;