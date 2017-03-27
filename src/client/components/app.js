import React from "react";
import DialogIndex from "./dialogues/dialog-index";
import AddDialog from "./dialogues/add-dialog";

class App extends React.Component {

    render() {
        const { onUpload, onSetGreeting } = this.props;
        return (
            <div className="container container-fluid">
                <div className="row">
                    <ul className="list-group col-md-6 col-sm-8 col-xs-10">
                        <li className="list-group-item">
                            <h5>Welkomstboodschap</h5>
                            <AddDialog onAddDialog={onSetGreeting}
                                       label="Pas welkomstboodschap aan"
                                       placeholder="Welkomstboodschap..."/>
                        </li>
                        <DialogIndex dialogs={this.props.dialogs}
                                     onRemoveDialog={this.props.onRemoveDialog}
                                     onAddDialog={this.props.onAddDialog}
                                     onCreateStartDialog={this.props.onCreateStartDialog} />
                        <li className="list-group-item">
                            <h5>Import / Export</h5>
                            <a className="btn btn-default" href="/dialogs/download">
                                Export downloaden
                            </a>

                            <label className="btn btn-default">
                                Export importeren <input type="file" onChange={onUpload} style={{display: "none"}} />
                            </label>
                        </li>
                    </ul>
                    <div className="col-xs-1 col-md-1 col-sm-1" />
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default App;