import React from "react";
import ModalCb from "./modal-with-close-callback";

class ButtonWithModal extends React.Component {

    render() {
        const { disabled, dialogueOpen } = this.props;

        return  dialogueOpen ? (
            <ModalCb  title={this.props.altLabel || this.props.label} closeCallback={this.props.onClose}>
                <div className="modal-body">
                    {this.props.children}
                </div>
                <div className="modal-footer">
                    <button className={this.props.className}
                            disabled={disabled}
                            onClick={this.props.onConfirm}>
                        {this.props.altLabel || this.props.label}
                    </button>
                </div>
            </ModalCb>
        ) : <button className={this.props.className} onClick={this.props.onOpen}>
                {this.props.label}
            </button>
    }
}

ButtonWithModal.defaultProps = {
    disabled: false,
    dialogueOpen: false,
    altLabel: null,
};

ButtonWithModal.propTypes = {
    className: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    onConfirm: React.PropTypes.func.isRequired,
    onOpen: React.PropTypes.func.isRequired,
    onClose: React.PropTypes.func.isRequired,
    disabled: React.PropTypes.bool,
    dialogueOpen: React.PropTypes.bool,
    altLabel: React.PropTypes.string,
};

export default ButtonWithModal;