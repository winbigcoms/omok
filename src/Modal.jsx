import ReactDOM from "react-dom";
import WinModal from "./winModal";

const Modal = ({ winner, resetGame }) => {
  return ReactDOM.createPortal(
    <WinModal name={winner} resetGame={resetGame} />,
    document.getElementById("win")
  );
};

export default Modal;
