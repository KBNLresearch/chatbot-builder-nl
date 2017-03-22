import React from "react";
import ButtonWithModal from "../modals/button-with-modal";

class AnswerForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            responseType: "",
            modalOpen: false
        };
    }

    render() {

        return (
            <ButtonWithModal className="btn btn-default" altLabel="Voeg antwoord toe"
                             label="Voeg een antwoord toe"
                             dialogueOpen={this.state.modalOpen}
                             onOpen={() => this.setState({modalOpen: true})}
                             disabled={this.state.responseType.length === 0}
                             onConfirm={() => { this.setState({modalOpen: false}); }}
                             onClose={() => this.setState({modalOpen: false})}>

                <select className="form-control"
                    onChange={(ev) => this.setState({responseType: ev.target.value})}>
                    <option value="">- Selecteer een type -</option>
                    <option value="text">Tekst</option>
                    <option value="buttons">Knoppen</option>
                    <option value="url">URL</option>
                    <option value="image">Afbeelding</option>
                    <option value="typing">Aan het typen</option>
                </select>


            </ButtonWithModal>

        );
    }
}

export default AnswerForm;