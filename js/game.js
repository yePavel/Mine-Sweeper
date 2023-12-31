'use strict'

const mine = 'mine'

const flagPic = '🚩'
const minePic = '💣'
const EMPTY = ' '
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

    // for (var i = 0; i < gLevel.mines; i++) {
    //     const mineCell = randomMinesLocation(board)
    //     if (board[mineCell.i, mineCell.j].isMine === true) continue
    //     board[mineCell.i][mineCell.j].isMine = true
    // }

    board[0][0].isMine = true
    board[1][1].isMine = true


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

            strHTML += `<td onclick="onCellClicked(this, ${i},${j});onCellMarked(elCell)"
                data-i="${i}" data-j="${j}"
                class="cell">
                <div class="cellContent hidden">`
            if (currCell.isMine)
                strHTML += minePic
            else strHTML += currCell.minesAroundCount
            strHTML += `</div>`
            strHTML += `</td>`
        }
        strHTML += `</tr>`
    }
    const elBoard = document.querySelector('.mainGame')
    elBoard.innerHTML = strHTML

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
    } else if (elLevel === level3) {
        gLevel.size = 12
        gLevel.mines = 32
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
    return countMine
}

function onCellClicked(elCell, i, j) {
    gBoard[i][j].isShown = true
    var elContent = elCell.querySelector('div')
    elContent.classList.remove('hidden')

}

function randomMinesLocation(board) {
    const emptyCells = getEmptyCells(board)
    const mineRandNum = getRandomInt(0, emptyCells.length)
    return emptyCells[mineRandNum]
}

function onCellMarked(elCell) {
    elCell.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        console.log("🖱 right click detected!")

        // const cellContent = elCell.querySelector('tr>td')
        // console.log('elCell:', cellContent)
        // cellContent.innerHTML = flagPic

    }, false)


}


function checkGameOver() {


}

function expandShown(board, elCell, i, j) {

}


