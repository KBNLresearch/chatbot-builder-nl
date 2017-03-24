import React from "react";
import ModalCb from "../../modals/modal-with-close-callback";
import ModalBody from "../../modals/modal-body";
import AnswerFormBody from "./form-body";

const stateToFormProps = (state) => ({
    responseText: state.responseText,
    responseType: state.responseType,
    responseDelay: "" + state.responseDelay,
    typeDelay: "" + (state.typeDelay || 0),
    buttons: state.buttons.map(b => b.text),
    url: state.url,
    newButtonText: ""
});

const stateFromProps = (props) => {
  let retVal = {};
  const filterKeys = [
      "id",
      "responseType",
      "responseText",
      "responseDelay",
      "typeDelay",
      "buttons",
      "url",
      "parentId"
  ];

  Object.keys(props).forEach(key => {
      if (filterKeys.indexOf(key) > -1) {
          retVal[key] = props[key]
      }
  });

  return retVal;
};


class AnswerEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = stateFromProps(props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(stateFromProps(nextProps));
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
                return ("" + this.state.typeDelay).length > 0;
            default:
                return true;
        }
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
                    <button className="btn btn-default"
                            onClick={() => { this.props.onConfirm(this.state); this.props.onClose()}}
                            disabled={!(this.baseComplete() && this.typedComplete())}>
                        Opslaan
                    </button>
                </div>
            </ModalCb>
        );
    }
}

AnswerEdit.propTypes = {
    onClose: React.PropTypes.func.isRequired,
    onConfirm: React.PropTypes.func.isRequired
};

export default AnswerEdit;