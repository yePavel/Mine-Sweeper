'use strict'

// @ CR - Done by Ido:
// @ CR - Hey Pavel! First of all I want to congratulate you on an awesome project!
// @ CR - Through out the code there will be notes starting with "@ CR" so you could easily ctrl + f for them :)
// @ CR - You should always prioritize fixing broken code rather than continuing to new features.
// @ CR - Overall - your code is written well, there are places where the code could look better, and all of those are marked here.
// @ CR - If there are any questions about any of the notes or any questions at all - feel free to contact me through Slack.
// @ CR - Have a great day :)

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

// @ CR - I Love that you put everything that's related to megaHint in this object. 
// @ CR - It makes your code really readable.
// @ CR - should be called gMegaHint
const megaHint = {
    megaHintFlag: false,
    // @ CR - no need for g here, it's already on megaHint.
    gClickCount: 0,
    rowClick1: 0,
    colClick1: 0

}
// @ CR - hintFlag is a boolean, should have 'is' in name
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
    changeNumColor()
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
    // @ CR - Remove comments like these when uploading code. 
    // board[0][1].isMine = true
    // board[2][3].isMine = true

    for (var i = 0; i < board.length; i++) {
        for (j = 0; j < board[i].length; j++) {
            board[i][j].minesAroundCount = setMinesNegsCount(board, i, j)
        }
    }
    return board
}


// @ CR - This is a very good way to add the mines. well done!
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

// @ CR - you didn't render table here, and have it in the HTML. this is very good!
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

// @ CR - This function doesn't only update lives, but also renders them to the DOM.
// @ CR - handleLives() would be a better name.
function updateLives(lives) {
    gGame.lives = lives
    const elLives = document.querySelector('.livesNum')
    gGame.lives >= 0 ? elLives.innerHTML = lives : elLives.innerHTML = '0'

}

function GameLevel(elLevel) {
    // @ CR - You send elLevel, and use querySelector, but we don't need the elements here.
    // @ CR - Instead, you could send a number that decides the level.
    // @ CR - Also every element should start with el. 
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
// @ CR - We never want a function to return two different types.
// @ CR - In the case here, we will return countMine anyway.
// @ CR - handling countMine > 0 should be done outside.
// @ CR - also, function doesn't set the count, only returns it.
// @ CR - getMinesNegsCount() would be a better name.
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
    if (megaHint.megaHintFlag) {
        megaHint.gClickCount++
        if (megaHint.gClickCount === 1) {
            megaHint.rowClick1 = i
            megaHint.colClick1 = j
        }
        if (megaHint.gClickCount === 2) {
            var rowClick2 = i
            var colClick2 = j
            megaHintExpend(megaHint.rowClick1, megaHint.colClick1, rowClick2, colClick2)
        }
    }
    // @ CR - this could also be inside an 'else'
    if (!megaHint.megaHintFlag) {
        elCell.classList.add('color')
        gBoard[i][j].isShown = true
        gGame.shownCount++
        var elContent = elCell.querySelector('div')
        elContent.classList.remove('hidden')
        checkGameOver(i, j)
        if (gBoard[i][j].isMine) return
        // @ CR - we only need to expand if 0 is pressed, this expands shown ALWAYS.
        expandShown(gBoard, i, j)
        checkGameOver(i, j)
    }
}


// @ CR - Breaking this logic into a small function is very good. makes your code easier to read!
function onHintClick(elBtn) {
    gGame.hintFlag = true
    elBtn.classList.add('hidden')
}

