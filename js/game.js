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

const gMegaHint = {
    megaHintFlag: false,
    clickCount: 0,
    rowClick1: 0,
    colClick1: 0,
    rowClick2: 0,
    colClick2: 0
}

const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsInterval: 0,
    lives: 1,
    isHintFlag: false,
    safeClickCount: 3,
    timePassed: 0
}

function init() {
    gBoard = buildBoard()
    renderBoard(gBoard)
    changeNumColor()
    handleLives(gGame.lives)
}

function cellDefine(board, i, j) {
    board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
        isMegaHint: false
    }
}

function buildBoard() {
    const board = []
    for (var i = 0; i < gLevel.size; i++) {
        board.push([])
        for (var j = 0; j < gLevel.size; j++) {
            cellDefine(board, i, j)
        }
    }
    addMines(board)

    for (var i = 0; i < board.length; i++) {
        for (j = 0; j < board[i].length; j++) {
            const minesCounter = getMinesNegsCount(board, i, j)
            if (minesCounter > 0) {
                board[i][j].minesAroundCount = minesCounter
            }
            else {
                board[i][j].minesAroundCount = EMPTY
            }
        }
    }
    return board
}

function addMines(board) {
    for (var i = 0; i < gLevel.mines; i++) {
        const mineCell = randomLocation(board)
        board[mineCell.i][mineCell.j].isMine = true
        gMines.push({ i: mineCell.i, j: mineCell.j })
    }
}

function safeClick(elBtn) {
    gGame.safeClickCount--
    if (gGame.safeClickCount < 0) return
    const elSafeClick = elBtn.querySelector('span')
    var emptyCell = randomLocation(gBoard)
    const newCell = document.querySelector(`.cell${emptyCell.i}${emptyCell.j}`)
    newCell.classList.add('safeClick')
    if (gGame.safeClickCount < 0) elSafeClick.innerHTML = '0 '
    else {
        elSafeClick.innerHTML = gGame.safeClickCount + ' '
    }
    if (gGame.safeClickCount >= 0) {
        setTimeout(() => {
            newCell.classList.remove('safeClick')
        }, 1000);
    }
}

function randomLocation(board) {
    const emptyCells = getEmptyCells(board)
    const RandNum = getRandomInt(0, emptyCells.length - 1)
    return emptyCells[RandNum]
}


