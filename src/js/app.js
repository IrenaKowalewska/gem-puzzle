import '../css/style.css';
import fieldConfig from './fieldConfig.js';

const saveStorage = JSON.parse(localStorage.getItem('save')) || { result: [] };

const gameParams = {
  fieldWidthHeightParam: 3,
  cellSize: 100,
  countMoves: 0,
  sec: 0,
  min: 0,
  fieldSize: 400
};

const emptyCellParams = {
  value: 15,
  top: 3,
  left: 3,
};

let cells = [];
cells.push(emptyCellParams);
let timeStop = false;

function createSelectButtons(n) {
  const fragment = document.createDocumentFragment();
  const MIN_PUZZLE_SIZE = 3;
  for (let i = 0; i < n; i += 1) {
    const button = document.createElement('button');
    button.classList.add('button', 'game-button');
    button.innerHTML = `${MIN_PUZZLE_SIZE + i} &#215; ${MIN_PUZZLE_SIZE + i}`;
    button.setAttribute('id', `${MIN_PUZZLE_SIZE + i}`);
    fragment.appendChild(button);
  }
  return fragment;
}

const field = document.createElement('div');
const endGameBlock = document.createElement('div');
const infoWrapper = document.createElement('div');
const moves = document.createElement('div');
const time = document.createElement('div');
const startNewGame = document.createElement('button');
const buttonsWrapper = document.createElement('div');
const rules = document.createElement('div');
const scoreButton = document.createElement('button');
const scoreInfo = document.createElement('div');
const clearButton = document.createElement('button');

field.classList.add('field', 'fade');
infoWrapper.classList.add('info-wrapper');
moves.innerHTML = `Moves: ${gameParams.countMoves}`;
moves.classList.add('moves', 'fade');
time.innerHTML = 'Time: 00:00';
time.classList.add('time', 'fade');
startNewGame.classList.add('button', 'start-button', 'fade');
startNewGame.innerHTML = 'Restart';
scoreButton.classList.add('button', 'score-button', 'fade');
scoreButton.innerHTML = 'Score';
clearButton.classList.add('button', 'clear-button', 'fade');
clearButton.innerHTML = 'Clear results';
scoreInfo.classList.add('score-info');
buttonsWrapper.classList.add('buttons-wrapper');
rules.classList.add('rules');
rules.innerHTML = `<div>Правила игры:
Игра представляет собой набор одинаковых квадратных костяшек с нанесёнными числами, 
заключённых в квадратную коробку. Длина стороны коробки в четыре раза больше длины 
стороны костяшек для набора из 15 элементов, соответственно в коробке остаётся 
незаполненным одно квадратное поле. Цель игры — перемещая костяшки по коробке, 
добиться упорядочивания их по номерам, желательно сделав как можно меньше перемещений.</div>`;
endGameBlock.classList.add('fade', 'block-end-game');

document.body.appendChild(endGameBlock);
document.body.appendChild(infoWrapper);
document.body.appendChild(field);
document.body.appendChild(scoreButton);
document.body.appendChild(scoreInfo);
document.body.appendChild(clearButton);
document.body.appendChild(buttonsWrapper);
infoWrapper.appendChild(moves);
infoWrapper.appendChild(startNewGame);
infoWrapper.appendChild(time);
buttonsWrapper.appendChild(rules);
buttonsWrapper.appendChild(createSelectButtons(fieldConfig.length));


const gameButtons = document.querySelectorAll('.game-button');

const addZero = (num) => (num < 10 ? `0${num}` : `${num}`);

const startGameTime = () => {
  gameParams.sec += 1;
  if (gameParams.sec > 59) {
    gameParams.sec = 0;
    gameParams.min += 1;
  }

  time.innerHTML = `Time: ${addZero(gameParams.min)}: ${addZero(gameParams.sec)}`;
  const timerId = setTimeout(startGameTime, 1000);
  if (timeStop) {
    clearTimeout(timerId);
  }
};

const setWord = (number) => {
  let insert = '';
  const num = number;
  switch (num % 10) {
    case 1:
      insert = 'ход';
      break;
    case 2:
    case 3:
    case 4:
      insert = 'хода';
      break;
    default:
      insert = 'ходов';
  }
  return insert;
};

const clearField = () => {
  field.innerHTML = '';
  gameParams.countMoves = 0;
  gameParams.sec = 0;
  gameParams.min = 0;
  scoreInfo.innerHTML = '';
};

const showResult = () => {
  endGameBlock.classList.toggle('fade');
  buttonsWrapper.classList.add('fade');
};

const fadeResult = () => {
  endGameBlock.classList.toggle('fade');
  buttonsWrapper.classList.remove('fade');
};

const changeFadeShowField = () => {
  buttonsWrapper.classList.toggle('fade');
  field.classList.toggle('fade');
  moves.classList.toggle('fade');
  time.classList.toggle('fade');
  startNewGame.classList.toggle('fade');
  scoreButton.classList.toggle('fade');
  clearButton.classList.toggle('fade');
};

function setLocalStorage(saveStorage) {
  localStorage.setItem('save', JSON.stringify(saveStorage));
}

