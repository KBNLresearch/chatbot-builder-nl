import React from "react";

class ButtonAnswer extends React.Component {

    render() {
        const { responseText, responseDelay, buttons } = this.props;
        const { onSelectButton, selectedButton } = this.props;

        return (
            <div>
                {responseText} <i>(na {responseDelay} milliseconden)</i><br />
                {buttons.map((button, i) => (
                    <button key={i}
                            onClick={() => onSelectButton(button.id)}
                            className={`btn ${selectedButton === button.id ? "btn-primary" : "btn-default"} btn-xs`}>
                        {button.text}
                    </button>
                ))}
            </div>
        );
    }
}

export default ButtonAnswer;