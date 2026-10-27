const navigationEntry = performance.getEntriesByType("navigation")[0];
const isReload = navigationEntry?.type === "reload";

if (sessionStorage.getItem("hasVisitedHome") && !isReload) {
  document.documentElement.classList.add("returning-home");
}

document.addEventListener("DOMContentLoaded", () => {

  /* ========================================
     RESPONSIVE NAVIGATION MENU
  ======================================== */

  const menuToggle = document.getElementById("menu-toggle");
  const navPanel = document.getElementById("nav-panel");
  const navBackdrop = document.getElementById("nav-backdrop");
  const navClose = document.getElementById("nav-close");
  const navBar = document.querySelector(".nbar");
  const resumeUrl = "https://drive.google.com/file/d/19Ro3HEk_fK-tTziPBwZeQaUzM6JyjR14/view?usp=sharing";

  function positionNavPanel() {
    if (!navPanel || !navBar) return;

    navPanel.style.setProperty("--nav-bar-height", `${navBar.offsetHeight}px`);
  }

  positionNavPanel();
  window.addEventListener("resize", positionNavPanel);

  document.querySelectorAll("[data-resume-link]").forEach(link => {
    if (resumeUrl) {
      link.href = resumeUrl;
    } else {
      link.addEventListener("click", event => event.preventDefault());
    }
  });

  function openNav() {
    if (!navPanel || !navBackdrop || !menuToggle) return;

    navPanel.classList.add("is-open");
    navBackdrop.classList.add("is-open");
    document.body.classList.add("nav-open");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");
    navPanel.setAttribute("aria-hidden", "false");
  }

  function closeNav() {
    if (!navPanel || !navBackdrop || !menuToggle) return;

    navPanel.classList.remove("is-open");
    navBackdrop.classList.remove("is-open");
    document.body.classList.remove("nav-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navPanel.setAttribute("aria-hidden", "true");
  }

  if (menuToggle && navPanel && navBackdrop) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navPanel.classList.contains("is-open");

      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });

    navBackdrop.addEventListener("click", closeNav);

    if (navClose) {
      navClose.addEventListener("click", closeNav);
    }

    navPanel.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeNav();
      }
    });
  }

  document.body.classList.remove("page-transition");
  document.body.classList.add("page-ready");

  window.navigateToPage = (href) => {
    const loaderOverlay = document.getElementById("loader-overlay");

    if (loaderOverlay) {
      loaderOverlay.style.display = "none";
    }

    document.body.classList.add("page-transition");

    setTimeout(() => {
      window.location.href = href;
    }, 700);
  };

    document.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", (e) => {

            const href = link.getAttribute("href");

            if (
                !href ||
                href.startsWith("#") ||
                link.target === "_blank" ||
                link.hostname !== window.location.hostname
            ) {
                return;
            }

            e.preventDefault();

            navigateToPage(href);

        });

    });

  /* ========================================
     1. WEBSITE LOADER ANIMATION
  ======================================== */

  const letterElement = document.getElementById("letter");
  const loaderOverlay = document.getElementById("loader-overlay");

  const animationSequence = [
    "अ",
    "অ",
    "அ",
    "അ",
    "અ",
    "ଅ",
    "ਅ",
    '<img src="Assets/Mark.svg" alt="Kannada A">'
  ];

  const scaleAnimationDuration = 800;
  const initialDelay = 300;
  const swapSpeed = 180;

const hasVisitedHome = sessionStorage.getItem("hasVisitedHome");

if (isReload) {
    sessionStorage.removeItem("tetrisGameState");
}

const shouldPlayLoader = !hasVisitedHome || isReload;

