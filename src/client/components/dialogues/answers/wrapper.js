import React from "react";
import AnswerEdit from "../answer-form/edit-form";

class AnswerWrapper extends React.Component {
    constructor(props) {
        super(props);

        this.state = { editIsOpen: false };
    }

    render() {
        const editForm = this.state.editIsOpen
            ? <AnswerEdit {...this.props}
                onConfirm={this.props.onChange}
                onClose={() => this.setState({editIsOpen: false})}/>
            : null;
        return (
            <div className="row answer">
                <div className="col-md-28 col-sm-28 col-xs-28">
                    {this.props.children}
                </div>
                <div className="col-md-4 col-sm-4 col-xs-4 tools">
                    <span onClick={this.props.onRemove} className="glyphicon glyphicon-remove" />
                    <span onClick={() => this.setState({editIsOpen: true})} className="glyphicon glyphicon-edit" />
                    <span onClick={this.props.onSwapDown} className="glyphicon glyphicon-arrow-down" />
                    <span onClick={this.props.onSwapUp} className="glyphicon glyphicon-arrow-up" />
                </div>
                {editForm}
            </div>
        );
    }
}

AnswerWrapper.propTypes = {
    onSwapUp: React.PropTypes.func.isRequired,
    onSwapDown: React.PropTypes.func.isRequired,
    onRemove:  React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func.isRequired
};

export default AnswerWrapper;