function renderBoard(board) {
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[i].length; j++) {
            const currCell = board[i][j]
            strHTML += `<td oncontextmenu="onCellMarked(this, ${i}, ${j})" 
            onclick="onCellClicked(this, ${i},${j}, event)"
            class="cell${i}${j} cell">
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

function handleLives(lives) {
    gGame.lives = lives
    const elLives = document.querySelector('.livesNum')
    if (gGame.lives <= 0) elLives.innerHTML = '0'
    else if (gGame.lives === 1)
        elLives.innerHTML = '❤️'
    else if (gGame.lives === 2)
        elLives.innerHTML = '❤️❤️'
    else if (gGame.lives === 3)
        elLives.innerHTML = '❤️❤️❤️'

}

function GameLevel(levelNum) {
    if (levelNum === 1) {
        gLevel.size = 4
        gLevel.mines = 2
        handleLives(1)
    } else if (levelNum === 2) {
        gLevel.size = 8
        gLevel.mines = 14
        handleLives(3)
    } else if (levelNum === 3) {
        gLevel.size = 12
        gLevel.mines = 32
        handleLives(3)
    }
    init()
}

function getMinesNegsCount(board, row, col) {
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
    if (gGame.secsInterval === 0) startTimer()
    if (gBoard[i][j].isShown || gBoard[i][j].isMarked) return
    if (gMegaHint.megaHintFlag) {
        gMegaHint.clickCount++
        if (gMegaHint.clickCount === 1) {
            gMegaHint.rowClick1 = i
            gMegaHint.colClick1 = j
        }
        if (gMegaHint.clickCount === 2) {
            gMegaHint.rowClick2 = i
            gMegaHint.colClick2 = j
            if (!gBoard[i][j].isShown) megaHintExpend(gMegaHint.rowClick1, gMegaHint.colClick1, gMegaHint.rowClick2, gMegaHint.colClick2)
        }
    }
    else {
        elCell.classList.add('color')
        gBoard[i][j].isShown = true
        if (!gBoard[i][j].isMine && !gGame.isHintFlag) gGame.shownCount++
        if (gBoard[i][j].isMine && gGame.shownCount) gGame.lives--
        var elContent = elCell.querySelector('div')
        elContent.classList.remove('hidden')
        if (gBoard[i][j].minesAroundCount === EMPTY && !gGame.isHintFlag) expandShown(gBoard, i, j)
        handleGameOver(i, j)
    }
    hintShowCells(gBoard, i, j)
}

function onHintClick(elBtn) {
    gGame.isHintFlag = true
    elBtn.classList.add('hidden')
}

function expandShown(board, row, col) {
    if (board[row][col].isMine) return
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            if (board[i][j].isMine || board[i][j].isShown || board[i][j].isMarked) continue
            if (i === row && j === col) continue
            board[i][j].isShown = true
            gGame.shownCount++
            const newCell = document.querySelector(`.cell${i}${j}`)
            newCell.classList.add('color')
            const elContent = newCell.querySelector('div')
            elContent.classList.remove('hidden')

            if (board[i][j].minesAroundCount === EMPTY) expandShown(gBoard, i, j)
        }
    }
    handleGameOver(i, j)
}

function hintShowCells(board, row, col) {
    if (!gGame.isHintFlag) return
    board[row][col].isShown = false
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            if (board[i][j].isShown) continue
            board[i][j].isShown = false
            const newCell = document.querySelector(`.cell${i}${j}`)
            newCell.classList.add('color')
            const elContent = newCell.querySelector('div')
            elContent.classList.remove('hidden')
        }
        setTimeout(() => {
            for (var i = row - 1; i <= row + 1; i++) {
                if (i < 0 || i >= board.length) continue
                for (var j = col - 1; j <= col + 1; j++) {
                    if (j < 0 || j >= board[0].length) continue
                    if (board[i][j].isShown) continue
                    const newCell = document.querySelector(`.cell${i}${j}`)
                    newCell.classList.remove('color')
                    const elContent = newCell.querySelector('div')
                    elContent.classList.add('hidden')

                }
            }
        }, 500);
        gGame.isHintFlag = false
    }
}

function onCellMarked(elCell, i, j) {
    if (gBoard[i][j].isShown) return
    const elContent = elCell.querySelector('div')
    if (!gBoard[i][j].isMarked) {
        temp = tempCellContent(elCell)
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
    handleGameOver()
}

function tempCellContent(elCell) {
    const content = elCell.querySelector('div')
    const temp = content.innerHTML
    return temp
}

function handleGameOver() {
    handleLives(gGame.lives)
    if (gGame.shownCount === (gLevel.size ** 2 - gLevel.mines) && gGame.markedCount <= gLevel.mines) {
        handleVictory()
    }
    else if (gGame.lives < 0) handleLose()
}

function handleLose() {
    resetTime()
    const elBoard = document.querySelector('.mainGame')
    const elBtn = document.querySelector('.restartBtn')
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

function handleVictory() {
    resetTime()
    const elBoard = document.querySelector('.mainGame')
    const elBtn = document.querySelector('.restartBtn')
    elBoard.innerHTML = YOU_WIN
    elBtn.innerHTML = winImoji
}

function changeNumColor() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            const number = gBoard[i][j].minesAroundCount
            const elCell = document.querySelector(`.cell${i}${j}`)
            const elContent = elCell.querySelector('div')
            elContent.style.color = assignColor(number)
        }
    }
}

function assignColor(number) {
    switch (number) {
        case 1:
            return 'blue';
        case 2:
            return 'green';
        case 3:
            return 'red';
        case 4:
            return 'purple';
        case 5:
            return 'maroon';
        case 6:
            return 'turquoise';
        case 7:
            return 'black';
        case 8:
            return 'gray';
        default:
            return 'defaultColor';
    }
}

function onMegaHint(elBtn) {
    gMegaHint.megaHintFlag = true
    elBtn.classList.add('hidden')
}

function megaHintExpend(rowClick1, colClick1, rowClick2, colClick2) {
    for (var i = rowClick1; i <= rowClick2; i++) {
        for (var j = colClick1; j <= colClick2; j++) {
            if (gBoard[i][j].isShown) continue
            gBoard[i][j].isMegaHint = true
            const getCell = document.querySelector(`.cell${i}${j}`)
            getCell.classList.add('hint')
            const elContent = getCell.querySelector('div')
            elContent.classList.remove('hidden')
        }
    }
    setTimeout(() => {
        for (var i = rowClick1; i <= rowClick2; i++) {
            for (var j = colClick1; j <= colClick2; j++) {
                if (gBoard[i][j].isShown) continue
                const getCell = document.querySelector(`.cell${i}${j}`)
                getCell.classList.remove('hint')
                const elContent = getCell.querySelector('div')
                elContent.classList.add('hidden')
            }
        }
    }, 700);
    gMegaHint.megaHintFlag = false
}

function restart() {
    location.reload();
}



