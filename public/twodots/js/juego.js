// @ts-check

/**
 * JS for the Masterdots game
 */

let markingStarted=false
let adjacent=[]
let markedIds=[]
let markedClass
let intervalId = 0
let size = 0
let score = 0

/**
 * Returns a random number between 0 and max
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 * @param  {} max
 */
const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}

/**
 * Draws the game board
 */
const drawGameBoard = () => {
    const boardSize=sessionStorage.getItem('size')
    if (!boardSize) {
        // Redirect to home page
        location.href="index.html" 
        return
    }
    size = parseInt(boardSize)
    const gameElement = document.getElementById("game")
    if (!gameElement) {
        console.error("Element with ID 'game' not found")
        return
    }
    gameElement.style.gridTemplateColumns="repeat("+size+", 1fr)"
    gameElement.style.gridTemplateRows="repeat("+size+", 1fr)"

    // Create elements automatically
    let items = ""
    let color = ["red","green"]
    let colorRnd = 0
    for (let index = 0; index < (parseInt(boardSize)*parseInt(boardSize)); index++) {
        if (index%2>0) colorRnd=getRandomInt(2)
        items+=`<div class="containerItem"><div id="${index}" class="item ${color[colorRnd]}"></div></div>`
    }
    gameElement.innerHTML=items
}

/**
 * Displays user data
 */
const displayUserData = () => {
    const avatar=sessionStorage.getItem('avatarImg')
    const nick=sessionStorage.getItem('nick')
    const boardSize=sessionStorage.getItem('size')
    
    const avatarElement = /** @type {HTMLImageElement} */ (document.getElementById("avatarImg"))
    const nickElement = /** @type {HTMLInputElement} */ (document.getElementById("nick"))
    const sizeElement = /** @type {HTMLInputElement} */ (document.getElementById("boardSize"))
    
    if (avatarElement && avatar) avatarElement.src = avatar
    if (nickElement && nick) nickElement.innerText = `Nick: ${nick}`
    if (sizeElement && boardSize) sizeElement.innerText = `Size: ${boardSize}x${boardSize}`
}

/**
 * Calculates the array of adjacent cells
 * @param  {Number} markedId marked cell number
 */
const calculateAdjacent = (markedId) => {
    adjacent=[]
    // Top adjacent
    if((markedId-size)>=0) adjacent.push(markedId-size)
    // Bottom adjacent
    if((markedId+size)<(size*size)) adjacent.push(markedId+size)
    // Left adjacent
    if((markedId%size)>0) adjacent.push(markedId-1)
    // Right adjacent
    if(((markedId+1)%size)>0) adjacent.push(markedId+1)

}

/**
 * Countdown timer function for the game
 * In seconds
 */
const countdown = () => {

    // Initialize timer
    let remainingTime = 60
    // Timer element
    const timerElement = /** @type {HTMLInputElement} */ (document.getElementById("timer"))
    if (!timerElement) return console.error("Element with ID 'timer' not found")

    // Timer loop
    intervalId = setInterval(() => {
        remainingTime--
        if (remainingTime < 0) {
            clearInterval(intervalId)
            remainingTime = 0
            endGame()
        }
        timerElement.innerText = `Remaining time: ${remainingTime}`
    }, 1000)
}

/**
 * End of game
 */
const endGame = () => {
    const items=document.getElementsByClassName('item')
    for (let item of items) {
        item.removeEventListener('mousedown',startMarking)
        item.removeEventListener('mouseover',continueMarking)
    }
    document.removeEventListener('mouseup',finishMarking)

    // Change panel visibility
    const gameOverElement = document.getElementById("gameOver")
    const gameElement = document.getElementById("game")
    if (gameOverElement) {
        gameOverElement.style.display="block"
    }
    const newGameElement = document.getElementById("newGame")
    if (newGameElement) {
        newGameElement.addEventListener("click",(e)=>location.reload())
    }
}

/**
 * Add game events
 */
const setupGameEvents = () => {
    const items=document.getElementsByClassName('item')
    for (let item of items) {
        item.addEventListener('mousedown',startMarking)
        item.addEventListener('mouseover',continueMarking)
    }
    document.addEventListener('mouseup',finishMarking)

    // Countdown
    countdown()
}

/**
 * Start marking dots
 * @param {Event} event
 */
const startMarking = (event) => {
    const item = /** @type {HTMLElement} */ (event.target)
    const containerItem = item?.parentElement
    if (!item || !containerItem) return
    
    if (item.classList.contains('red')) {
        markedClass='red'
        containerItem.classList.add('red')
    } else {
        markedClass='green'
        containerItem.classList.add('green')
    }

    if (!markingStarted) markingStarted=true

    // Save marked items
    markedIds.push(parseInt(item.id))
    // Start calculating adjacent cells
    calculateAdjacent(parseInt(item.id))
}

/**
 * Continue marking dots
 * @param {Event} event
 */
const continueMarking = (event) => {
    if (markingStarted) {
        const item = /** @type {HTMLElement} */ (event.target)
        const containerItem = item?.parentElement
        if (!item || !containerItem) return
        
        let newId=parseInt(item.id)
        // Is it adjacent?
        if(adjacent.includes(newId)&&item.classList.contains(markedClass))
        {
            if(item.classList.contains('red')) containerItem.classList.add('red')
            else containerItem.classList.add('green')
            // Save marked items
            markedIds.push(parseInt(item.id))
            calculateAdjacent(parseInt(item.id))
        }

    }
 }

/**
 * Finish marking dots
 * @param {Event} event
 */
const finishMarking = (event) => {
    markingStarted=false
    adjacent=[]

    // Get score
    const scoreElement = /** @type {HTMLInputElement} */ (document.getElementById("score"))
    if (!scoreElement) return console.error("Element with ID 'score' not found")
    
    

    if(markedIds.length > 1 && scoreElement){
        score += markedIds.length
        scoreElement.innerText = `Score: ${score}`
    }

    // Work with marked items
    for (let index = 0; index < markedIds.length; index++) {
        // Capture the object
        let markedItem=document.getElementById(markedIds[index].toString())
        if (markedItem && markedItem.parentElement) {
            markedItem.parentElement.classList.remove(markedClass)
        }
        // Change object color randomly
        let color=["red","green"]
        let colorRnd=getRandomInt(2)
        if (markedItem) {
            markedItem.classList.remove(markedClass)
            markedItem.classList.add(color[colorRnd])
        }
    }
    markedIds=[]
 }

 /**
 * Initializes the game
 */
const initGame = () => {
    drawGameBoard()
    displayUserData()
    setupGameEvents()
}

if (typeof window !== 'undefined') {
    window.TwodotsGame = {
        init: initGame,
    }
}
