export class PongGameOffline {
  constructor( {
    canvasWidth = 800,
    canvasHeight = 400,
    leftPaddleColor = "white",
    rightPaddleColor = "white"
  } = {} ) {
    // Store configuration
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.leftPaddleColor = leftPaddleColor;
    this.rightPaddleColor = rightPaddleColor;

    // Create canvas
    this.canvas = document.createElement( "canvas" );
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.ctx = this.canvas.getContext( "2d" );

    // Game state variables
    this.ballRadius = 10;
    this.ballSpeedX = 4;
    this.ballSpeedY = 3;
    this.ballX = this.canvasWidth / 2;
    this.ballY = this.canvasHeight / 2;

    this.paddleWidth = 10;
    this.paddleHeight = 80;
    this.leftPaddleY = ( this.canvasHeight - this.paddleHeight ) / 2;
    this.rightPaddleY = ( this.canvasHeight - this.paddleHeight ) / 2;
    this.paddleSpeed = 5;

    this.isRunning = false;
    this.isPaused = false;
    this.keysPressed = {};

    // Setup event listeners
    this.setupListeners();

    // Draw initial instructions
    this.drawText( "Press Enter to Start", this.canvasWidth / 2 - 100, this.canvasHeight / 2, "white", "20px" );
  }

  // Attach keyboard controls for movement, pause, reset, start
  setupListeners() {
    document.addEventListener( "keydown", ( event ) => {
      this.keysPressed[event.key] = true;

      if ( event.key === " " ) {
        // Toggle pause if game is already running
        if ( this.isRunning ) {
          this.isPaused = !this.isPaused;
          if ( !this.isPaused ) {
            this.gameLoop();
          }
        }
      }
      if ( event.code === "KeyR" ) {
        this.resetGame();
      }
      if ( event.key === "Enter" && !this.isRunning ) {
        this.startGame();
      }
    } );

    document.addEventListener( "keyup", ( event ) => {
      delete this.keysPressed[event.key];
    } );
  }

  // Start or restart the game loop
  startGame() {
    this.isRunning = true;
    this.isPaused = false;
    this.resetGame();
    this.gameLoop();
  }

  // Reset all positions and speeds
  resetGame() {
    this.ballX = this.canvasWidth / 2;
    this.ballY = this.canvasHeight / 2;
    this.ballSpeedX = 4;
    this.ballSpeedY = 3;
    this.leftPaddleY = ( this.canvasHeight - this.paddleHeight ) / 2;
    this.rightPaddleY = ( this.canvasHeight - this.paddleHeight ) / 2;
  }

  // Core loop, called by requestAnimationFrame
  gameLoop() {
    if ( !this.isPaused ) {
      this.update();
      this.draw();
      requestAnimationFrame( this.gameLoop.bind( this ) );
    }
  }

  // Update ball & paddle positions, handle collisions
  update() {
    // Move paddles
    if ( this.keysPressed["w"] && this.leftPaddleY > 0 ) {
      this.leftPaddleY -= this.paddleSpeed;
    }
    if ( this.keysPressed["s"] && this.leftPaddleY < this.canvasHeight - this.paddleHeight ) {
      this.leftPaddleY += this.paddleSpeed;
    }
    if ( this.keysPressed["ArrowUp"] && this.rightPaddleY > 0 ) {
      this.rightPaddleY -= this.paddleSpeed;
    }
    if ( this.keysPressed["ArrowDown"] && this.rightPaddleY < this.canvasHeight - this.paddleHeight ) {
      this.rightPaddleY += this.paddleSpeed;
    }

    // Move ball (only if not paused)
    this.ballX += this.ballSpeedX;
    this.ballY += this.ballSpeedY;

    // Top/bottom collision
    if ( this.ballY - this.ballRadius <= 0 || this.ballY + this.ballRadius >= this.canvasHeight ) {
      this.ballSpeedY *= -1;
    }

    // Left paddle collision
    if (
      this.ballX - this.ballRadius <= this.paddleWidth &&
      this.ballY >= this.leftPaddleY &&
      this.ballY <= this.leftPaddleY + this.paddleHeight
    ) {
      this.ballSpeedX *= -1;
      this.ballX = this.paddleWidth + this.ballRadius; // Prevent sticking
    }

    // Right paddle collision
    if (
      this.ballX + this.ballRadius >= this.canvasWidth - this.paddleWidth &&
      this.ballY >= this.rightPaddleY &&
      this.ballY <= this.rightPaddleY + this.paddleHeight
    ) {
      this.ballSpeedX *= -1;
      this.ballX = this.canvasWidth - this.paddleWidth - this.ballRadius; // Prevent sticking
    }

    // Out of bounds (reset)
    if ( this.ballX < 0 || this.ballX > this.canvasWidth ) {
      this.resetGame();
    }
  }

  // Redraw the canvas, ball, paddles, and any overlay text
  draw() {
    // Clear
    this.ctx.clearRect( 0, 0, this.canvasWidth, this.canvasHeight );

    // Ball
    this.drawCircle( this.ballX, this.ballY, this.ballRadius, "white" );

    // Left paddle
    this.drawRect( 0, this.leftPaddleY, this.paddleWidth, this.paddleHeight, this.leftPaddleColor );

    // Right paddle
    this.drawRect(
      this.canvasWidth - this.paddleWidth,
      this.rightPaddleY,
      this.paddleWidth,
      this.paddleHeight,
      this.rightPaddleColor
    );

    // Paused overlay
    if ( this.isPaused ) {
      this.drawText( "Paused", this.canvasWidth / 2 - 40, this.canvasHeight / 2, "white", "30px" );
    }
  }

  // Utility: draw rectangle
  drawRect( x, y, width, height, color ) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect( x, y, width, height );
  }

  // Utility: draw circle
  drawCircle( x, y, radius, color ) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc( x, y, radius, 0, Math.PI * 2 );
    this.ctx.fill();
  }

  // Utility: draw text
  drawText( text, x, y, color, fontSize = "20px" ) {
    this.ctx.fillStyle = color;
    this.ctx.font = fontSize + " Arial";
    this.ctx.fillText( text, x, y );
  }

  // Expose the canvas so the caller can attach it to the DOM
  getCanvas() {
    return this.canvas;
  }
}
