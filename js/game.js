'use strict'

const mine = 'mine'

const flagPic = '🚩'
const minePic = '💣'
const EMPTY = ' '
const YOU_LOSE = 'YOU LOSE 😒'
const YOU_WIN = 'YOU WIN ! 😁'
const playImoji = '🙂'
const winImoji = '🤗'
const loseImoji = '🤯'

const gMines = []
var gBoard = []

const gLevel = {
    size: 4,
    mines: 2
}

const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 1
}

function init() {
    gBoard = buildBoard()
    renderBoard(gBoard)
    console.log('gBoard:', gBoard)
}


function buildBoard() {
    const board = []

    for (var i = 0; i < gLevel.size; i++) {
        board.push([])
        for (var j = 0; j < gLevel.size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }

    for (var i = 0; i < gLevel.mines; i++) {
        const mineCell = randomMinesLocation(board)
        console.log('mineCell:', mineCell)
        if (board[mineCell.i, mineCell.j].isMine === true) continue
        board[mineCell.i][mineCell.j].isMine = true
        gMines.push({ i: mineCell.i, j: mineCell.j })
    }

    // board[0][1].isMine = true
    // board[2][3].isMine = true


    for (var i = 0; i < board.length; i++) {
        for (j = 0; j < board[i].length; j++) {
            board[i][j].minesAroundCount = setMinesNegsCount(board, i, j)
        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[i].length; j++) {
            const currCell = board[i][j]
            strHTML += `<td oncontextmenu="onCellMarked(this, ${i}, ${j})" 
            onclick="onCellClicked(this, ${i},${j}, event)"
            class="cell cell${i}${j}">
            <div class="cellContent hidden">`
            if (currCell.isMine)
                strHTML += minePic
            else strHTML += currCell.minesAroundCount
            strHTML += `</td>`
            strHTML += `</div>`
        }

        strHTML += `</tr>`
    }
    const elBoard = document.querySelector('.mainGame')
    elBoard.innerHTML = strHTML

}
function updateLives(lives) {
    gGame.lives = lives
    const elLives = document.querySelector('.livesNum')
    elLives.innerHTML = lives
}

function GameLevel(elLevel) {
    const level1 = document.querySelector('.level1')
    const level2 = document.querySelector('.level2')
    const level3 = document.querySelector('.level3')

    if (elLevel === level1) {
        gLevel.size = 4
        gLevel.mines = 2
    } else if (elLevel === level2) {
        gLevel.size = 8
        gLevel.mines = 14
        updateLives(3)
    } else if (elLevel === level3) {
        gLevel.size = 12
        gLevel.mines = 32
        updateLives(3)
    }
    init()
}

function setMinesNegsCount(board, row, col) {
    var countMine = 0
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = col - 1; j <= col + 1; j++) {

            if (j < 0 || j >= board[0].length) continue
            if (i === row && j === col) continue

            if (board[i][j].isMine) countMine++

        }
    }
    if (countMine > 0) return countMine
    else return EMPTY
    // return countMine
}

function onCellClicked(elCell, i, j) {

    if (!gBoard[i][j].isShown) {
        elCell.classList.add('color')
        gBoard[i][j].isShown = true
        gGame.shownCount++
        var elContent = elCell.querySelector('div')
        elContent.classList.remove('hidden')
        checkGameOver(i, j)
        expandShown(gBoard, i, j)
    }
}

function expandShown(board, row, col) {

    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            if (board[i][j].isMine || board[i][j].isShown) continue
            if (i === row && j === col) continue
            else {
                board[i][j].isShown = true
                gGame.shownCount++
                const newCell = document.querySelector(`.cell${i}${j}`)
                newCell.classList.add('color')
                const elContent = newCell.querySelector('div')
                elContent.classList.remove('hidden')
                checkGameOver(i, j)
            }
        }
    }

    // expandShown(board, row - 1, col - 1)
    // expandShown(board, row - 1, col)
    // expandShown(board, row - 1, col + 1)
    // expandShown(board, row, col - 1)
    // expandShown(board, row, col + 1)
    // expandShown(board, row + 1, col - 1)
    // expandShown(board, row + 1, col)
    // expandShown(board, row + 1, col + 1)

}

function randomMinesLocation(board) {
    const emptyCells = getEmptyCells(board)
    const mineRandNum = getRandomInt(0, emptyCells.length)
    return emptyCells[mineRandNum]
}

function onCellMarked(elCell, i, j) {
    event.preventDefault();

    if (!gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true
        gGame.markedCount++
        elCell.innerHTML = flagPic
        checkGameOver(i, j)
    }
    else if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false
        gGame.markedCount--
        elCell.innerHTML = EMPTY
    }
}

function checkGameOver(i, j) {
    const elBoard = document.querySelector('.mainGame')
    const elBtn = document.querySelector('.restartBtn')
    const elLives = document.querySelector('.livesNum')

    if (gGame.shownCount === gLevel.size ** 2 - gLevel.mines &&
        gGame.markedCount === gLevel.mines) {
        elBoard.innerHTML = YOU_WIN
        elBtn.innerHTML = winImoji

    }
    else if (gBoard[i][j].isMine && gBoard[i][j].isShown) {
        gGame.lives--
        updateLives(gGame.lives)
        if (gGame.lives < 0) {
            elBoard.innerHTML = YOU_LOSE
            elBtn.innerHTML = loseImoji
        }
    }
}

function restart() {
    location.reload();
}

function showMines() {

    for (var i = 0; i < gMines.length; i++) {


    }
}









