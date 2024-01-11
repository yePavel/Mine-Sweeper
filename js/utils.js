'use strict'

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function getEmptyCells(board) {
    const emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (!board[i][j].isMine && !board[i][j].isShown) emptyCells.push({ i, j })
        }
    }
    return emptyCells
}

function resetTime() {
    clearInterval(gGame.secsInterval)

    var elTimer = document.querySelector('.time')
    elTimer.innerText = gGame.timePassed
}

function startTimer() {
    var startTime = Date.now()
    var elTimer = document.querySelector('.time')
    console.log('elTimer:', elTimer)
    // @ CR - secsPassed isn't how long has passed, but rather the intervalId
    // @ CR - name should be changed to intervalId, timerId, etc..
    gGame.secsInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime
        gGame.timePassed = (elapsedTime / 1000).toPrecision(4)
        elTimer.innerText = gGame.timePassed
        console.log('elTimer:', elTimer)
    }, 37)
}

