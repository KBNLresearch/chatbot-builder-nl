import React from "react";
import ModalCb from "./modal-with-close-callback";

class ButtonWithModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dialogueOpen: props.dialogueOpen || false
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({dialogueOpen: nextProps.dialogueOpen})
    }

    closeDialogue() {
        this.setState({dialogueOpen: false});
    }

    render() {
        const { dialogueOpen } = this.state;
        const { disabled } = this.props;

        return  dialogueOpen ? (
            <ModalCb  title={this.props.altLabel || this.props.label} closeCallback={() => this.setState({dialogueOpen: false})}>
                <div className="modal-body">
                    {this.props.children}
                </div>
                <div className="modal-footer">
                    <button className={this.props.className}
                            disabled={disabled}
                            onClick={() => this.props.onConfirm(this.closeDialogue.bind(this))}>
                        {this.props.altLabel || this.props.label}
                    </button>
                </div>
            </ModalCb>
        ) : <button className={this.props.className} onClick={() => {this.props.onOpen(); this.setState({dialogueOpen: true})}}>
                {this.props.label}
            </button>
    }
}

ButtonWithModal.defaultProps = {
    disabled: false,
    dialogueOpen: false,
    altLabel: null,
    onOpen: () => {}
};

ButtonWithModal.propTypes = {
    className: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    onConfirm: React.PropTypes.func.isRequired,
    disabled: React.PropTypes.bool,
    onOpen: React.PropTypes.func,
    dialogueOpen: React.PropTypes.bool,
    altLabel: React.PropTypes.string,
};

export default ButtonWithModal;