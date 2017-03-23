import React from "react";
import AnswerForm from "./answer-form";
import AnswerList from "./answer-list";
import DialogTree from "./dialog-tree";

class DialogEdit extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            buttonChoices: []
        }
    }
    componentWillReceiveProps(nextProps) {
        if (typeof nextProps.dialog === 'undefined') {
            this.props.onRedirectToRoot();
        } else if ((nextProps.dialog || {}).id !== (this.props.dialog || {}).id) {
            this.setState({buttonChoices: []});
        }

    }

    componentDidMount() {
        if (typeof this.props.dialog === 'undefined') {
            this.props.onRedirectToRoot();
        }
    }

    setRootButtonChoice(buttonId) {
        this.setState({buttonChoices: [buttonId]});
    }

    setButtonChoiceAt(pos, buttonId) {
        this.setState({buttonChoices: this.state.buttonChoices.slice(0, pos).concat(buttonId)});
    }

    removeButtonChoiceForAnswer(answerId) {
        const { dialog: { answers } } = this.props;
        const { buttons } = answers.filter(a => a.id === answerId)[0];
        const { buttonChoices } = this.state;

        const currentButtons = buttons.map(b => b.id);
        const choice = buttonChoices
            .map((bId, idx) => ({buttonId: bId, idx: idx}))
            .filter(b => currentButtons.indexOf(b.buttonId) > -1)[0];

        if (typeof choice !== 'undefined') {
            if (choice.idx === 0) {
                this.setState({buttonChoices: []})
            } else {
                this.setState({buttonChoices: this.state.buttonChoices.slice(0, choice.idx)});
            }
        }
    }

    render() {
        const { dialog } = this.props;

        if (typeof dialog === 'undefined') { return null; }

        const { tagAnalysis } = dialog;
        const { onSwapUp, onSwapDown, onRemoveAnswer } = this.props;

        return (
            <div className="panel panel-default col-md-25">
                <div className="panel-heading">
                    Dialoog: '{dialog.userText}'
                </div>
                <div className="panel-body">
                    <div className="row">
                        <div className="col-md-16"></div>
                        <div className="col-md-16">
                            <i>Gebruiker</i><br />
                            {tagAnalysis.map((word, i) => (
                                <span key={i}
                                      onClick={() => this.props.onTogglePartOfMatchPhrase(dialog.id, word.exact)}
                                      className={`label ${word.selected ? "label-primary" : "label-default"}`}
                                      style={{marginRight: 4, cursor: "pointer"}}>
                                    {word.exact}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-16">
                            <i>Bot</i><br />
                            <AnswerList
                                answers={dialog.answers.filter(a => a.parentId === null)}
                                onSelectButton={(buttonId) => this.setRootButtonChoice(buttonId)}
                                onSwapUp={(answerId) => onSwapUp(answerId, dialog.id)}
                                onSwapDown={(answerId) => onSwapDown(answerId, dialog.id)}
                                onRemoveAnswer={(answerId) => {
                                    this.removeButtonChoiceForAnswer(answerId);
                                    onRemoveAnswer(answerId, dialog.id)
                                }}
                                selectedButton={this.state.buttonChoices.length > 0 ? this.state.buttonChoices[0] : null}
                            />
                            <hr />
                            <AnswerForm onAddAnswer={(data) => this.props.onAddAnswer({dialogId: dialog.id, data: data})} />
                            <hr />
                        </div>
                    </div>
                    <DialogTree dialog={dialog}
                                onSelectButton={(buttonId, pos) => this.setButtonChoiceAt(pos, buttonId)}
                                buttonChoices={this.state.buttonChoices}
                                onSwapUp={(answerId) => onSwapUp(answerId, dialog.id)}
                                onSwapDown={(answerId) => onSwapDown(answerId, dialog.id)}
                                onRemoveAnswer={(answerId) => {
                                    this.removeButtonChoiceForAnswer(answerId);
                                    onRemoveAnswer(answerId, dialog.id)
                                }}
                                onAddAnswer={this.props.onAddAnswer} />
                    <pre >
                        {JSON.stringify(dialog, null, 2)}
                    </pre>
                </div>
            </div>
        );
    }
}

export default DialogEdit;