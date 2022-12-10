var song;
var img;
var fft;
var particles = [];

function preload() {
  song = loadSound("Rollin.mp3");
  img = loadImage("A2.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  imageMode(CENTER); // 이미지 센터
  // rectMode(CENTER);
  fft = new p5.FFT(0.9);  //smoothing value default = 0.8, 낮추면 빨라짐

  img.filter(BLUR, 1);  //이미지 블러
  
  noLoop();
}

function draw() {
  background(0);
 
  translate(width / 2, height / 2);

  fft.analyze();              // beat detection fft 이용하여
  amp = fft.getEnergy(2, 200); // 0-255 범위안에서 설정 가능 //beat detction 하면 아래에서 particle.vel 조절
  
  push();
  if (amp > 230) {
    rotate(random(-0.5, 0.5)); // amp가 230이 넘으면 화면 흔들리게
  }

  image(img, 0, 0, width + 100, height + 100); //배경 이미지 크기 조절
  pop();

  // var alpha = map(amp, 0, 255, 180, 150); //검정색 필터 씌움 배경화면을 좀 더 어둡게
  // fill(0, alpha);
  // noStroke();
  // rect(0, 0, width, hegiht);
  if (amp > 230) {
    stroke(237, 76, 0);
  } else {stroke([random(200, 255), random(100, 180), random  //particle 색상 rgb 값
    (0, 100),]);
  }

  strokeWeight(5);   //beat detection
  noFill();

     

  var wave = fft.waveform();
 
  // 원 모양 조절 크기
  for (var t = -1; t <= 1; t += 2) {
    beginShape();        
    for (var i = 0; i <=180; i += 0.5) { //i = 0.5 조절하면 complexity 조절가능
      var index = floor(map(i, 0, 180, 0, wave.length -1));
      
      var r = map(wave[index], -1, 1, 150, 350);

      var x = r * sin(i) * t;  //모양 조절 가능
      var y = r * cos(i);
      
      vertex(x, y);

    }
    endShape();
  }

  var p = new Particle() //프레임에 particle 생성, push
  particles.push(p)

  for (var i = particles.length -1; i >= 0; i--) {
    if (!particles[i].edges()) {
      particles[i].update(amp > 230);  //beat detection에서 사용되는 amp 변수 amp 범위보다 크게? 음악에 따라세부조절
      particles[i].show();
    } else {
      particles.splice(i, 1);
    }

  }

}

function mouseClicked() {
  if (song.isPlaying()) {
    song.pause();
    noLoop();
  } else {
    song.play();
    loop();
  }
}

class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(200); //minimum and maximum radius of the waveform 250 숫자 조절
    this.vel = createVector(0, 0); //위치?
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001)); //particle 속도 조절 smaller than the position vector
    
    this.w = random(3, 5); // change the width

    this.color = [random(200, 255), random(100, 180), random  //particle 색상 rgb 값
    (0, 100), ];

    // this.color = [random(200, 255), random(200, 255), random  //particle 색상 rgb 값
    // (200, 255), ];
  }

  update(cond) {
    this.vel.add(this.acc);   //acc vel update 음악 진행 됨에 따라
    this.pos.add(this.vel);
    if (cond) {
      this.pos.add(this.vel);  //particel과 원의 속도 조절 fft amp 값에 따라
      this.pos.add(this.vel);
      this.pos.add(this.vel);
    }
  }
  edges() {
    if (this.pos.x < -width / 2 || this.pos.x > width / 2 || //화면 밖으로 나가는 점들 컨트롤, 삭제
    this.pos.y < -height /2 || this.pos.y > height / 2) {
      return true;
    } else {
      return false;
    }
  }
  show() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.w); //w는 숫자 가능 this.w에서 범위 변경 가능
  }
}
