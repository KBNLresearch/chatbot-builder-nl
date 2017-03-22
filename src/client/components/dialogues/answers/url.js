import React from "react";

class UrlAnswer extends React.Component {

    render() {
        const { responseText, responseDelay, url } = this.props;
        return (
            <div>
                <a className="btn btn-default btn-xs" href={url} target="_blank">
                    {responseText}
                </a> <i>(na {responseDelay} milliseconden)</i>
            </div>
        );
    }
}

export default UrlAnswer;