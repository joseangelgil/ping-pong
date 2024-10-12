function getBallSound() {
  const ballAudio = new Audio('audio/ball.mp3');
  ballAudio.currentTime = 0.4;
  ballAudio.play();
}

function getPointSound() {
  const pointAudio = new Audio('audio/pointSound2.mp3');
  pointAudio.volume = 0.2;
  pointAudio.play();
}

function getWinningSound() {
  winningAudio = new Audio('audio/crowd-cheering.mp3');
  winningAudio.volume = 0.3;
  winningAudio.play();
}

function getFireworksSound() {
  const fireworksAudio = new Audio('audio/fireworks.mp3');
  fireworksAudio.volume = 0.5;
  fireworksAudio.play();
}