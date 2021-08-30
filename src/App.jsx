import "./App.css";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Modal from "./Modal";

const FlexBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: cetner;
`;

const OmokCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: cetner;
  width: 40px;
  height: 40px;
  border: 1px solid #000;
  background-color: ${(props) =>
    props.owner === "A" ? "red" : props.owner === "B" ? "blue" : "inherit"};
  position: relative;
  &:hover::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: ${(props) => (props.owner === "N" ? "#333" : "inherit")};
    width: 20px;
    height: 20px;
    border-radius: 10px;
  }
`;
const checkStright = (arr, type) => {
  const sortMethod = type === "col" ? 1 : 0;
  let arrSetObject = {};

  arr.forEach((numArr) => {
    if (arrSetObject[numArr[sortMethod]]) {
      arrSetObject[numArr[sortMethod]].push(numArr[Math.abs(sortMethod - 1)]);
    } else {
      arrSetObject[numArr[sortMethod]] = [numArr[Math.abs(sortMethod - 1)]];
    }
  });

  let result = false;

  for (let line in arrSetObject) {
    if (arrSetObject[line].length < 5) {
      continue;
    }
    const lineData = [...arrSetObject[line]];
    lineData.sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));

    let isRight = 0;
    for (let i = 0; i < lineData.length - 1; i++) {
      if (lineData[i] + 1 === lineData[i + 1]) {
        isRight++;
      } else {
        if (isRight === 4) {
          result = true;
          break;
        }
        isRight = 0;
      }
    }
    if (isRight === 4) {
      result = true;
      break;
    }
  }

  return result;
};

const checkDiagonalFun = (type, arr, idx = 0, count = 0) => {
  const next = arr.find((ele) => {
    return type === "down"
      ? ele[0] === arr[idx][0] + 1 && ele[1] === arr[idx][1] + 1
      : ele[0] === arr[idx][0] - 1 && ele[1] === arr[idx][1] + 1;
  });

  const nextIdx = arr.indexOf(next);

  if (nextIdx !== -1) {
    count = count + 1;
    return checkDiagonalFun(type, arr, arr.indexOf(next), count);
  } else {
    if (count === 4) {
      return true;
    }
    return false;
  }
};

const checkDiagonal = (arr) => {
  const downDiag = [...arr];
  const upDiag = [...arr];

  downDiag.sort((a, b) => (a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0));
  upDiag.sort((a, b) => (a[0] < b[0] ? 1 : a[0] > b[0] ? -1 : 0));
  // 왼쪽에서 오른쪽으로 내려간다. +1, +1
  let isDIag = false;

  for (let i = 0; i < arr.length - 4; i++) {
    const checkLeftDown = checkDiagonalFun("down", downDiag, i);
    const checkRightUp = checkDiagonalFun("up", upDiag, i);
    if (checkLeftDown || checkRightUp) {
      isDIag = true;
      break;
    }
  }
  // 왼쪽에서 오른쪽으로 올라간다. -1, +1
  return isDIag;
};

const checkOmok = (arr) => {
  // 스트레이트 확인
  let isColStrigh = checkStright(arr, "col");
  let isRowStrigh = checkStright(arr, "row");
  let isDiagonal = checkDiagonal(arr);
  if (isRowStrigh || isColStrigh || isDiagonal) return true;
  return false;
};

const checkEnd = (arr, name) => {
  if (arr.length < 5) return false;

  const point = arr.map((data) => data.split(",").map((data) => +data));
  if (checkOmok(point)) return name;

  return "";
};

function App() {
  const line = [];
  const [turn, setTurn] = useState(false);
  const [userA, setUserA] = useState([]);
  const [userB, setUserB] = useState([]);
  const [result, setResult] = useState("");
  for (let i = 0; i < 16; i++) {
    line.push(i);
  }

  const onClickHandler = (e) => {
    if (e.target.dataset.owner !== "N") return;
    if (result) return;
    if (turn) {
      setUserA((state) => [...state, e.target.dataset.cell]);
    } else {
      setUserB((state) => [...state, e.target.dataset.cell]);
    }
    setTurn((state) => !state);
  };

  useEffect(() => {
    let res;
    if (!turn) {
      res = checkEnd(userA, "red");
    } else {
      res = checkEnd(userB, "blue");
    }

    if (res) {
      setResult(() => res);
    }
  }, [turn, userA, userB]);

  return (
    <FlexBox
      style={{
        width: `${16 * 40}px`,
        flexWrap: "wrap",
      }}
      className="App"
    >
      {line.map((_, col) => (
        <div
          key={col}
          style={{
            width: `${16 * 40}px`,
            display: "flex",
          }}
        >
          {line.map((_, row) => (
            <OmokCell
              key={row}
              data-cell={col + "," + row}
              data-owner={
                userA.includes(col + "," + row)
                  ? "A"
                  : userB.includes(col + "," + row)
                  ? "B"
                  : "N"
              }
              owner={
                userA.includes(col + "," + row)
                  ? "A"
                  : userB.includes(col + "," + row)
                  ? "B"
                  : "N"
              }
              onClick={onClickHandler}
            ></OmokCell>
          ))}
        </div>
      ))}
      {result ? <Modal winner={result} /> : <div>턴 {turn ? "빨" : "파"}</div>}
    </FlexBox>
  );
}

export default App;
