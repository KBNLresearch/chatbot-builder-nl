import React from "react";

class AnswerWrapper extends React.Component {


    render() {
        return (
            <div className="row answer">
                <div className="col-md-28 col-sm-28 col-xs-28">
                    {this.props.children}
                </div>
                <div className="col-md-4 col-sm-4 col-xs-4 tools">
                    <span onClick={this.props.onRemove} className="glyphicon glyphicon-remove" />
                    <span className="glyphicon glyphicon-edit" />
                    <span onClick={this.props.onSwapDown} className="glyphicon glyphicon-arrow-down" />
                    <span onClick={this.props.onSwapUp} className="glyphicon glyphicon-arrow-up" />
                </div>
            </div>
        );
    }
}

AnswerWrapper.propTypes = {
    onSwapUp: React.PropTypes.func.isRequired,
    onSwapDown: React.PropTypes.func.isRequired,
    onRemove:  React.PropTypes.func.isRequired
};

export default AnswerWrapper;