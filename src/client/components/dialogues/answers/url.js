import React from "react";
import AnswerWrapper from "./wrapper";
import highlightVars from "./highlight-vars";

class UrlAnswer extends React.Component {

    render() {
        const { responseText, responseDelay, url } = this.props;
        return (
            <AnswerWrapper {...this.props}>
                {highlightVars(responseText)}  <i>(na {responseDelay} milliseconden)</i><br />
                <a className="btn btn-default btn-xs" href={url} target="_blank">
                    Lees verder <i>({highlightVars(url)})</i>
                </a>
            </AnswerWrapper>
        );
    }
}

export default UrlAnswer;