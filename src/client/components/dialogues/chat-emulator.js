import React from "react";
import ReactDOM from "react-dom";
import Typing from "./answers/typing";
import TextAnswer from "./answers/text";
import ButtonAnswer from "./answers/buttons";
import ImageAnswer from "./answers/image";
import UrlAnswer from "./answers/url";

const handlers = {
    onSwapUp: () => { },
    onSwapDown: () => { },
    onRemove: () => { },
    onChange: () => { }
};

const answerMap = {
    sendTextMessage: (props) => <TextAnswer {...props} />,
    sendButtonMessage: (props) => <ButtonAnswer {...props} />,
    sendURL: (props) => <UrlAnswer {...props} />,
    sendImageMessage: (props) => <ImageAnswer {...props} />,
    userMessage: (props) => (<div key={props.key} className="text-right">
        <span className="label label-primary">
            {props.responseText}
        </span>
    </div>)
};


class ChatEmulator extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            msg: ""
        }
    }

    sendMsg() {
        const { onSendChatMessage } = this.props;
        onSendChatMessage("text", this.state.msg);
        this.setState({msg: ""});
    }

    componentDidUpdate() {
        const domNode = ReactDOM.findDOMNode(this).querySelector(".chat");
        domNode.scrollTop = domNode.scrollHeight;
    }

    render() {
        const { onSendChatMessage, onClearChat } = this.props;
        const { responses, typingOn } = this.props.chat;
        const typing = typingOn ? <Typing {...handlers} responseText="..." /> : null;
        return (
            <div className="panel panel-default col-md-12 col-sm-16 col-xs-21"
                 style={{height: window.innerHeight - 100}}>
                <div className="panel-heading">
                    <span className="glyphicon glyphicon-trash pull-right"
                          onClick={onClearChat}
                          style={{cursor: "pointer"}} />
                    Chat emulator
                </div>
                <div className="panel-body chat" style={{height: "calc(100% - 87px)", overflowY: "auto"}}>
                    {responses.map((response, i) => answerMap[response.responseType]({
                            ...handlers,
                            onSelectButton: (payload) => onSendChatMessage("postback", payload,
                                (response.responseData.buttons.filter(b => b.payload === payload)[0] || {}).title),
                            key: i,
                            responseText: response.responseData.responseText,
                            url: response.responseData.url,
                            responseDelay: 0,
                            buttons: (response.responseData.buttons || []).map(b => ({
                                text: b.title,
                                id: b.payload
                            }))
                    }))}
                    {typing}
                </div>
                <div className="panel-footer">
                    <div className="input-group">
                        <input className="form-control" type="text" placeholder="Typ een bericht..."
                                value={this.state.msg}
                                onChange={(ev) => this.setState({msg: ev.target.value})}
                               onKeyPress={(ev) => ev.key === 'Enter' ? this.sendMsg() : false}
                        />
                        <span className="input-group-addon" style={{cursor: "pointer"}}
                              onClick={() => this.sendMsg()}>
                            <span className="glyphicon glyphicon-send" style={{cursor: "pointer"}} />
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChatEmulator;