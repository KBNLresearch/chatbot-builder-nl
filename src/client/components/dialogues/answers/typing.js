import React from "react";
import AnswerWrapper from "./wrapper";

class TypingAnswer extends React.Component {

    render() {
        const { responseText, responseDelay, typeDelay } = this.props;
        return (
            <AnswerWrapper {...this.props}>
                <span className="label label-default">{responseText}</span>{" "}
                <i>(na {responseDelay} milliseconden en duurt {typeDelay})</i>
            </AnswerWrapper>
        );
    }
}

export default TypingAnswer;