import React from "react";
import AnswerWrapper from "./wrapper";

class UrlAnswer extends React.Component {

    render() {
        const { responseText, responseDelay, url } = this.props;
        return (
            <AnswerWrapper {...this.props}>
                <a className="btn btn-default btn-xs" href={url} target="_blank">
                    {responseText}
                </a> <i>(na {responseDelay} milliseconden)</i>
            </AnswerWrapper>
        );
    }
}

export default UrlAnswer;