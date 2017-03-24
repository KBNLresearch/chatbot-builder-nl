import React from "react";
import ButtonWithModal from "../modals/button-with-modal";
import AnswerFormBody from "./answer-form/form-body";

const initialState = {
    responseType: "",
    responseText: "",
    responseDelay: "",
    typeDelay: "",
    buttons: [],
    url: "",
    newButtonText: "",
    modalOpen: false
};

class AnswerForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            ...initialState
        };
    }


    onConfirm() {
        const { responseType, responseText, responseDelay, typeDelay, buttons, url } = this.state;
        this.props.onAddAnswer({
            responseType: responseType,
            responseText: responseText,
            responseDelay: responseDelay,
            typeDelay: typeDelay,
            buttons: buttons,
            url: url
        });
        this.setState(initialState);
    }

    typedComplete() {
        const { responseType } = this.state;
        switch (responseType) {
            case "text":
                return this.state.responseText.length > 0;
            case "buttons":
                return this.state.responseText.length > 0 && this.state.buttons.length > 0;
            case "url":
                return this.state.url.length > 0 && this.state.responseText.length > 0;
            case "image":
                return this.state.url.length > 0;
            case "typing":
                return this.state.typeDelay.length > 0;
            default:
                return true;
        }
    }

    baseComplete() {
        const { responseType, responseDelay } = this.state;
        return responseType.length > 0 && responseDelay.length > 0;
    }


    render() {
        const { modalOpen } = this.state;


        return (
            <ButtonWithModal className="btn btn-default" altLabel="Voeg antwoord toe"
                             label="Voeg een antwoord toe"
                             dialogueOpen={modalOpen}
                             onOpen={() => this.setState({modalOpen: true})}
                             disabled={!(this.baseComplete() && this.typedComplete()) }
                             onConfirm={this.onConfirm.bind(this)}
                             onClose={() => this.setState({modalOpen: false})}>

                <AnswerFormBody {...this.state}
                        setParentState={this.setState.bind(this)}
                        baseComplete={this.baseComplete.bind(this)}
                />
            </ButtonWithModal>
        );
    }
}

export default AnswerForm;