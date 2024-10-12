const p1Score = document.getElementById('p1-score');
const p2Score = document.getElementById('p2-score');
const $time = document.getElementById('time');
const tableImg = document.getElementById('table');
const playBtn = document.getElementById('play-btn');
const scoreBoardEl = document.querySelector('.scoreboard');
const startingScreenEl = document.querySelector('.starting-screen');
const replayBtn = document.getElementById('replay-btn');
const exitBtns = document.querySelectorAll('.exit-btn');
const winnerMenuEl = document.querySelector('.winner-menu');
const winnerPlayer = document.getElementById('winner-player');
const pauseMenuEl = document.querySelector('.pause-menu');
const pauseMenuBtns = document.querySelector('.pause-menu-btns');
const p1ControlsBtn = document.getElementById('p1-controls-btn');
const p1ControlsDisplay = document.querySelector('.p1-controls');
const p2ControlsBtn = document.getElementById('p2-controls-btn');
const p2ControlsDisplay = document.querySelector('.p2-controls');
const backBtns = document.querySelectorAll('.back-btn');
const hintsBtns = document.querySelectorAll('.hints-btn');
const hintsContainerDisplay = document.querySelector('.hints-container');
const drawBall = document.getElementById('draw-ball');
const fireworksStars = document.querySelectorAll('.fireworks-star'); 

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 645;

let score1 = 0;
let score2 = 0;
let time = 150;
let isWinner = false;
let winningAudio;
let lastHit = '';
let lastPoint;
let initialPosition = 1;

const paddleRed = '#f11';
const paddleBlack = '#111';

const keys = {
  w: {
    isPressed: false
  },
  s: {
    isPressed: false
  },
  arrowUp: {
    isPressed: false
  },
  arrowDown: {
    isPressed: false
  }
}

let lastKey1;
let lastKey2;

let p1StraightHit = 0;
let p1DirectionalHit = 0;
let p2StraightHit = 0;
let p2DirectionalHit = 0;

let gamePaused = false;
let gameRunning = false;
let timeInterval;
let drawInterval;
let allowPause = false;



ctx.fillStyle = '#f5c4ab'; 
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.drawImage(tableImg, 0, 0, 1024, 645);

let paddle1;
let paddle2;
let ball;


// Function startGame()

function startGame() {
  scoreBoardEl.style.opacity = 1;
  startingScreenEl.style.display = 'none';
  winnerMenuEl.style.display = 'none';  
  resetTable();
  
  score1 = 0;
  p1Score.innerText = score1;
  score2 = 0;  
  p2Score.innerText = score2;
  time = 150;
  $time.innerText = time;
  isWinner = false;
  gameRunning = true;  
  allowPause = false;
  lastHit = '';

  p1StraightHit = 0;
  p1DirectionalHit = 0;
  p2StraightHit = 0;
  p2DirectionalHit = 0;

  paddle1 = new Paddle(17, canvas.height * 0.75 - 75, paddleRed);
  paddle1.draw();
  paddle2 = new Paddle(canvas.width - 32, canvas.height * 0.25 - 75, paddleBlack);
  paddle2.draw();

  initialDraw();
}


// Function restartGame()

function restartGame () {  

  winnerMenuEl.style.display = 'none';
  resetTable();

  score1 = 0;
  p1Score.innerText = score1;
  score2 = 0;  
  p2Score.innerText = score2;
  time = 150;
  $time.innerText = time;
  isWinner = false;  
  gameRunning = true;
  allowPause = false;
  lastHit = '';

  p1StraightHit = 0;
  p1DirectionalHit = 0;
  p2StraightHit = 0;
  p2DirectionalHit = 0;

  if(winningAudio) {
    winningAudio.pause();
    winningAudio.currentTime = 0;
  }

  paddle1 = new Paddle(17, canvas.height * 0.75 - 75, paddleRed);
  paddle1.draw();
  paddle2 = new Paddle(canvas.width - 32, canvas.height * 0.25 - 75, paddleBlack);
  paddle2.draw();

  initialDraw();
}


// Initial draw

