import React from "react";
import AnswerWrapper from "./wrapper";

class ImageAnswer extends React.Component {

    render() {
        const { responseDelay, url} = this.props;
        return (
            <AnswerWrapper {...this.props}>
                <img src={url} style={{maxWidth: "100%", maxHeight: "300px"}} />
                <i>(na {responseDelay} milliseconden)</i><br />
            </AnswerWrapper>
        );
    }
}

export default ImageAnswer;