import React from "react";
import DialogIndex from "./dialogues/dialog-index";
import AddDialog from "./dialogues/add-dialog";
import {Link} from "react-router";
import urls from "../urls";

class App extends React.Component {

    render() {
        const { onUpload, onSetGreeting, user: {username} } = this.props;

        const body = username ? (
            <div className="container container-fluid">
                <div className="row">
                    <ul className="list-group col-md-6 col-sm-8 col-xs-10">
                        <li className="list-group-item">
                            <h5>Chatbot testen</h5>
                            <Link to={urls.testDialog()} className="btn btn-default">
                                Open emulator
                            </Link>
                        </li>
                        <li className="list-group-item">
                            <h5>Welkomstboodschap</h5>
                            <AddDialog onAddDialog={onSetGreeting}
                                       label="Instellen"
                                       placeholder="Welkomstboodschap..."/>
                        </li>
                        <DialogIndex dialogs={this.props.dialogs}
                                     onRemoveDialog={this.props.onRemoveDialog}
                                     onAddDialog={this.props.onAddDialog}
                                     onCreateStartDialog={this.props.onCreateStartDialog} />
                        <li className="list-group-item">
                            <h5>Import / Export</h5>
                            <a className="btn btn-default" href="/download-dialog">
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
        ) : (<div className="container"><i>U bent niet ingelogd</i></div>);

        return (
            <div>
                <div className="navbar navbar-default">
                    <div className="container container-fluid">
                        <div className="navbar-brand">
                            Chatbot builder
                        </div>
                        <div className="navbar-form navbar-right">
                            {username ? `Ingelogd als ${username}` : (<a href="/login" className="btn btn-default">
                                Inloggen via facebook
                            </a>)}
                        </div>
                    </div>
                </div>

                {body}
            </div>
        );
    }
}

export default App;