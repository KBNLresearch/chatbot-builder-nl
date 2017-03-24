import React from "react";
import ModalCb from "../../modals/modal-with-close-callback";
import ModalBody from "../../modals/modal-body";
import AnswerFormBody from "./form-body";

/*
 responseType: "",
 responseText: "",
 responseDelay: "",
 typeDelay: "",
 buttons: [],
 url: "",
 newButtonText: "",
 */
const stateToFormProps = (state) => ({
    responseText: state.responseText,
    responseType: state.responseType,
    responseDelay: "" + state.responseDelay,
    typeDelay: "" + (state.typeDelay || 0),
    buttons: state.buttons.map(b => b.text),
    url: state.url,
    newButtonText: ""
});


class AnswerEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ...props
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps);
    }

    setStateFromForm(stateUpdate) {
        let newState = {};
        Object.keys(stateUpdate).forEach(key => {
           switch (key) {
               case "responseText":
               case "url":
                   newState[key] = stateUpdate[key];
                   break;
               case "responseDelay":
               case "typeDelay":
                   newState[key] = parseInt(stateUpdate[key], 10);
                   break;
               case "responseType":
               case "newButtonText":
               case "buttons":
                   console.warn("property cannot be altered");
           }
        });

        this.setState(newState);
    }

    baseComplete() {
        const { responseType, responseDelay } = this.state;
        return responseType.length > 0 && ("" + responseDelay).length > 0;
    }

    render() {
        return (
            <ModalCb closeCallback={this.props.onClose} title="Antwoord bewerken">
                <ModalBody>
                    <AnswerFormBody {...stateToFormProps(this.state)}
                                    setParentState={this.setStateFromForm.bind(this)}
                                    baseComplete={this.baseComplete.bind(this)}
                                    disabledFields={["responseType", "newButtonText", "buttons"]}
                    />
                </ModalBody>
                <div className="modal-footer">
                    <button className="btn btn-default">
                        Opslaan
                    </button>
                </div>
            </ModalCb>
        );
    }
}

AnswerEdit.propTypes = {
    onClose: React.PropTypes.func.isRequired
};

export default AnswerEdit;