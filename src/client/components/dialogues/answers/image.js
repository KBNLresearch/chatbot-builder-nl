import React from "react";

class ImageAnswer extends React.Component {

    render() {
        const { responseText, responseDelay, url } = this.props;
        return (
            <div>
                {responseText} <i>(na {responseDelay} milliseconden)</i><br />
                <img src={url} style={{maxWidth: "100%", maxHeight: "300px"}} />
            </div>
        );
    }
}

export default ImageAnswer;