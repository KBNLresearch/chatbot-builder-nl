import React from "react";
import ButtonWithModal from "../modals/button-with-modal";

const initialState = {
    responseType: "",
    responseText: "",
    responseDelay: "",
    typeDelay: "",
    buttons: [],
    url: "",
    newButtonText: "",
    modalOpen: false
}

class AnswerForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            ...initialState
        };
    }


    onConfirm() {
        const { responseType, responseText, responseDelay, typeDelay, buttons, url } = this.state;
        this.props.onAddAnswer({
            responseType: responseType,
            responseText: responseText,
            responseDelay: responseDelay,
            typeDelay: typeDelay,
            buttons: buttons,
            url: url
        });
        this.setState(initialState);
    }

    setType(ev) {
        this.setState({responseType: ev.target.value});
        const newResponseText =  ev.target.value === "typing"
            ?  "..."
            : "";

        this.setState({responseText: newResponseText, responseDelay: "", buttons: []});
    }

    buttonFields(disabled) {
        const { buttons, newButtonText } = this.state;
        return (<div>
            <h4>Knoppen toevoegen</h4>
            {buttons.map((button, i) => (
                <button key={i} className="btn btn-default"
                        onClick={() => this.setState({buttons: buttons.filter(b => b !== button)})}>
                    {button}
                </button>
            ))}

            <input type="text"  value={newButtonText}
                   onChange={(ev) => this.setState({newButtonText: ev.target.value})}
                   onKeyPress={(ev) => ev.key === 'Enter' ? this.setState({buttons: buttons.concat(newButtonText), newButtonText: ""}) : false }
                   disabled={disabled} placeholder="Knoptekst" />

            <button className="btn btn-default"
                    onClick={() => this.setState({buttons: buttons.concat(newButtonText), newButtonText: ""})}
                    disabled={disabled || newButtonText.length === 0}>
                Knop toevoegen
            </button>
        </div>);
    }

    urlFields(disabled, placeholder) {
        const { url, responseText } = this.state;
        return (<div>
            <h4>Linktekst</h4>
            <input className="form-control"
                   value={responseText}
                   onChange={(ev) => this.setState({responseText: ev.target.value})}
                   placeholder="Linktekst..."
                   disabled={disabled} />
            <h4>Webadres</h4>
            <input type="text" className="form-control"
                   onChange={(ev) => this.setState({url: ev.target.value})}
                   value={url} placeholder={placeholder} disabled={disabled} />
        </div>);
    }

    imageFields(disabled, placeholder) {
        const { url } = this.state;
        return (<div>
            <h4>Afbeelding</h4>
            <input type="text" className="form-control"
                   onChange={(ev) => this.setState({url: ev.target.value})}
                   value={url} placeholder={placeholder} disabled={disabled} />
        </div>);
    }

    textFields(disabled) {
        const { responseText } = this.state;
        return (<div>
            <h4>Antwoordtekst</h4>
            <input className="form-control"
                   value={responseText}
                   onChange={(ev) => this.setState({responseText: ev.target.value})}
                   placeholder="Antwoordtekst..."
                   disabled={disabled} />
        </div>);
    }

    typingFields(disabled) {
        const { typeDelay } = this.state;
        return (<div>
            <h4>Tijd aan het typen</h4>
            <select className="form-control" value={typeDelay}
                    disabled={disabled}
                    onChange={(ev) => this.setState({typeDelay: ev.target.value})}>
                <option value="">- Selecteer een lengte -</option>
                <option value="500">Halve seconde</option>
                <option value="1000">Seconde</option>
                <option value="3000">3 Seconden</option>
                <option value="5000">5 Seconden</option>
            </select>
        </div>)
    }

    getSpecFields(disabled) {
        const { responseType } = this.state;
        switch (responseType) {
            case "text":
                return this.textFields(disabled);
            case "buttons":
                return this.buttonFields(disabled);
            case "url":
                return this.urlFields(disabled, "Webadres...");
            case "image":
                return this.imageFields(disabled, "Webadres van afbeelding...");
            case "typing":
                return this.typingFields(disabled);
            default:
                return null;
        }
    }

    typedComplete() {
        const { responseType } = this.state;
        switch (responseType) {
            case "text":
                return this.state.responseText.length > 0;
            case "buttons":
                return this.state.buttons.length > 0;
            case "url":
                return this.state.url.length > 0 && this.state.responseText.length > 0;
            case "image":
                return this.state.url.length > 0;
            case "typing":
                return this.state.typeDelay.length > 0;
            default:
                return true;
        }
    }

    baseComplete() {
        const { responseType, responseText, responseDelay } = this.state;
        return responseType.length > 0 && responseDelay.length > 0;
    }

    render() {
        const {responseType, responseText, responseDelay, modalOpen } = this.state;

        const specFields = this.getSpecFields(!this.baseComplete());

        return (
            <ButtonWithModal className="btn btn-default" altLabel="Voeg antwoord toe"
                             label="Voeg een antwoord toe"
                             dialogueOpen={modalOpen}
                             onOpen={() => this.setState({modalOpen: true})}
                             disabled={!(this.baseComplete() && this.typedComplete()) }
                             onConfirm={this.onConfirm.bind(this)}
                             onClose={() => this.setState({modalOpen: false})}>

                <h4>Antwoordtype</h4>
                <select className="form-control" value={responseType} onChange={this.setType.bind(this)}>
                    <option value="">- Selecteer een type -</option>
                    <option value="text">Tekst</option>
                    <option value="buttons">Knoppen</option>
                    <option value="url">URL</option>
                    <option value="image">Afbeelding</option>
                    <option value="typing">Aan het typen</option>
                </select>

                <h4>Vertraging</h4>
                <select className="form-control" value={responseDelay}
                        disabled={responseType.length === 0}
                        onChange={(ev) => this.setState({responseDelay: ev.target.value})}>
                    <option value="">- Selecteer vertragingstijd -</option>
                    <option value="0">Direct reageren</option>
                    <option value="500">Halve seconde</option>
                    <option value="1000">Seconde</option>
                    <option value="3000">3 Seconden</option>
                    <option value="5000">5 Seconden</option>
                </select>
                {specFields}
            </ButtonWithModal>
        );
    }
}

export default AnswerForm;