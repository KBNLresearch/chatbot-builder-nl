import React from "react";
import AnswerWrapper from "./wrapper";
import highlightVars from "./highlight-vars";

class WebhookAnswer extends React.Component {

    render() {
        const { responseDelay, url } = this.props;
        return (
            <AnswerWrapper {...this.props}>
                Antwoord van webhook op: {highlightVars(url)}  <i>(na {responseDelay} milliseconden)</i><br />
            </AnswerWrapper>
        );
    }
}

export default WebhookAnswer;