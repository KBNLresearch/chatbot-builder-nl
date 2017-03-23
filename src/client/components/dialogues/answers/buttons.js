import React from "react";
import AnswerWrapper from "./wrapper";

class ButtonAnswer extends React.Component {

    render() {
        const { responseText, responseDelay, buttons } = this.props;
        const { onSelectButton, selectedButton } = this.props;

        return (
            <AnswerWrapper {...this.props}>
                {responseText} <i>(na {responseDelay} milliseconden)</i><br />
                {buttons.map((button, i) => (
                    <button key={i}
                            onClick={() => onSelectButton(button.id)}
                            className={`btn ${selectedButton === button.id ? "btn-primary" : "btn-default"} btn-xs`}>
                        {button.text}
                    </button>
                ))}
            </AnswerWrapper>
        );
    }
}

export default ButtonAnswer;