import React from "react";

class TextAnswer extends React.Component {

    render() {
        const { responseText, responseDelay } = this.props;
        return (
            <div>
                {responseText} <i>(na {responseDelay} milliseconden)</i>
            </div>
        );
    }
}

export default TextAnswer;