function initialDraw() {  
  drawBall.style.display = 'block';
  let drawColor = Math.random() - 0.5 < 0 ? '#f11' : '#111';
  let drawTime = 3;

  drawInterval = setInterval(() => {
    drawTime-=0.1
    if(drawTime <= 0) clearInterval(drawInterval);
    else {
      drawColor = drawColor === '#f11' ? '#111' : '#f11';
      drawBall.style.backgroundColor = drawColor;
    }
    drawBall.style.animation = 'drawAnimation 3s 1 ease-in-out';   
  }, 100)

  setTimeout(() => {
    drawBall.style.display = 'none';
    if(drawColor === '#f11') ball = new Ball(paddle1.x + paddle1.width, paddle1.y + paddle1.height/2, 10, 10);  
    else ball = new Ball(paddle2.x, paddle2.y + paddle1.height/2, 10, -10);  
    allowPause = true;
    resumeGame()    
  }, 5000)  
}

// Reset table

function resetTable() {
  ctx.fillStyle = '#f5c4ab';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(tableImg, 50, 31, 924, 583);
  canvas.style.borderColor = 'white';
  canvas.style.boxShadow = 'none';
}


// Function pauseGame()

function pauseGame() {
  gamePaused = true;
  pauseMenuEl.style.display = 'flex';
  clearInterval(timeInterval)
}


// Function resumeGame()

function resumeGame() {
  pauseMenuEl.style.display = 'none';
  gamePaused = false;
  timeInterval = setInterval(() => {
    if(time <= 0) clearInterval(timeInterval);
    else {
      time--;
      $time.innerText = time;
    }
  }, 1000)
  animate()
}


// Function exitGame()

function exitGame() {  

  scoreBoardEl.style.opacity = 0;
  winnerMenuEl.style.display = 'none';
  pauseMenuEl.style.display = 'none';
  startingScreenEl.style.display = 'flex';
  gameRunning = false;

  clearInterval(timeInterval)

  if(winningAudio) {
    winningAudio.pause();
    winningAudio.currentTime = 0;
  }

  resetTable();
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(tableImg, 0, 0, 1024, 645);
}


// Function checkCollision()

function checkCollision(paddle, ball) {
  if(paddle === paddle1 && ball.speedX < 0) {
    return (
      paddle.x + paddle.width >= ball.x - ball.radius &&
      paddle.y <= ball.y &&
      paddle.y + paddle.height >= ball.y
    )
  }
  else if(paddle === paddle2 && ball.speedX > 0) {
    return (
      paddle.x <= ball.x + ball.radius &&
      paddle.y <= ball.y &&
      paddle.y + paddle.height >= ball.y
    )
  }  
}



// Function ballInRange()

function ballInRange(paddle, ball) {
  return (
    paddle.y <= ball.y && 
    paddle.y + paddle.height >= ball.y
  )
}



// Function addPoint()

function addPoint(player) {
  if (player === 'player2') {
    canvas.style.borderLeftColor = 'orange';
    canvas.style.boxShadow = '-10px 0 5px 0 orange';
    score2++;
    p2Score.innerText = score2;
    lastPoint = 'player2';
  } else if (player === 'player1') {
    canvas.style.borderRightColor = 'orange';
    canvas.style.boxShadow = '10px 0 5px 0 orange';
    score1++;
    p1Score.innerText = score1;
    lastPoint = 'player1';
  }
  ball = new Ball(canvas.width/2, canvas.height/2, 10, 0, 'transparent');  
  initialPosition = initialPosition === 1 ? 2 : 1;
  p1StraightHit = 0;
  p1DirectionalHit = 0;
  p2StraightHit = 0;
  p2DirectionalHit = 0;
}


// Function playNextPoint() 

function playNextPoint() {  
  setTimeout(() => {
    if(initialPosition === 1) {      
      paddle1 = new Paddle(17, canvas.height * 0.75 - 75, paddleRed);
      paddle2 = new Paddle(canvas.width - 32, canvas.height * 0.25 - 75, paddleBlack);
    } else if (initialPosition === 2){
      paddle1 = new Paddle(17, canvas.height * 0.25 - 75, paddleRed);
      paddle2 = new Paddle(canvas.width - 32, canvas.height * 0.75 - 75, paddleBlack);
    }
    if(lastPoint === 'player1') {
      ball = new Ball(paddle2.x, paddle2.y + paddle1.height/2, 10, 10);
      if(paddle2.y > canvas.height / 2) ball.speedY = -ball.speedY;
    } else if(lastPoint === 'player2') {  
      ball = new Ball(paddle1.x + paddle1.width, paddle1.y + paddle1.height/2, 10, 10);
      if(paddle1.y < canvas.height / 2) ball.speedY = -ball.speedY;
    }    
  }, 1500)
}


