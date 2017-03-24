import React from "react";

class AnswerFormBody extends React.Component {
    setType(ev) {
        this.props.setParentState({responseType: ev.target.value});
        const newResponseText =  ev.target.value === "typing"
            ?  "..."
            : "";

        this.props.setParentState({responseText: newResponseText, responseDelay: "", buttons: []});
    }

    buttonFields(disabled) {
        const { buttons, newButtonText, responseText } = this.props;
        return (<div>
            <h4>Antwoordtekst</h4>
            <input className="form-control"
                   value={responseText}
                   onChange={(ev) => this.props.setParentState({responseText: ev.target.value})}
                   placeholder="Antwoordtekst..."
                   disabled={disabled} />
            <h4>Knoppen toevoegen</h4>
            {buttons.map((button, i) => (
                <button key={i} className="btn btn-default"
                        onClick={() => this.props.setParentState({buttons: buttons.filter(b => b !== button)})}>
                    {button}
                </button>
            ))}

            <input type="text"  value={newButtonText}
                   onChange={(ev) => this.props.setParentState({newButtonText: ev.target.value})}
                   onKeyPress={(ev) => ev.key === 'Enter' ? this.props.setParentState({buttons: buttons.concat(newButtonText), newButtonText: ""}) : false }
                   disabled={disabled} placeholder="Knoptekst" />

            <button className="btn btn-default"
                    onClick={() => this.props.setParentState({buttons: buttons.concat(newButtonText), newButtonText: ""})}
                    disabled={disabled || newButtonText.length === 0}>
                Knop toevoegen
            </button>
        </div>);
    }

    urlFields(disabled, placeholder) {
        const { url, responseText } = this.props;
        return (<div>
            <h4>Linktekst</h4>
            <input className="form-control"
                   value={responseText}
                   onChange={(ev) => this.props.setParentState({responseText: ev.target.value})}
                   placeholder="Linktekst..."
                   disabled={disabled} />
            <h4>Webadres</h4>
            <input type="text" className="form-control"
                   onChange={(ev) => this.props.setParentState({url: ev.target.value})}
                   value={url} placeholder={placeholder} disabled={disabled} />
        </div>);
    }

    imageFields(disabled, placeholder) {
        const { url } = this.props;
        return (<div>
            <h4>Afbeelding</h4>
            <input type="text" className="form-control"
                   onChange={(ev) => this.props.setParentState({url: ev.target.value})}
                   value={url} placeholder={placeholder} disabled={disabled} />
        </div>);
    }

    textFields(disabled) {
        const { responseText } = this.props;
        return (<div>
            <h4>Antwoordtekst</h4>
            <input className="form-control"
                   value={responseText}
                   onChange={(ev) => this.props.setParentState({responseText: ev.target.value})}
                   placeholder="Antwoordtekst..."
                   disabled={disabled} />
        </div>);
    }

    typingFields(disabled) {
        const { typeDelay } = this.props;
        return (<div>
            <h4>Tijd aan het typen</h4>
            <select className="form-control" value={typeDelay}
                    disabled={disabled}
                    onChange={(ev) => this.props.setParentState({typeDelay: ev.target.value})}>
                <option value="">- Selecteer een lengte -</option>
                <option value="500">Halve seconde</option>
                <option value="1000">Seconde</option>
                <option value="3000">3 Seconden</option>
                <option value="5000">5 Seconden</option>
            </select>
        </div>)
    }

    getSpecFields(disabled) {
        const { responseType } = this.props;
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


    render() {
        const {responseType, responseDelay } = this.props;

        const specFields = this.getSpecFields(!this.props.baseComplete());

        return (
            <div>
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
                        onChange={(ev) => this.props.setParentState({responseDelay: ev.target.value})}>
                    <option value="">- Selecteer vertragingstijd -</option>
                    <option value="0">Direct reageren</option>
                    <option value="500">Halve seconde</option>
                    <option value="1000">Seconde</option>
                    <option value="3000">3 Seconden</option>
                    <option value="5000">5 Seconden</option>
                </select>
                {specFields}
            </div>
        );
    }
}

AnswerFormBody.propTypes = {
    setParentState: React.PropTypes.func.isRequired,
    baseComplete:  React.PropTypes.func.isRequired
};

export default AnswerFormBody;