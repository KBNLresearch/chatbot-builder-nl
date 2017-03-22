import React from "react";
import AnswerForm from "./answer-form";

class DialogEdit extends React.Component {

    componentWillReceiveProps(nextProps) {
        if (typeof nextProps.dialog === 'undefined') {
            this.props.onRedirectToRoot();
        }
    }

    componentDidMount() {
        if (typeof this.props.dialog === 'undefined') {
            this.props.onRedirectToRoot();
        }
    }

    render() {
        const { dialog } = this.props;

        if (typeof dialog === 'undefined') { return null; }

        const { frogAnalysis, matchPhrase } = dialog;

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
                            {frogAnalysis.map((word, i) => (
                                <span key={i}
                                      onClick={() => this.props.onTogglePartOfMatchPhrase(dialog.id, word.exact)}
                                      className={`label ${matchPhrase.indexOf(word.exact) > -1 ? "label-primary" : "label-default"}`}
                                      style={{marginRight: 4, cursor: "pointer"}}>
                                    {word.exact}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-16">
                            <i>Bot</i><br />
                            <AnswerForm onAddAnswer={(data) => this.props.onAddAnswer({dialogId: dialog.id, data: data})} />
                        </div>
                    </div>

                    <pre >
                        {JSON.stringify(dialog, null, 2)}
                    </pre>
                </div>
            </div>
        );
    }
}

export default DialogEdit;