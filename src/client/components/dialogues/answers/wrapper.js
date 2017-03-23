import React from "react";

class AnswerWrapper extends React.Component {


    render() {
        return (
            <div className="row answer">
                <div className="col-md-28 col-sm-28 col-xs-28">
                    {this.props.children}
                </div>
                <div className="col-md-4 col-sm-4 col-xs-4 tools">
                    <span className="glyphicon glyphicon-remove" />
                    <span className="glyphicon glyphicon-arrow-down" />
                    <span className="glyphicon glyphicon-arrow-up" />
                </div>
            </div>
        );
    }
}

export default AnswerWrapper;