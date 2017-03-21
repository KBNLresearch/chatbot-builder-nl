import React from "react";
import DialogIndex from "./dialogues/dialog-index";

class App extends React.Component {

    render() {
        return (
            <div>
                <div className="navbar navbar-default">
                    <div className="container container-fluid">
                        <div className="navbar-brand">
                            Chatbot builder
                        </div>
                    </div>
                </div>
                <div className="container container-fluid">
                    <div className="row">
                        <ul className="list-group col-md-8">
                            <li className="list-group-item">
                                <h5>Welkomstboodschap</h5>

                            </li>
                            <DialogIndex dialogs={this.props.dialogs}
                                         onRemoveDialog={this.props.onRemoveDialog}
                                         onAddDialog={this.props.onAddDialog} />
                        </ul>

                        <div className="col-md-16">

                        </div>

                        <div className="col-md-8">

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;