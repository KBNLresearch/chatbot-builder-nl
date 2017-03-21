import React from "react";

const ModalCb  = ({closeCallback, title, children}) => (
    <div className="modal show" style={{backgroundColor: "#0002"}}>
        <div className="modal-lg modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <a onClick={closeCallback} className="close">
                        &times;
                    </a>
                    <h4 className="modal-title">{title}</h4>
                </div>
                {children}
            </div>
        </div>
    </div>
);

ModalCb.propTypes = {
    closeCallback: React.PropTypes.func.isRequired,
    title: React.PropTypes.string.isRequired
};

export default ModalCb;