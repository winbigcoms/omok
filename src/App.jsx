import "./App.css";
import { useCallback, useEffect, useState } from "react";
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
  //  타입에 따라서 가로 혹은 세로 기준으로 정렬
  //  {
  //    5:[1,2,4] 세로 5번에 가로 1,2,4가 있음 이런 식으로 정렬
  //  }
  arr.forEach((numArr) => {
    if (arrSetObject[numArr[sortMethod]]) {
      arrSetObject[numArr[sortMethod]].push(numArr[Math.abs(sortMethod - 1)]);
    } else {
      arrSetObject[numArr[sortMethod]] = [numArr[Math.abs(sortMethod - 1)]];
    }
  });

  let result = false;

  for (let line in arrSetObject) {
    // 해당 줄의 아이템이 5개이하면 무시, 같은 줄에 5개 이상히면 스트레이트 일 수 있음
    if (arrSetObject[line].length < 5) {
      continue;
    }
    // 아이템을 복사 해서 오름차순으로 정렬
    const lineData = [...arrSetObject[line]];
    lineData.sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));
    // 오름차순으로 정렬된 아이템을 순회, 다음 값이 이전 값의
    let isRight = 0;
    for (let i = 0; i < lineData.length - 1; i++) {
      // 이전값 +1이 다음 값이라면 isRight +1
      if (lineData[i] + 1 === lineData[i + 1]) {
        isRight++;
      } else {
        // 아니면 isRight 리셋
        // 단 2345 7 인 경우 앞에서 스트레이트가 만들어질 경우에 대한 처리로 끊긴 시점의 isRight 체크
        if (isRight === 4) {
          result = true;
          break;
        }
        isRight = 0;
      }
    }
    // 다 돌았을 때 스트레이트면 브레이크
    if (isRight === 4) {
      result = true;
      break;
    }
  }

  return result;
};
// 대각선 확인 함수
const isDiagonalStright = (type, arr, idx = 0, count = 0) => {
  // 대각선에 있는 좌표를 검색
  const next = arr.find((ele) => {
    return type === "down"
      ? ele[0] === arr[idx][0] + 1 && ele[1] === arr[idx][1] + 1
      : ele[0] === arr[idx][0] - 1 && ele[1] === arr[idx][1] + 1;
  });

  const nextIdx = arr.indexOf(next);
  // 있으면 해당 좌표의 인덱스값으로 재귀 없으면 그냥 리턴, 단 재귀한 수가 4번이면 스트레이트
  if (nextIdx !== -1) {
    count = count + 1;
    return isDiagonalStright(type, arr, arr.indexOf(next), count);
  } else {
    if (count === 4) {
      return true;
    }
    return false;
  }
};

// 대각선 확인 리턴 함수
const checkDiagonal = (arr) => {
  let result = false;
  // 대상 배열 복사 후 용도에 맞게 정렬,
  // 대각선은 왼위 에서 오른아래 혹은 왼 아래 에서 오른 위 두가지니까 2개로
  const downDiag = [...arr];
  const upDiag = [...arr];

  downDiag.sort((a, b) => (a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0));
  upDiag.sort((a, b) => (a[0] < b[0] ? 1 : a[0] > b[0] ? -1 : 0));

  // 뒤에서 5번째 까지만 체크, 4번째부터는 어차피 안됨
  for (let i = 0; i < arr.length - 4; i++) {
    const checkLeftDown = isDiagonalStright("down", downDiag, i);
    const checkRightUp = isDiagonalStright("up", upDiag, i);
    if (checkLeftDown || checkRightUp) {
      result = true;
      break;
    }
  }
  return result;
};

const checkOmok = (arr) => {
  // 스트레이트 확인
  let isColStrigh = checkStright(arr, "col");
  let isRowStrigh = checkStright(arr, "row");
  // 대각선 확인
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

  const resetGame = useCallback(() => {
    setResult(() => "");
    setUserA(() => []);
    setUserB(() => []);
  }, []);

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
        marginTop: "50px",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
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
      </FlexBox>
      {
        <div
          style={{
            width: "200px",
          }}
        >
          턴 {turn ? "빨" : "파"}
        </div>
      }
      {result !== "" && <Modal winner={result} resetGame={resetGame} />}
    </FlexBox>
  );
}

export default App;
