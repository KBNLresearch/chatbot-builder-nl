import React from "react";
import AnswerWrapper from "./wrapper";
import highlightVars from "./highlight-vars";

class TextAnswer extends React.Component {

    render() {
        const { responseText, responseDelay } = this.props;
        return (
            <AnswerWrapper {...this.props}>
                {highlightVars(responseText)} <i>(na {responseDelay} milliseconden)</i>
            </AnswerWrapper>
        );
    }
}

export default TextAnswer;