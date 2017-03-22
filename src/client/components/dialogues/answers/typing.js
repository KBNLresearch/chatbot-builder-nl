import React from "react";

class TypingAnswer extends React.Component {

    render() {
        const { responseText, responseDelay, typeDelay } = this.props;
        return (
            <div>
                <span className="label label-default">{responseText}</span> <i>(na {responseDelay} milliseconden en duurt {typeDelay})</i>
            </div>
        );
    }
}

export default TypingAnswer;