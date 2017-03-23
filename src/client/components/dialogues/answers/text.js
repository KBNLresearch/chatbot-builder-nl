import React from "react";
import AnswerWrapper from "./wrapper";

class TextAnswer extends React.Component {

    render() {
        const { responseText, responseDelay } = this.props;
        return (
            <AnswerWrapper>
                {responseText} <i>(na {responseDelay} milliseconden)</i>
            </AnswerWrapper>
        );
    }
}

export default TextAnswer;