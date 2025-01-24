export function gamePageOffline() {
  const canvas = document.createElement( "canvas" );
  const ctx = canvas.getContext( "2d" );

  // Set canvas dimensions
  canvas.width = 800;
  canvas.height = 400;

  // Game variables
  let ballX = canvas.width / 2;
  let ballY = canvas.height / 2;
  let ballSpeedX = 4;
  let ballSpeedY = 3;
  const ballRadius = 10;

  const paddleWidth = 10;
  const paddleHeight = 80;
  let leftPaddleY = ( canvas.height - paddleHeight ) / 2;
  let rightPaddleY = ( canvas.height - paddleHeight ) / 2;
  const paddleSpeed = 5;

  let keysPressed = {};
  let isRunning = false;
  let isPaused = false;

  // Input handling
  document.addEventListener( "keydown", ( event ) => {
    keysPressed[event.key] = true;
    if ( event.key === " " ) { // Space for pausing/unpausing
      if ( isRunning ) {
        isPaused = !isPaused;
        if ( !isPaused ) gameLoop();
      }
    }
    if (event.code === "KeyR") {
      resetGame();
    }
  } );

  document.addEventListener( "keyup", ( event ) => {
    delete keysPressed[event.key];
  } );

  function resetGame() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 4;
    ballSpeedY = 3;
    leftPaddleY = ( canvas.height - paddleHeight ) / 2;
    rightPaddleY = ( canvas.height - paddleHeight ) / 2;
  }

  function drawRect( x, y, width, height, color ) {
    ctx.fillStyle = color;
    ctx.fillRect( x, y, width, height );
  }

  function drawCircle( x, y, radius, color ) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc( x, y, radius, 0, Math.PI * 2 );
    ctx.fill();
  }

  function drawText( text, x, y, color, fontSize = "20px" ) {
    ctx.fillStyle = color;
    ctx.font = fontSize + " Arial";
    ctx.fillText( text, x, y );
  }

  function update() {
    // Paddle movement
    if ( keysPressed["w"] && leftPaddleY > 0 ) {
      leftPaddleY -= paddleSpeed;
    }
    if ( keysPressed["s"] && leftPaddleY < canvas.height - paddleHeight ) {
      leftPaddleY += paddleSpeed;
    }
    if ( keysPressed["ArrowUp"] && rightPaddleY > 0 ) {
      rightPaddleY -= paddleSpeed;
    }
    if ( keysPressed["ArrowDown"] && rightPaddleY < canvas.height - paddleHeight ) {
      rightPaddleY += paddleSpeed;
    }

    if ( !isPaused ) {
      // Ball movement
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      // Ball collision with top and bottom
      if ( ballY - ballRadius <= 0 || ballY + ballRadius >= canvas.height ) {
        ballSpeedY *= -1;
      }

      // Ball collision with paddles
      if (
        ballX - ballRadius <= paddleWidth &&
        ballY >= leftPaddleY &&
        ballY <= leftPaddleY + paddleHeight
      ) {
        ballSpeedX *= -1;
        ballX = paddleWidth + ballRadius; // Prevent sticking
      }

      if (
        ballX + ballRadius >= canvas.width - paddleWidth &&
        ballY >= rightPaddleY &&
        ballY <= rightPaddleY + paddleHeight
      ) {
        ballSpeedX *= -1;
        ballX = canvas.width - paddleWidth - ballRadius; // Prevent sticking
      }

      // Ball out of bounds (reset to center)
      if ( ballX < 0 || ballX > canvas.width ) {
        resetGame();
      }
    }
  }

  function draw() {
    // Clear the canvas
    ctx.clearRect( 0, 0, canvas.width, canvas.height );

    // Draw the ball
    drawCircle( ballX, ballY, ballRadius, "white" );

    // Draw paddles
    drawRect( 0, leftPaddleY, paddleWidth, paddleHeight, "white" );
    drawRect( canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight, "white" );

    // Draw pause message
    if ( isPaused ) {
      drawText( "Paused", canvas.width / 2 - 40, canvas.height / 2, "white", "30px" );
    }
  }

  function gameLoop() {
    if ( !isPaused ) {
      update();
      draw();
      requestAnimationFrame( gameLoop );
    }
  }

  // Start the game with Enter key
  document.addEventListener( "keydown", ( event ) => {
    if ( event.key === "Enter" && !isRunning ) {
      isRunning = true;
      isPaused = false;
      resetGame();
      gameLoop();
    }
  } );

  // Initial screen
  drawText( "Press Enter to Start", canvas.width / 2 - 100, canvas.height / 2, "white", "20px" );

  return canvas;
}