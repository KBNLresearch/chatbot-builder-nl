import React from "react";
import ButtonWithModal from "../modals/button-with-modal";

class RemoveDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dialogOpen: false
        };
    }



    render() {
        const { dialog } = this.props;
        return (
            <ButtonWithModal onConfirm={() => this.props.onRemoveDialog(dialog.id)}
                             className="btn btn-xs btn-danger pull-right" label="✖" altLabel="Verwijderen"
                             onClose={() => this.setState({dialogOpen: false})}
                             onOpen={() => this.setState({dialogOpen: true})}
                             dialogueOpen={this.state.dialogOpen}>
                Weet je zeker dat je de dialoog '<strong>{dialog.userText}</strong>' wilt verwijderen?
            </ButtonWithModal>
        );
    }
}

export default RemoveDialog;