import React from "react";
import AnswerForm from "./answer-form";
import AnswerList from "./answer-list";

class DialogTree extends React.Component {

    findButtonText(buttonId) {
        const { dialog: { answers } } = this.props;

        const button = answers.map(a => a.buttons).reduce((a, b) => a.concat(b), []).filter(button => button.id === buttonId)[0];

        return typeof button === "undefined"
            ? null
            : button.text;
    }

    render() {
        const { dialog, buttonChoices, onSelectButton, onSwapDown, onSwapUp, onRemoveAnswer } = this.props;


        return (
            <div>
                {buttonChoices.map((buttonId, buttonPos) => (
                    <div key={buttonId}>
                        <div className="row">
                            <div className="col-md-16"></div>
                            <div className="col-md-16">
                                <i>Gebruiker</i><br />
                                <span className="label label-primary">
                                    {this.findButtonText(buttonId)}
                                </span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-16">
                                <i>Bot</i><br />
                                <AnswerList
                                    answers={dialog.answers.filter(a => a.parentId === buttonId)}
                                    onSelectButton={(bId) => onSelectButton(bId, buttonPos + 1)}
                                    onSwapUp={onSwapUp}
                                    onSwapDown={onSwapDown}
                                    onRemoveAnswer={onRemoveAnswer}
                                    selectedButton={buttonChoices[buttonPos + 1]}
                                />
                                <hr />
                                <AnswerForm onAddAnswer={(data) => this.props.onAddAnswer({dialogId: dialog.id, data: data, parentId: buttonId})} />
                                <hr />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

export default DialogTree;