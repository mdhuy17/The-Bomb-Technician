import {
    TILE_STATUSES,
    createBoard,
    markTile,
    revealTile,
    checkWin,
    checkLose,
    remarkTile,
    getCount,
    setCount,
    } from "./minesweeper.js"
  const BOARD_SIZE = 10
  const NUMBER_OF_MINES = 20
  let positions = []
  let state = []
  
  const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)
  const boardElement = document.querySelector(".board")
  const undo = document.querySelector(".undobtn")
  
  const minesLeftText = document.querySelector("[data-mine-count]")
  const notification = document.querySelector(".Notification")
  let i = 0
  
  board.forEach(row => {
      row.forEach(tile => {
        boardElement.append(tile.element)
        tile.element.addEventListener("click", () => {
            revealTile(board,positions,tile)
            state[i] = getCount()
            console.log("state" + i +": " + state[i])
            i = i + 1
            setCount(0)
            checkGameEnd()
          
        })
        tile.element.addEventListener("contextmenu", e => {
          e.preventDefault()
          markTile(tile)
          listMinesLeft()
          })
         
      }) 
  })
  
  boardElement.style.setProperty("--size", BOARD_SIZE)
  minesLeftText.textContent = NUMBER_OF_MINES
  
  
  function listMinesLeft() {
      const markedTilesCount = board.reduce((count, row) => {
        return (
          count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
        )
      }, 0)
      minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount
  
  }
  
  function checkGameEnd() {
    const win = checkWin(board)
    const lose = checkLose(board)
    if (lose) 
    {
      notification.textContent = "You Lose"
      boardElement.style.pointerEvents = 'none';
    }
    if (win) {
      notification.textContent = "You Win"
      boardElement.addEventListener("click", stopProp, { capture: true })
      boardElement.addEventListener("contextmenu", stopProp, { capture: true })
      undo.style.pointerEvents = 'none';
  
    }
  
  }
  
  function stopProp(e) {
      e.stopImmediatePropagation();
  }
  
  function execute(){
    remarkTile(board, positions.pop())
  }
  
  document.getElementById('undo').onclick = function(){
          boardElement.style.pointerEvents = 'fill';
          notification.textContent = ""
          for (let index = 0; index < state[state.length - 1]; index++) {
            execute();
          }
          state.pop()
    }
   
    
  