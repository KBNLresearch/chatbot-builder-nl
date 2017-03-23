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

    onConfirm() {
        const { userText } = this.state;
        this.setState({modalOpen: false, userText: ""});

        this.props.onAddDialog(userText);
    }

    render() {
        const { userText, modalOpen } = this.state;

        return (
            <ButtonWithModal className="btn btn-default" label={this.props.label}
                             disabled={userText.length < 1}
                             dialogueOpen={modalOpen}
                             onOpen={() => this.setState({modalOpen: true})}
                             onConfirm={this.onConfirm.bind(this)}
                             onClose={() => this.setState({modalOpen: false})}>
                <input className="form-control" type="text"
                       onKeyPress={(ev) => ev.key === 'Enter' ? this.onConfirm() : false }
                       onChange={(ev) => this.setState({userText: ev.target.value})}
                       value={userText}
                       placeholder={this.props.placeholder} />
            </ButtonWithModal>
        );
    }
}

AddDialog.propTypes = {
    onAddDialog: React.PropTypes.func,
    label: React.PropTypes.string.isRequired,
    placeholder: React.PropTypes.string.isRequired
};

export default AddDialog;