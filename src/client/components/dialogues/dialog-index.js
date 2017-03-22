import React from "react";
import AddDialog from "./add-dialog";
import RemoveDialog from "./remove-dialog";
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
                            <RemoveDialog dialog={dialog} onRemoveDialog={this.props.onRemoveDialog} />
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