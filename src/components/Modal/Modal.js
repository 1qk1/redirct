import React from "react";
import PropTypes from "prop-types";

import Classes from "./Modal.module.scss";

const Modal = props => {
  if (!Boolean(props.show)) return null;
  return (
    <div className={`${Classes.ModalWrapper} ${props.wrapperClasses || ""}`}>
      <div
        onClick={props.close}
        className={`${Classes.Backdrop} ${props.backdropClasses || ""}`}
      />
      <div className={`${Classes.Modal} ${props.modalClasses || ""}`}>
        {props.children}
      </div>
    </div>
  );
};

Modal.propTypes = {
  children: PropTypes.element.isRequired,
  show: PropTypes.bool.isRequired,
  backdropClasses: PropTypes.string,
  modalClasses: PropTypes.string,
  wrapperClasses: PropTypes.string,
  close: PropTypes.func
};

export default Modal;
