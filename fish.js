function setup() {
  createCanvas(500, 500);
  angleMode(DEGREES);
}

let space = 0.1
let a = 0.1;
let bi = 0;

function drawFish() {
  strokeWeight(2)
  noFill()

  noStroke()
  //upfin
  push()
  translate(30, -10)
  rotate(0)
  beginShape()
  for (let i = 0; i < 245; i += space) {
    fill(250, 150, 150)
    let y = sin(i) * (25 + bi);
    let x = i / 2;
    let n = noise(a, bi)
    let h = map(n, 0, 1, 0, 20)

    y += h
    vertex(x / 1.2, -y - 30)
    a += 0.002
  }
  endShape()
  a = 0;
  pop()

  //downfin
  push()
  translate(200, 25)
  rotate(-204)

  beginShape()
  for (let i = 0; i < 205; i += 0.1) {
    fill(240, 190, 150)
    let y = sin(i) * 25;
    let x = i;
    let n = noise(a)
    let h = map(n, 0, 1, 0, 20)

    y += h
    //push()
    //rotate(0.1)
    vertex(x / 3, -y + 45)
    //pop()
    a += 0.002

  }

  endShape()
  a = 0;

  pop()

  //down
  beginShape()
  vertex(-36, -20)
  for (let i = -40; i < 205; i += space) {
    // noStroke()
    fill(240, 220, 150)
    let y = sin(i) * 25;
    let x = i;
    let n = noise(a, bi)
    let h = map(n, 0, 1, -10, 10)

    y += h
    vertex(x, y)
    a += 0.002


  }
  endShape()
  //up
  beginShape()
  vertex(-35, 40)
  for (let i = 0; i < 245; i += space) {
    //noStroke()
    fill(250, 120, 120)

    let y = sin(i) * 25;
    let x = i;

    let n = noise(a, bi)
    let h = map(n, 0, 1, -5, 10)

    y += h
    vertex(x - 40, -y - 30)
    a += 0.002
  }
  curveVertex(80, -9)
  curveVertex(50, -10)
  vertex(10, -5)
  vertex(-10, -10)
  vertex(-35, 10)
  endShape()

  //mouth
  // push()
  // 	translate(-20,0)
  // 	beginShape()
  // 	vertex(0,0)
  // 	vertex(0,-37)
  // 	curveVertex(-20,-25)
  // 	vertex(0,-8)
  // 	vertex(0,0)
  // 	endShape()
  // pop()

  //stroke(0)
  noFill()





  // let upfin=40;
  //   push()
  // translate(100,-40);
  // rotate(10)
  // for (let i=-230;i<0;i+=space){
  //   let x=map(cos(i),0,1,0,1)
  //   let y=map(sin(i),1,0,0,1)
  //   var n=noise(x,y)
  //   var h=map(n,0,1,15,upfin)
  //   rotate(space)
  //   rect(0,5,-h,1);
  // }
  // pop();
  //down
  // push()
  // translate(150,20);
  // rotate(-16)
  // let space=0.1;
  // for (let i=0;i<100;i+=space){
  //   let x=map(cos(i),0,1,0,3)
  //   let y=map(sin(i),1,0,0,3)
  //   var n=noise(x,y)
  //   var h=map(n,0,1,-0,80)
  //   rotate(space)
  //   rect(0,-10,h,1);
  // }
  // pop();

  //tail
  fill(240, 220, 150)
  push()
  translate(205, -15)
  beginShape()
  vertex(0, 0)
  vertex(60, -50)
  curveVertex(50, 0)
  vertex(60, 50)
  vertex(0, 10)
  endShape(CLOSE)
  pop()


  //eye
  let eye = 1
  for (let i = 0; i < eye; i++) {
    let x = 1;
    let y = -35;
    circle(x, y, 15)
    fill(0)
    circle(x, y, 8)
  }



  //cir
  let cir = 5
  push()
  for (let i = 0; i < cir; i++) {
    noStroke();
    let x = 31 + cir * 0.0001;
    let y = 2
    fill(50, 50, 50)

    // circle(x1,y1,random(2,10))

    translate(x, y)
    beginShape()
    for (let i = 0; i < 360; i += space / 5) {
      let yoff = map(cos(i), -1, 1, 0, 1);
      let xoff = map(sin(i), -1, 1, 0, 3);
      let n = map(noise(xoff, yoff), 0, 1, 15, 20)
      let x = n * cos(i) / 2.8
      let y = n * sin(i) / 1.5

      vertex(x, y - 20)

    }
    endShape()

  }
  pop()

  //pattern
  let p = 10
  for (let i = 0; i < p; i++) {
    //noStroke();
    let x1 = random(20, 150);
    let y1 = random(-35, -10);
    fill(240, 150, 150)
    circle(x1, y1, random(2, 10))

    let x2 = random(20, 150);
    let y2 = random(5, 10);
    fill(0)
    circle(x2, y2, random(2, 8))
  }

  //downfrontfin
  //stroke(0)

  push()
  translate(40, -5)
  rotate(-160)
  beginShape()
  for (let i = 0; i < 360; i += space) {
    fill(240, 190, 150)

    let yoff = map(cos(i), -1, 1, 0, 1);
    let xoff = map(sin(i), -1, 1, 0, 5);
    let n = map(noise(xoff, yoff), 0, 1, 15, 30)
    let x = n * cos(i) / 1.1
    let y = n * sin(i) / 2

    vertex(x, y - 20)

    a += 0.002
  }
  endShape()
  pop()

  bi += 0.001
}
let fish;

function draw() {
  background(255)
  translate(80, height / 2)
  drawFish()

  //Loop()
}