function getLocalStorage() {
  const fragment = document.createDocumentFragment();
  const info = document.createElement('div');
  const { length } = saveStorage.result;
  saveStorage.result.sort((a, b) => (a.move > b.move ? 1 : -1));
  for (let i = 0; i < (length > 10 ? 10 : length); i += 1) {
    const score = document.createElement('div');
    score.textContent = `${i + 1}. Количество ходов : ${saveStorage.result[i].move},
                                      размер доски: ${saveStorage.result[i].size} * ${saveStorage.result[i].size},
                                      время игры ${saveStorage.result[i].time}`;
    info.appendChild(score);
  }
  fragment.appendChild(info);
  return fragment;
}

function moveCell(index, divider) {
  const cell = cells[index];
  const leftDiff = Math.abs(emptyCellParams.left - cell.left);
  const topDiff = Math.abs(emptyCellParams.top - cell.top);

  if (leftDiff + topDiff > 1) {
    return;
  }

  cell.element.style.top = `${emptyCellParams.top * gameParams.cellSize}px`;
  cell.element.style.left = `${emptyCellParams.left * gameParams.cellSize}px`;

  const emptyCellParamsLeft = emptyCellParams.left;
  const emptyCellParamsTop = emptyCellParams.top;

  emptyCellParams.left = cell.left;
  emptyCellParams.top = cell.top;

  cell.left = emptyCellParamsLeft;
  cell.top = emptyCellParamsTop;
  gameParams.countMoves += 1;
  moves.innerHTML = `Moves: ${gameParams.countMoves}`;
  const isFinished = cells.every((cellFinish) => (cellFinish.value === (cellFinish.top * divider + cellFinish.left)));

  if (isFinished) {
    endGameBlock.innerHTML = `<div class="win">Ура! Вы решили головоломку за ${addZero(gameParams.min)}:${addZero(gameParams.sec)} и ${gameParams.countMoves}
                              ${setWord(gameParams.countMoves)}.</div>`;
    saveStorage.result.push({
      size: gameParams.fieldWidthHeightParam,
      move: gameParams.countMoves,
      time: `${addZero(gameParams.min)}:${addZero(gameParams.sec)}`,
    });
    setLocalStorage(saveStorage);
    setTimeout(showResult, 0);
    setTimeout(fadeResult, 4000);
    clearField();
    changeFadeShowField();
    timeStop = true;
  }
}

startNewGame.addEventListener('click', () => {
  timeStop = true;
  changeFadeShowField();
  clearField();
});

function createCells(numCells, divider) {
  const fragment = document.createDocumentFragment();
  const randomNumbers = [...Array(numCells).keys()];
  randomNumbers.sort(() => Math.random() - 0.5);
  checkSolution(randomNumbers);
  for (let i = 0; i < numCells; i += 1) {
    const value = randomNumbers[i];
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.innerHTML = value + 1;

    const left = i % divider;
    const top = (i - left) / divider;
    cell.style.top = `${top * gameParams.cellSize}px`;
    cell.style.left = `${left * gameParams.cellSize}px`;
    cells.push({
      value,
      top,
      left,
      element: cell,
    });
    cell.style.height = `${gameParams.cellSize}px`;
    cell.style.width = `${gameParams.cellSize}px`;

    cell.addEventListener('click', () => {
      moveCell(i + 1, divider);
    });

    fragment.appendChild(cell);
  }
  return fragment;
}

const drawFieldToGame = (param, index) => {
  gameParams.fieldWidthHeightParam = param;
  gameParams.cellSize = document.documentElement.offsetWidth <= 710
    ? fieldConfig[index].minCellSize
    : fieldConfig[index].maxCellSize;
  gameParams.fieldSize = document.documentElement.offsetWidth <= 710
    ? fieldConfig[index].minFieldWidthHeight
    : fieldConfig[index].fieldWidthHeight;
  field.style.width = `${gameParams.fieldSize}px`;
  field.style.height = `${gameParams.fieldSize}px`;
  emptyCellParams.value = (param ** 2 - 1);
  emptyCellParams.top = (param - 1);
  emptyCellParams.left = (param - 1);
  cells.push(emptyCellParams);
  field.appendChild(createCells((param ** 2 - 1), param));
};

gameButtons.forEach((btn, index) => {
  btn.addEventListener('click', (event) => {
    changeFadeShowField();
    clearField();
    moves.innerHTML = `Moves: ${gameParams.countMoves}`;
    timeStop = false;
    cells = [];
    drawFieldToGame(+event.target.getAttribute('id'), index);
    startGameTime();
    scoreButton.disabled = false;
  });
});

scoreButton.addEventListener('click', () => {
  scoreInfo.innerHTML = `
      <button class="close-btn">X</button>
      <h3>Лучшие результаты игры:</h3>`;
  scoreInfo.style.display = "flex";
  scoreInfo.appendChild(getLocalStorage());
  scoreButton.disabled = true;
  const closeButton = document.querySelector('.close-btn');
  closeButton.addEventListener('click', () => {
    scoreInfo.style.display = "none";
    scoreButton.disabled = false;
  });

});

clearButton.addEventListener('click', () => {
  localStorage.clear();
  location.reload();
});

function checkSolution(array) {
  let resultSequence = 0;
  const gameCopy = array;
  for (let i = 0; i <= gameCopy.length - 1; i += 1) {
    for (let j = i + 1; j <= gameCopy.length - 1; j += 1) {
      if (+gameCopy[i].textContent > +gameCopy[j].textContent) {
        resultSequence += 1;
      }
    }
  }
  return resultSequence % 2 === 0;
}