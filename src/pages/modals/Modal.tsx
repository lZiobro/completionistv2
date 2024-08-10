const Modal = (props: { children: any }) => {
  return (
    <div className="modal">
      <div className="modal-content">{props.children}</div>
    </div>
  );
};

export default Modal;
