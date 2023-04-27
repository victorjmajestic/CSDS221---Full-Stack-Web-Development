document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let width = 10
    let bombNumber = 25
    let flagNumber = 0
    let squareArray = []
    let gameOver = false
    
    // newBoard creates the 10x10 board and places bombs randomly.
    function newBoard() {
    
      // creates an array of bombs, an array of free squares, combines the arrays and shuffles
      // indices with bombs contain class bomb, otherwise they contain class noBomb
      const bombArray = Array(bombNumber).fill('bomb')
      const emptyArray = Array((width*width) - bombNumber).fill('noBomb')
      const minesweeperArray = emptyArray.concat(bombArray)
      const shuffleArray = minesweeperArray.sort(() => Math.random() - 0.5)
      
      // creates a new div "square" 100 times, and applies an index to each square
      for(let i = 0; i < width*width; i++) {
        const square = document.createElement('div')
        square.setAttribute('id', i)
        square.classList.add(shuffleArray[i])

        // adds squares to the grid
        grid.appendChild(square)
        squareArray.push(square)

        // adds a left-click event listener to each square
        square.addEventListener('click', function(e) {
            click(square)
        })

        // adds a right click event listener to each square
        square.oncontextmenu = function(e) {
            e.preventDefault()
            flagSquare(square)
        }
      }

      // checks how many bombs are touching each square
      for (let i = 0; i < squareArray.length; i++) {
        let numBombs = 0
        const leftEdge = (i % width === 0)
        const rightEdge = (i % width === width - 1)
        if (squareArray[i].classList.contains('noBomb')) {
            // directly left
            if (i > 0 && !leftEdge && squareArray[i-1].classList.contains('bomb')) {
                numBombs++
            }
            // up and to the right
            if (i > 9 && !rightEdge && squareArray[i+1-width].classList.contains('bomb')) {
                numBombs++
            }
            // directly up
            if (i > 10 && squareArray[i-width].classList.contains('bomb')) {
                numBombs++
            }
            // up and to the left
            if (i > 11 && !leftEdge && squareArray[i-1-width].classList.contains('bomb')) {
                numBombs++
            }
            // directly right
            if (i < 98 && !rightEdge && squareArray[i+1].classList.contains('bomb')) {
                numBombs++
            }
            // down and to the left
            if (i < 90 && !leftEdge && squareArray[i-1+width].classList.contains('bomb')) {
                numBombs++
            }
            // down and to the right
            if (i < 88 && !rightEdge && squareArray[i+1+width].classList.contains('bomb')) {
                numBombs++
            }
            // directly down
            if (i < 89 && squareArray[i+width].classList.contains('bomb')) {
                numBombs++
            }
            squareArray[i].setAttribute('data', numBombs)
        }
      }
    }
    
    // creates the board
    newBoard()

    // places a flag on the square and check if the game is won
    // will do nothing if the game has already ended
    // will remove the flag if a flag already exists on the square
    function flagSquare(square) {
        if (gameOver) {
            return
        }
        if (!square.classList.contains('checked') && (flagNumber < bombNumber)) {
            if (!square.classList.contains('flagged')) {
                square.classList.add('flagged')
                square.innerHTML = '🏴'
                flagNumber++
                winFunction()
            } else {
                square.classList.remove('flag')
                square.innerHTML = ''
                flagNumber--
            }
        }
    }
    
    // reveals the contents behind the square
    // will do nothing if the game has already ended
    // will do nothing if the square has already been clicked
    // will end the game in failure if the square has the class bomb
    // will reveal the number of adjacent bombs if they exist
    // calls fanSquare if there are no adjacent bombs
    function click(square) {
        let currentID = square.id
        if (gameOver) {
            return
        }
        if (square.classList.contains('clicked') || square.classList.contains('flagged')) {
            return
        }
        if (square.classList.contains('bomb')) {
            gameOverFunction(square)
            gameOver = true
        } else {
            let total = square.getAttribute('data')
            if (total != 0) {
                square.classList.add('clicked')
                square.innerHTML = total
                return
            }
            fanSquare(square, currentID)
        }
        square.classList.add('clicked')
    }

    // fanSquare will be called if a square has no adjacent bombs
    // it will reveal the contents of all neighboring squares
    // this works recursively with function click
    function fanSquare(square, currentID) {
        const leftEdge = (currentID % width === 0)
        const rightEdge = (currentID % width === width-1)
        setTimeout(() => {
            // directly left
            if (currentID > 0 && !leftEdge) {
                const newID = squareArray[parseInt(currentID)-1].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
            // up and to the right
            if (currentID > 9 && !rightEdge) {
                const newID = squareArray[parseInt(currentID)+1-width].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
            // directly up
            if (currentID > 10) {
                const newID = squareArray[parseInt(currentID-width)].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
            // up and to the left
            if (currentID > 11 && !leftEdge) {
                const newID = squareArray[parseInt(currentID)-1-width].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
            // directly right
            if (currentID < 98 && !rightEdge) {
                const newID = squareArray[parseInt(currentID)+1].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
            // down and to the left
            if (currentID < 90 && !leftEdge) {
                const newID = squareArray[parseInt(currentID)-1+width].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
            // down and to the right
            if (currentID < 88 && !rightEdge) {
                const newID = squareArray[parseInt(currentID)+1+width].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
            // directly down
            if (currentID < 89) {
                const newID = squareArray[parseInt(currentID)+width].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
        }, 10)
    }

    // called when the game ends in failure
    // will call gameOverToast and reveal all bomb locations
    function gameOverFunction(square) {
        gameOverToast()
        gameOver = true
        squareArray.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.classList.add('clicked')
                square.innerHTML = '💣'
            }
        })
    }

    // checks if the game ends in success
    // if the number of correctFlags, as in, squares that have both classes flagged and bomb, the game is won
    // will call gameWinToast
    function winFunction() {
        let correctFlag = 0
        for (let i = 0; i < squareArray.length; i++) {
            if (squareArray[i].classList.contains('flagged') && squareArray[i].classList.contains('bomb')) {
                correctFlag++
            }
            if (correctFlag === bombNumber) {
                gameWinToast()
                gameOver = true
            }
        }
    }

    // reveals a notification when the game ends in failure
    function gameOverToast() {
        var x = document.getElementById("snackbarloss");
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }

    // reveals a notification when the game ends in success
    function gameWinToast() {
        var x = document.getElementById("snackbarwin");
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }
  })