sessionStorage.setItem("hasVisitedHome", "true");

  let loaderDuration = 0;

  if (letterElement && loaderOverlay && shouldPlayLoader) {

    loaderDuration =
      scaleAnimationDuration +
      initialDelay +
      (animationSequence.length * swapSpeed) +
      600;

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

  } else if (loaderOverlay) {

    // Skip loader when returning from another page.
    loaderOverlay.style.display = "none";

  }


  /* ========================================
     2. TETRIS GRID ANIMATION
  ======================================== */

  const canvas = document.getElementById("grid-canvas");

  // Stop execution if the canvas does not exist.
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // --- CONFIGURATION ---
  const CELL_SIZE = 24;
  const DROP_SPEED = 300;
  // ---------------------

  let cols, rows;
  let grid = [];
  let clearedLinesCount = 0;

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

  let isGamePaused = false;
  let gameInterval = null;
  let animationFrameId = null;
  let isGameStarted = false;


  /* ========================================
     3. CANVAS & GRID SETUP
  ======================================== */

  function resizeCanvas() {

    const rect = canvas.getBoundingClientRect();

    canvas.width = Math.floor(rect.width);
    canvas.height = Math.floor(rect.height);

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

    grid = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(0));

    clearedLinesCount = 0;

  }


  // Creates a random intro setup where the first I piece
  // falls from the top and completes the bottom row.
  function setupIntroBoard() {

    const targetRow = rows - 1;

    // Choose a random 4-cell gap for the I piece.
    const gapStart = Math.floor(
      Math.random() * Math.max(1, cols - 3)
    );

    // Fill the bottom row except for the 4-cell gap.
    for (let c = 0; c < cols; c++) {
      grid[targetRow][c] =
        c >= gapStart && c < gapStart + 4 ? 0 : 1;
    }

    // Use the horizontal I piece.
    currentPiece = SHAPES[0];

    
    pieceX = gapStart - 3;

    // Start the piece at the very top of the board.
    pieceY = 0;

  }


  function spawnPiece() {

    const shape =
      SHAPES[Math.floor(Math.random() * SHAPES.length)];

    currentPiece = shape;

    const maxPossibleCol = cols - shape[0].length;

    pieceX = Math.floor(
      Math.random() * (maxPossibleCol + 1)
    );

    pieceY = 0;

    if (checkCollision(pieceX, pieceY, currentPiece)) {
      resetGrid();
    }

  }


  /* ========================================
     4. GAME LOGIC
  ======================================== */

  function rotatePiece(piece) {

    const n = piece.length;
    const m = piece[0].length;

    const rotated = Array(m)
      .fill(null)
      .map(() => Array(n).fill(0));

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

          const nextX = px + c;
          const nextY = py + r;

          if (
            nextX < 0 ||
            nextX >= cols ||
            nextY >= rows
          ) {
            return true;
          }

          if (
            nextY >= 0 &&
            grid[nextY][nextX]
          ) {
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

          const targetY = pieceY + r;

          if (targetY >= 0) {

            grid[targetY][pieceX + c] = 1;

          }

        }

      }

    }

    checkLines();

  }


  function checkLines() {

    const linesToRemove = [];

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

    // Stop progressing the animation while paused.
    if (isGamePaused) return;

    if (flashCount < 4) {

      flashLines.forEach(r => {

        grid[r] = grid[r].map(cell => {

          if (cell === 1 || cell === -1) {

            return flashCount % 2 === 0 ? -1 : 1;

          }

          return 0;

        });

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

    if (isGamePaused) return;

    pieceY++;

    if (checkCollision(pieceX, pieceY, currentPiece)) {

      pieceY--;
      lockPiece();

    }

  }


  /* ========================================
     5. GAME STATE SAVE & RESTORE
  ======================================== */

  function saveGameState() {

    if (!grid.length || !currentPiece) return;

    const gameState = {

      cols,
      rows,
      grid,
      clearedLinesCount,
      currentPiece,
      pieceX,
      pieceY

    };

    sessionStorage.setItem(
      "tetrisGameState",
      JSON.stringify(gameState)
    );

  }


  function restoreGameState() {

    const savedState =
      sessionStorage.getItem("tetrisGameState");

    if (!savedState) return false;

    try {

      const state = JSON.parse(savedState);

      if (
        !state.grid ||
        state.cols !== cols ||
        state.rows !== rows
      ) {
        return false;
      }

      grid = state.grid;
      clearedLinesCount = state.clearedLinesCount || 0;
      currentPiece = state.currentPiece;
      pieceX = state.pieceX;
      pieceY = state.pieceY;

      return true;

    } catch (error) {

      console.warn("Unable to restore Tetris state:", error);

      return false;

    }

  }


  /* ========================================
     6. GAME LOOP
  ======================================== */

  function startGameLoop() {

    if (gameInterval) return;

    gameInterval = setInterval(() => {

      if (
        isGamePaused ||
        isClearingAnimation ||
        !currentPiece
      ) {
        return;
      }

      dropPiece();

    }, DROP_SPEED);

  }


  function stopGameLoop() {

    if (gameInterval) {

      clearInterval(gameInterval);
      gameInterval = null;

    }

  }


  /* ========================================
     7. KEYBOARD CONTROLS
  ======================================== */

  if (window.matchMedia("(hover: hover)").matches) {

    window.addEventListener("keydown", (e) => {

      if (
        isGamePaused ||
        isClearingAnimation ||
        !currentPiece ||
        !isGameStarted
      ) {
        return;
      }

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

        if (
          !checkCollision(
            pieceX,
            pieceY,
            nextRotation
          )
        ) {

          currentPiece = nextRotation;

        }

      } else if (e.key === "ArrowDown") {

        dropPiece();

      }

    });

  }


  /* ========================================
     8. CANVAS RENDERING
  ======================================== */

  function draw() {

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    if (!grid.length || !cols || !rows) {

      animationFrameId = requestAnimationFrame(draw);
      return;

    }

    const gridWidth = cols * CELL_SIZE;
    const gridHeight = rows * CELL_SIZE;

    const offsetX = (canvas.width - gridWidth) / 2;
    const offsetY = (canvas.height - gridHeight) / 2;

    for (let r = 0; r < rows; r++) {

      for (let c = 0; c < cols; c++) {

        let isPieceCell = false;

        if (!isClearingAnimation && currentPiece) {

          const pr = r - pieceY;
          const pc = c - pieceX;

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

        const x = offsetX + c * CELL_SIZE;
        const y = offsetY + r * CELL_SIZE;

        const cellState = grid[r][c];

        if (cellState === 1 || isPieceCell) {

          // Dark pressed state

          ctx.fillStyle = "#000000";
          ctx.fillRect(
            x,
            y,
            CELL_SIZE,
            CELL_SIZE
          );

          ctx.strokeStyle = "#ffffff";
          ctx.strokeRect(
            x,
            y,
            CELL_SIZE,
            CELL_SIZE
          );

          // Inner shadows

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

          // Flashing state

          ctx.fillStyle = "#aaaaaa";

          ctx.fillRect(
            x,
            y,
            CELL_SIZE,
            CELL_SIZE
          );

          ctx.strokeStyle = "#ffffff";

          ctx.strokeRect(
            x,
            y,
            CELL_SIZE,
            CELL_SIZE
          );

        } else {

          // Default white state

          ctx.fillStyle = "#ffffff";

          ctx.fillRect(
            x,
            y,
            CELL_SIZE,
            CELL_SIZE
          );

          ctx.strokeStyle = "#ffffff";

          ctx.strokeRect(
            x,
            y,
            CELL_SIZE,
            CELL_SIZE
          );

        }

      }

    }

    animationFrameId = requestAnimationFrame(draw);

  }


  /* ========================================
     9. PAUSE & RESUME
  ======================================== */

  function pauseGame() {

    isGamePaused = true;

    saveGameState();

  }


  function resumeGame() {

    isGamePaused = false;

  }


  // Pause when the browser tab becomes hidden.
  document.addEventListener("visibilitychange", () => {

    if (document.hidden) {

      pauseGame();

    } else {

      resumeGame();

    }

  });


  // Save the game when navigating to another page.
  window.addEventListener("pagehide", () => {

    pauseGame();
    stopGameLoop();

  });


  /* ========================================
     10. START GAME
  ======================================== */

const startGame = () => {

  // Disable Tetris on mobile and tablet
  if (window.matchMedia("(max-width: 1024px)").matches) {
    return;
  }

  resizeCanvas();
  const restored = restoreGameState();

  if (!restored) {
    setupIntroBoard();
  }

  isGameStarted = true;
  window.addEventListener("resize", resizeCanvas);
  startGameLoop();
  animationFrameId = requestAnimationFrame(draw);
};


  // Start Tetris after loader or immediately if skipped.
  if (shouldPlayLoader) {

    setTimeout(startGame, 2000);

  } else {

    startGame();

  }

});