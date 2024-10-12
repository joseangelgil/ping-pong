 class Paddle {
  constructor(x, y, color) {
    this.x = x;  
    this.y = y;
    this.speed = 0;
    this.width = 15;
    this.height = 150;
    this.color = color;
  }

  draw(){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = '#402a1f';
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  update(){
    this.draw();
    this.y += this.speed;
    if (this.y <= 0) this.y = 0;
    else if (this.y + this.height >= canvas.height) this.y = canvas.height - this.height;
  }
}

class Ball {
  constructor(x, y, radius, speed, color = 'orange') {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.speedX = speed;
    this.speedY = -speed*(323/974); // Initial height/width ratio between paddles center positions.
    this.inPaddle1Range = false;
    this.inPaddle2Range = false;
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  update(){
    this.draw();

    if(this.x + this.speedX < 32 && this.inPaddle1Range) {
      this.x = 32 + this.radius;
    } else if(this.x + this.speedX > canvas.width - 32 && this.inPaddle2Range){
      this.x = canvas.width - 32 - this.radius;
    } else {
      this.x += this.speedX;
    }
    this.y += this.speedY;
  }
}

