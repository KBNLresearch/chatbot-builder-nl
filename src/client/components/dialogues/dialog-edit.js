import React from "react";

class DialogEdit extends React.Component {

    render() {
        return (
            <pre>
                {JSON.stringify(this.props.dialog, null, 2)}
            </pre>
        );
    }
}

export default DialogEdit;