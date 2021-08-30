import ReactDOM from "react-dom";
import WinModal from "./winModal";

const Modal = ({ winner }) => {
  return ReactDOM.createPortal(
    <WinModal name={winner} />,
    document.getElementById("win")
  );
};

export default Modal;
