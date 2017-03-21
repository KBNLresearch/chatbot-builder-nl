import React from "react";
import AddDialog from "./add-dialog";
import ButtonWithModal from "../modals/button-with-modal";
import { Link } from "react-router";
import urls from "../../urls";

class DialogIndex extends React.Component {

    render() {

        return (
            <li className="list-group-item">
                <h5>Dialogen</h5>
                <ul className="list-group">
                    {this.props.dialogs.map((dialog, i) => (
                        <li className="list-group-item" key={i}>

                            <ButtonWithModal onConfirm={(onClose) => {onClose(); this.props.onRemoveDialog(dialog.id)}}
                                className="btn btn-xs btn-danger pull-right" label="✖" altLabel="Verwijderen">
                                Weet je zeker dat je de dialoog '<strong>{dialog.userText}</strong>' wilt verwijderen?
                            </ButtonWithModal>
                            <Link to={urls.dialogEdit(dialog.id)}>
                                {dialog.userText}
                            </Link>

                        </li>
                    ))}
                </ul>
                <AddDialog onAddDialog={this.props.onAddDialog} />
            </li>
        );
    }
}

export default DialogIndex;