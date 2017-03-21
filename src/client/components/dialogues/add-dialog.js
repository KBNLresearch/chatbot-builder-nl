import React from "react";
import ButtonWithModal from "../modals/button-with-modal";

class AddDialog extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userText: "",
            modalOpen: false
        };
    }

    onConfirm(onClose = () => {}) {
        const { userText } = this.state;
        onClose();
        this.setState({modalOpen: false, userText: ""});

        this.props.onAddDialog(userText);
    }

    render() {
        const { userText, modalOpen } = this.state;

        return (
            <ButtonWithModal className="btn btn-default" label="Voeg een dialoog toe"
                             disabled={userText.length < 1}
                             dialogueOpen={modalOpen}
                             onOpen={() => this.setState({modalOpen: true})}
                             onConfirm={this.onConfirm.bind(this)}>
                <input className="form-control" type="text"
                       onKeyPress={(ev) => ev.key === 'Enter' ? this.onConfirm() : false }
                       onChange={(ev) => this.setState({userText: ev.target.value})}
                       value={userText}
                       placeholder="Gebruiker zegt..." />
            </ButtonWithModal>
        );
    }
}

AddDialog.propTypes = {
    onAddDialog: React.PropTypes.func
};

export default AddDialog;