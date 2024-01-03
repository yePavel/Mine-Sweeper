'use strict'

const mine = 'mine'

const flagPic = '🚩'
const minePic = '💣'
const EMPTY = ' '
const YOU_LOSE = 'YOU LOSE 😒'
const YOU_WIN = 'YOU WIN ! 😁'
const playImoji = '🙂'
const winImoji = '😎'
const loseImoji = '🤯'

var temp
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
    lives: 1,
    hintFlag: false
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

    addMines(board)

    // board[0][1].isMine = true
    // board[2][3].isMine = true


    for (var i = 0; i < board.length; i++) {
        for (j = 0; j < board[i].length; j++) {
            board[i][j].minesAroundCount = setMinesNegsCount(board, i, j)
            // numColor(i, j, board[i][j].minesAroundCount)
        }
    }
    return board
}

// function numColor(i, j, countNum) {
//     console.log('i,j:', i, j)
//     const newCell = document.querySelector(`.cell${i}${j}`)
//     console.log('cell:', newCell)
//     const cellContent = newCell.document.querySelector('div')
//     console.log('countNum:', countNum)
//     switch (countNum) {
//         case '1':
//             cellContent.classList.add('.numColor1')
//             break;

//         case '2':
//             cellContent.classList.add('.numColor2')
//             break;

//         case '3':
//             cellContent.classList.add('.numColor3')
//             break;

//         case '4':
//             cellContent.classList.add('.numColor4')
//             break;
//         case '5':
//             cellContent.classList.add('.numColor5')
//             break;
//         default: return null
//     }

// }

function addMines(board) {
    for (var i = 0; i < gLevel.mines; i++) {
        const mineCell = randomMinesLocation(board)
        board[mineCell.i][mineCell.j].isMine = true
        gMines.push({ i: mineCell.i, j: mineCell.j })
    }
}

function randomMinesLocation(board) {
    const emptyCells = getEmptyCells(board)
    const mineRandNum = getRandomInt(0, emptyCells.length - 1)
    return emptyCells[mineRandNum]
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
    gGame.lives >= 0 ? elLives.innerHTML = lives : elLives.innerHTML = '0'

}

function GameLevel(elLevel) {
    const level1 = document.querySelector('.level1')
    const level2 = document.querySelector('.level2')
    const level3 = document.querySelector('.level3')

    if (elLevel === level1) {
        gLevel.size = 4
        gLevel.mines = 2
        updateLives(1)
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
}

function onCellClicked(elCell, i, j) {
    if (gBoard[i][j].isShown || gBoard[i][j].isMarked) return

    elCell.classList.add('color')
    gBoard[i][j].isShown = true
    gGame.shownCount++
    var elContent = elCell.querySelector('div')
    elContent.classList.remove('hidden')
    checkGameOver(i, j)
    if (gBoard[i][j].isMine) return
    expandShown(gBoard, i, j)
    checkGameOver(i, j)

}

function onHintClick(elBtn) {
    gGame.hintFlag = true
    elBtn.classList.add('hidden')
}

function expandShown(board, row, col) {
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = col - 1; j <= col + 1; j++) {
            console.log('i,j:', i, j)
            if (j < 0 || j >= board[0].length) continue
            if (board[i][j].isMine || board[i][j].isShown || board[i][j].isMarked) continue
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
    hintShowCells(board, row, col)
    // expandShown(board, row - 1, col - 1)
    // expandShown(board, row - 1, col)
    // expandShown(board, row - 1, col + 1)
    // expandShown(board, row, col - 1)
    // expandShown(board, row, col + 1)
    // expandShown(board, row + 1, col - 1)
    // expandShown(board, row + 1, col)
    // expandShown(board, row + 1, col + 1)

}

function hintShowCells(board, row, col) {
    console.log('gGame.hintFlag:', gGame.hintFlag)
    if (gGame.hintFlag) {
        setTimeout(() => {
            for (var i = row - 1; i <= row + 1; i++) {
                if (i < 0 || i >= board.length) continue
                for (var j = col - 1; j <= col + 1; j++) {
                    if (j < 0 || j >= board[0].length) continue
                    if (i === row && j === col) continue
                    else if (board[i][j].isShown) {
                        board[i][j].isShown = false
                        gGame.shownCount--
                        const newCell = document.querySelector(`.cell${i}${j}`)
                        newCell.classList.remove('color')
                        const elContent = newCell.querySelector('div')
                        elContent.classList.add('hidden')
                    }
                }
            }
        }, 1000);
        gGame.hintFlag = false
    }
}

function onCellMarked(elCell, i, j) {
    event.preventDefault();
    const elContent = elCell.querySelector('div')
    if (gBoard[i][j].isShown) return

    if (!gBoard[i][j].isMarked) {
        temp = tempCellContent(elCell)
        console.log('temp:', temp)
        gBoard[i][j].isMarked = true
        gGame.markedCount++
        elContent.innerHTML = flagPic
        elContent.classList.remove('hidden')
    }

    else if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false
        gGame.markedCount--
        elContent.innerHTML = temp
        elContent.classList.add('hidden')
    }
    checkGameOver(i, j)
}

function tempCellContent(elCell) {
    const content = elCell.querySelector('div')
    const temp = content.innerHTML
    return temp
}

function checkGameOver(i, j) {
    const elBoard = document.querySelector('.mainGame')
    const elBtn = document.querySelector('.restartBtn')

    if (gBoard[i][j].isMine && gBoard[i][j].isShown || gGame.lives < 0) {
        gGame.lives--
        updateLives(gGame.lives)
        if (gGame.lives < 0) {
            for (var index = 0; index < gMines.length; index++) {
                const elCell = document.querySelector(`.cell${gMines[index].i}${gMines[index].j}`)
                const elContent = elCell.querySelector('div')
                elContent.classList.remove('hidden')
            }
            setTimeout(() => {
                elBoard.innerHTML = YOU_LOSE
                elBtn.innerHTML = loseImoji
            }, 1000);
        }
    }
    if (gGame.shownCount === gLevel.size ** 2 - gLevel.mines &&
        gGame.markedCount === gLevel.mines || gGame.shownCount === (gLevel.size ** 2 - gLevel.mines + gGame.markedCount)) {
        elBoard.innerHTML = YOU_WIN
        elBtn.innerHTML = winImoji
    }
}



function restart() {
    location.reload();
}











