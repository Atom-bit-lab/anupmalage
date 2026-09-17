document.addEventListener("DOMContentLoaded", () => {

  /* ========================================
     1. WEBSITE LOADER ANIMATION
  ======================================== */

  const letterElement = document.getElementById("letter");
  const loaderOverlay = document.getElementById("loader-overlay");

  const animationSequence = [
    "अ",
    "অ",
    "அ",
    "అ",
    "അ",
    "અ",
    "ଅ",
    "ਅ",
    '<img src="Assets/Mark.svg" alt="Kannada A">'
  ];

  const scaleAnimationDuration = 800;
  const initialDelay = 300;
  const swapSpeed = 180;

  if (letterElement && loaderOverlay) {

    setTimeout(() => {

      let index = 0;

      const cycleInterval = setInterval(() => {

        letterElement.innerHTML = animationSequence[index];
        index++;

        if (index >= animationSequence.length) {

          clearInterval(cycleInterval);

          setTimeout(() => {
            loaderOverlay.classList.add("fade-out");
          }, 600);

        }

      }, swapSpeed);

    }, scaleAnimationDuration + initialDelay);

  }


  /* ========================================
     2. TETRIS GRID ANIMATION
  ======================================== */

  const canvas = document.getElementById("grid-canvas");
  const ctx = canvas.getContext("2d");

  // --- CONFIGURATION ---
  const CELL_SIZE = 24;
  const DROP_SPEED = 300;
  // ---------------------

  let cols, rows;
  let grid = [];
  let clearedLinesCount = 0;

  // Standard Tetris Shapes (Matrices)
  const SHAPES = [
    [[1, 1, 1, 1]], // I
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1], [1, 1]], // O
    [[1, 1, 0], [0, 1, 1]], // Z
  ];

  let currentPiece = null;
  let pieceX = 0;
  let pieceY = 0;
  let isClearingAnimation = false;
  let flashLines = [];
  let flashCount = 0;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const newCols = Math.floor(canvas.width / CELL_SIZE);
    const newRows = Math.floor(canvas.height / CELL_SIZE);

    if (!grid.length || cols !== newCols || rows !== newRows) {
      cols = newCols;
      rows = newRows;
      resetGrid();
      spawnPiece();
    }
  }

  function resetGrid() {
    grid = Array(rows).fill(null).map(() => Array(cols).fill(0));
    clearedLinesCount = 0;
  }

  function spawnPiece() {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    currentPiece = shape;

    const maxPossibleCol = cols - shape[0].length;
    pieceX = Math.floor(Math.random() * (maxPossibleCol + 1));
    pieceY = 0;

    if (checkCollision(pieceX, pieceY, currentPiece)) {
      resetGrid();
    }
  }

  function rotatePiece(piece) {
    const n = piece.length;
    const m = piece[0].length;

    let rotated = Array(m).fill(null).map(() => Array(n).fill(0));

    for (let r = 0; r < n; r++) {
      for (let c = 0; c < m; c++) {
        rotated[c][n - 1 - r] = piece[r][c];
      }
    }

    return rotated;
  }

  function checkCollision(px, py, piece) {
    for (let r = 0; r < piece.length; r++) {
      for (let c = 0; c < piece[r].length; c++) {

        if (piece[r][c]) {

          let nextX = px + c;
          let nextY = py + r;

          if (nextX < 0 || nextX >= cols || nextY >= rows) {
            return true;
          }

          if (nextY >= 0 && grid[nextY][nextX]) {
            return true;
          }

        }

      }
    }

    return false;
  }

  function lockPiece() {
    for (let r = 0; r < currentPiece.length; r++) {
      for (let c = 0; c < currentPiece[r].length; c++) {

        if (currentPiece[r][c]) {

          let targetY = pieceY + r;

          if (targetY >= 0) {
            grid[targetY][pieceX + c] = 1;
          }

        }

      }
    }

    checkLines();
  }

  function checkLines() {
    let linesToRemove = [];

    for (let r = rows - 1; r >= 0; r--) {
      if (grid[r].every(cell => cell === 1)) {
        linesToRemove.push(r);
      }
    }

    if (linesToRemove.length > 0) {

      isClearingAnimation = true;
      flashLines = linesToRemove;
      flashCount = 0;

      triggerLineFlash();

    } else {
      spawnPiece();
    }
  }

  function triggerLineFlash() {

    if (flashCount < 4) {

      flashLines.forEach(r => {
        grid[r] = grid[r].map(cell =>
          cell === 1 || cell === -1
            ? (flashCount % 2 === 0 ? -1 : 1)
            : 0
        );
      });

      flashCount++;
      setTimeout(triggerLineFlash, 100);

    } else {

      flashLines
        .sort((a, b) => a - b)
        .forEach(r => {

          grid.splice(r, 1);
          grid.unshift(Array(cols).fill(0));
          clearedLinesCount++;

        });

      isClearingAnimation = false;
      flashLines = [];

      spawnPiece();

    }
  }

  function dropPiece() {

    pieceY++;

    if (checkCollision(pieceX, pieceY, currentPiece)) {
      pieceY--;
      lockPiece();
    }

  }

  // Handle game loop ticks
  setInterval(() => {

    if (isClearingAnimation || !currentPiece) return;

    dropPiece();

  }, DROP_SPEED);


  // --- UPDATED ARROW KEY USER CONTROLS ---

  if (window.matchMedia("(hover: hover)").matches) {

    window.addEventListener("keydown", (e) => {

      if (isClearingAnimation || !currentPiece) return;

      if (e.key === "ArrowLeft") {

        pieceX--;

        if (checkCollision(pieceX, pieceY, currentPiece)) {
          pieceX++;
        }

      } else if (e.key === "ArrowRight") {

        pieceX++;

        if (checkCollision(pieceX, pieceY, currentPiece)) {
          pieceX--;
        }

      } else if (e.key === "ArrowUp") {

        const nextRotation = rotatePiece(currentPiece);

        if (!checkCollision(pieceX, pieceY, nextRotation)) {
          currentPiece = nextRotation;
        }

      } else if (e.key === "ArrowDown") {

        dropPiece();

      }

    });

  }


  // Main Render Loop (60fps)

  function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < rows; r++) {

      for (let c = 0; c < cols; c++) {

        let isPieceCell = false;

        if (!isClearingAnimation && currentPiece) {

          let pr = r - pieceY;
          let pc = c - pieceX;

          if (
            pr >= 0 &&
            pr < currentPiece.length &&
            pc >= 0 &&
            pc < currentPiece[pr].length
          ) {

            if (currentPiece[pr][pc]) {
              isPieceCell = true;
            }

          }

        }

        const x = c * CELL_SIZE;
        const y = r * CELL_SIZE;
        const cellState = grid[r][c];

        if (cellState === 1 || isPieceCell) {

          // Skeuomorphic Dark Pressed State

          ctx.fillStyle = "#000000";
          ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

          ctx.strokeStyle = "#ffffff";
          ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);

          // Deep Inner Shadows

          ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";

          ctx.beginPath();
          ctx.moveTo(x + CELL_SIZE, y);
          ctx.lineTo(x + CELL_SIZE, y + CELL_SIZE);
          ctx.lineTo(x, y + CELL_SIZE);
          ctx.stroke();

          ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";

          ctx.beginPath();
          ctx.moveTo(x, y + CELL_SIZE);
          ctx.lineTo(x, y);
          ctx.lineTo(x + CELL_SIZE, y);
          ctx.stroke();

        } else if (cellState === -1) {

          // Flashing State during line clear

          ctx.fillStyle = "#aaaaaa";
          ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

          ctx.strokeStyle = "#ffffff";
          ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);

        } else {

          // Default Porcelain White State

          ctx.fillStyle = "#ffffff";
          ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

          ctx.strokeStyle = "#ffffff";
          ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);

        }

      }

    }

    requestAnimationFrame(draw);

  }

// Start Tetris only after the loader animation finishes
setTimeout(() => {

  resizeCanvas();

  window.addEventListener("resize", resizeCanvas);

  requestAnimationFrame(draw);

}, 4000);
});