// Function getResult()

function getResult(player) {
  clearInterval(timeInterval);
  isWinner = true;
  gameRunning = false;
  winnerMenuEl.style.display = 'flex';
  winnerPlayer.innerText = `${player.toUpperCase()} WINS!`;
  if(player === 'player1') {
    winnerPlayer.style.textShadow = `0 5px 10px ${paddleRed}`; 
    getFireworks('player1');
  } else {
    winnerPlayer.style.textShadow = `0 5px 5px ${paddleBlack}`;       
    getFireworks('player2');
  }
  setTimeout(() => {
    getWinningSound()
  }, 3000)
}


// Function getFireworks()

function getFireworks(player) {
  if(player === 'player1') {
    fireworksStars.forEach(star => star.style.color = paddleRed)
    for(let i = 0; i < fireworksStars.length; i++){
      setTimeout(() => {
        fireworksStars[i].style.opacity = 1;        
        fireworksStars[i].style.top = `${Math.floor(Math.random() * 100)}%`;
        fireworksStars[i].style.left = `${Math.floor(Math.random() * 100)}%`;
        fireworksStars[i].style.transform = `scale(${Math.floor(Math.random() * 5) + 2})`;        
        getFireworksSound();
      }, i * 120 + 200);
      setTimeout(() => {        
        fireworksStars[i].style.opacity = 0;  
      }, i * 500 + 1500)
    }
  }

  if(player === 'player2') {
    fireworksStars.forEach(star => star.style.color = paddleBlack)
    for(let i = 0; i < fireworksStars.length; i++){
      setTimeout(() => {
        fireworksStars[i].style.opacity = 1;        
        fireworksStars[i].style.top = `${Math.floor(Math.random() * 100)}%`;
        fireworksStars[i].style.left = `${Math.floor(Math.random() * 100)}%`;
        fireworksStars[i].style.transform = `scale(${Math.floor(Math.random() * 5) + 2})`;
        getFireworksSound();
      }, i * 120 + 200);
      setTimeout(() => {        
        fireworksStars[i].style.opacity = 0;  
      }, i * 500 + 1500)
    }
  }
}



// ANIMATE

function animate() {
  ctx.fillStyle = '#f5c4ab';
  ctx.fillRect(0, 0, canvas.width, canvas.width);  
  ctx.drawImage(tableImg, 50, 31, 924, 583);

  ball.inPaddle1Range = ballInRange(paddle1, ball) ? true : false;
  ball.inPaddle2Range = ballInRange(paddle2, ball) ? true : false;

  paddle1.update();
  paddle2.update();
  ball.update();

  paddle1.speed = 0;
  paddle2.speed = 0;

  // Paddle movement

  if(keys.arrowUp.isPressed && lastKey2 === 'ArrowUp') paddle2.speed = -5;
  else if(keys.arrowDown.isPressed && lastKey2 === 'ArrowDown') paddle2.speed = 5;

  if(keys.w.isPressed && lastKey1 === 'w') paddle1.speed = -5;
  else if(keys.s.isPressed && lastKey1 === 's') paddle1.speed = 5;


  // checkCollision paddle1/ball
 
  if(checkCollision(paddle1, ball)) {
    if(p1StraightHit) {
      ball.speedX = -(-ball.speedX + p1StraightHit);
      ball.speedY = 0;
    } else if(p1DirectionalHit) {
      ball.speedY = -ball.speedY + p1DirectionalHit;
      ball.speedX = -ball.speedX;
    } else {
      ball.speedX = -ball.speedX;
      ball.speedY = -ball.speedY;
    }
    lastHit = 'player1';
    p1StraightHit = 0;
    p1DirectionalHit = 0;
    getBallSound();
  }

  // checkCollision paddle2/ball
 
  if(checkCollision(paddle2, ball)) {
    if(p2StraightHit) {
      ball.speedX = -(ball.speedX + p2StraightHit);
      ball.speedY = 0;
    } else if(p2DirectionalHit) {
      ball.speedY = -ball.speedY + p2DirectionalHit;
      ball.speedX = -ball.speedX;
    } else {
      ball.speedX = -ball.speedX;
      ball.speedY = -ball.speedY;
    }
    lastHit = 'player2';
    p2StraightHit = 0;
    p2DirectionalHit = 0;
    getBallSound();
  }

  // Collision ball/border + addPoints

  canvas.style.borderColor = 'white';
  canvas.style.boxShadow = 'none';

  if (ball.x - ball.radius <= 0) {
    addPoint('player2');  
    getPointSound();  
    playNextPoint();
  } else if (ball.x + ball.radius >= canvas.width) {
    addPoint('player1');
    getPointSound();
    playNextPoint();    
  } else if ((ball.y + ball.radius <= 0) || (ball.y - ball.radius >= canvas.height)) {
    if(lastHit === 'player1') {
      addPoint('player2');
    } else if(lastHit === 'player2') {
      addPoint('player1');
    }
    playNextPoint()
  }


  // getResult

  if (time <= 0) {
    if(score1 >= score2 + 2) getResult('player1');
    else if(score2 >= score1 + 2) getResult('player2');
  }

  if ((score1 >= 7 && score2 === 0) || 
      (score1 >= 11 && score1 >= score2 + 2)) getResult('player1');

  if ((score2 >= 7 && score1 === 0) || 
      (score2 >= 11 && score2 >= score1 + 2)) getResult('player2');


  if(!isWinner && !gamePaused) requestAnimationFrame(animate);
}

