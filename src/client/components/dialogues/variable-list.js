import React from "react"

const getButtonText = (answers, bId) =>
    answers
        .map(a => a.buttons)
        .reduce((a, b) => a.concat(b), [])
        .filter(button => button.id === bId)
        .map(button => button.text);

class VariableList extends React.Component {

    render() {
        const { dialog : { tagAnalysis, answers }, buttonChoices } = this.props;

        const boundVars = tagAnalysis.filter(t => t.selected && t.exact === "%");

        return (
            <div className="col-md-8">
                <h4>Variabelen</h4>
                <hr />
                {boundVars.map((_, i) => (
                    <div key={i}>
                        <span className="label label-success">${i + 1}</span>{" "}
                        <span className="label label-default">Gebruikersinvoer</span>
                        <hr />
                    </div>
                ))}
                {buttonChoices.map((bId, i) => (
                    <div key={i}>
                        <span className="label label-success">${i + boundVars.length + 1}</span>{" "}
                        <span className="label label-default">{getButtonText(answers, bId)}</span>
                        <hr />
                    </div>
                ))}


            </div>
        )
    }
}

export default VariableList;