function expandShown(board, row, col) {
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            if (board[i][j].isMine || board[i][j].isShown || board[i][j].isMarked) continue
            if (i === row && j === col) continue
            // @ CR - no need for an 'else' statement here, continue will skip over this code.
            else {
                // @ CR - Why do we need isHint here? it doesn't exist on the board.
                board[i][j].isHint = false
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
}

// @ CR - This entire function is written inside an if statement.
// @ CR - It would be more readable to return if (!gGame.hintFlag), or even, handle this outside of function.
function hintShowCells(board, row, col) {
    if (gGame.hintFlag) {
        setTimeout(() => {
            for (var i = row - 1; i <= row + 1; i++) {
                if (i < 0 || i >= board.length) continue
                for (var j = col - 1; j <= col + 1; j++) {
                    if (j < 0 || j >= board[0].length || board[i][j].isMine) continue
                    if (i === row && j === col) continue
                    else if (board[i][j].isShown) {
                        board[i][j].isShown = false
                        gGame.shownCount--
                        // @ CR - This code repeats itself in here and in expandShown,
                        // @ CR - It would be better to make a function that handles this.
                        const newCell = document.querySelector(`.cell${i}${j}`)
                        newCell.classList.remove('color')
                        const elContent = newCell.querySelector('div')
                        elContent.classList.add('hidden')
                    }
                }
            }
        }, 500);
        gGame.hintFlag = false
    }
}

function onCellMarked(elCell, i, j) {
    // @ CR - event doesn't exist here. it works, but is deprecated.
    // @ CR - we need to pass the event to this function.
    event.preventDefault();
    const elContent = elCell.querySelector('div')
    // @ CR - this should be done before getting elContent. if we return, there's no need to get elContent.
    if (gBoard[i][j].isShown) return

    // @ CR - you shouldn't use temp to store the value of elContent.
    // @ CR - this is exactly why we use "setMinesNegsCount()". we should get the content of this element from model.
    if (!gBoard[i][j].isMarked) {
        temp = tempCellContent(elCell)
        // @ CR - remove console logs before submitting project.
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

// @ CR - This function doesn't just check if game is over, but also handles  game over.
// @ CR - A better name would be handleGameOver()

function checkGameOver(i, j) {
    const elBoard = document.querySelector('.mainGame')
    const elBtn = document.querySelector('.restartBtn')

    // @ CR - this function should only handle game over.
    // @ CR - checking if a mine is pressed should be done outside this function.
    // @ CR - Also gGame.lives should never reach 0 if  a mine wasn't clicked. that check is redundant.
    if (gBoard[i][j].isMine && gBoard[i][j].isShown || gGame.lives < 0) {

        // @ CR - you send updateLives gGame.lives, which is already set here.
        // @ CR - a better approach would be changing updateLives to only renderLives, not set gGame.lives.
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
    // @ CR - this should be put this into a different function handleVictory().
    if (gGame.shownCount === gLevel.size ** 2 - gLevel.mines &&
        gGame.markedCount === gLevel.mines || gGame.shownCount === (gLevel.size ** 2 - gLevel.mines + gGame.markedCount)) {
        elBoard.innerHTML = YOU_WIN
        elBtn.innerHTML = winImoji
    }
}

// @ CR - This could be put inside css. there's no need to use JS for it.
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

function onMegaHint(elBtn, i, j) {
    megaHint.megaHintFlag = true
    elBtn.classList.add('hidden')
}

// @ CR - There is no check if the cell was open prior to this.
// @ CR - opening megaHint will cause all previously open cells to close.
function megaHintExpend(rowClick1, colClick1, rowClick2, colClick2) {
    for (var i = rowClick1; i <= rowClick2; i++) {
        for (var j = colClick1; j <= colClick2; j++) {
            const getCell = document.querySelector(`.cell${i}${j}`)
            getCell.classList.add('color')
            const elContent = getCell.querySelector('div')
            elContent.classList.remove('hidden')
        }
    }
    setTimeout(() => {
        for (var i = rowClick1; i <= rowClick2; i++) {
            for (var j = colClick1; j <= colClick2; j++) {
                const getCell = document.querySelector(`.cell${i}${j}`)
                getCell.classList.remove('color')
                const elContent = getCell.querySelector('div')
                elContent.classList.add('hidden')
            }
        }
    }, 700);
    megaHint.megaHintFlag = false
}

// @ CR - no need for this. We should make sure onInit() always restarts. then we can call onInit()
function restart() {
    location.reload();
}