window.addEventListener('keydown', ( {key} ) => {
  switch(key) {
    case 'ArrowDown':
      keys.arrowDown.isPressed = true;
      lastKey2 = 'ArrowDown';
      break;
    case 'ArrowUp':
      keys.arrowUp.isPressed = true;      
      lastKey2 = 'ArrowUp';
      break;
    case 'w':
    case 'W':
      keys.w.isPressed = true;
      lastKey1 = 'w';
      break;
    case 's':
    case 'S':
      keys.s.isPressed = true;      
      lastKey1 = 's';
      break;      
  }
})


// KEY LISTENERS

window.addEventListener('keyup', ( {key} ) => {
  switch(key) {
    case 'ArrowDown':
      keys.arrowDown.isPressed = false;
      break;
    case 'ArrowUp':
      keys.arrowUp.isPressed = false;
      break;
    case 'w':
    case 'W':
      keys.w.isPressed = false;
      break;
    case 's':
    case 'S':
      keys.s.isPressed = false;
      break;
    case 'ArrowLeft':
      if(ball.speedX > 0) {
        p2DirectionalHit = 0;
        p2StraightHit += 2;
      }      
      break;
    case 'ArrowRight':
      if(ball.speedX > 0) {
        p2StraightHit = 0;
        if(ball.speedY > 0 || (ball.speedY === 0 && ball.y < canvas.height/2 )) p2DirectionalHit += 2;
        else p2DirectionalHit -=2;
      }
      break;
    case 'd':
    case 'D':
      if(ball.speedX < 0) {
        p1DirectionalHit = 0;
        p1StraightHit += 2;
      }      
      break;
    case 'a':
    case 'A':
      if(ball.speedX < 0) {
        p1StraightHit = 0;
        if(ball.speedY > 0 || (ball.speedY === 0 && ball.y < canvas.height/2)) p1DirectionalHit += 2;
        else p1DirectionalHit -=2;
      }
      break;
      case ' ':
        if(gameRunning && allowPause) {
          if(gamePaused) resumeGame();
          else pauseGame();
        }  
  }
})


// CLICK LISTENERS

playBtn.addEventListener('click', startGame)
replayBtn.addEventListener('click', restartGame)
exitBtns.forEach(button => button.addEventListener('click', exitGame))

p1ControlsBtn.addEventListener('click', () => {
  p1ControlsDisplay.style.display = 'block';
  pauseMenuBtns.style.display = 'none'
})

p2ControlsBtn.addEventListener('click', () => {
  p2ControlsDisplay.style.display = 'block';
  pauseMenuBtns.style.display = 'none'
})

backBtns.forEach(btn => btn.addEventListener('click', () => {
  hintsContainerDisplay.style.display = 'none';  
  p1ControlsDisplay.style.display = 'none';
  p2ControlsDisplay.style.display = 'none';
  pauseMenuBtns.style.display = 'flex'
})
)

hintsBtns.forEach(btn => btn.addEventListener('click', () => {
  hintsContainerDisplay.style.display = 'block';  
  p1ControlsDisplay.style.display = 'none';
  p2ControlsDisplay.style.display = 'none';
}))


/* TODO 



*/