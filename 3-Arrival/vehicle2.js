class Vehicle {
  constructor(x, y, color = [255, 255, 255], maxSpeed = 5) {
    this.pos = createVector(random(width), random(height));
    this.target = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.color = color;
    this.maxSpeed = maxSpeed;
    this.maxForce = 0.3;
    this.rayonZoneDeFreinage = 100;
    this.size = 4;
    this.history = []; 
    this.historySize = 50;
  }

  behaviors() {
  const flockingWeight = 0.2; 
  const targetWeight = 0.8; 

  let arrive = this.arrive(this.target.copy()); 
  arrive.mult(targetWeight); 

  let alignment = this.align();
  let cohesion = this.cohere();
  let separation = this.separate();

  alignment.mult(flockingWeight);
  cohesion.mult(flockingWeight);
  separation.mult(flockingWeight);

  this.applyForce(arrive);
  this.applyForce(alignment);
  this.applyForce(cohesion);
  this.applyForce(separation);
/*     this.target.x += random(-0.5, 0.5);
    this.target.y += random(-0.5, 0.5);
    let arrive = this.arrive(this.target);
    this.applyForce(arrive); */
  }

  align() {
    let perceptionRadius = 50;
    let steering = createVector();
    let total = 0;
    
    for (let other of vehicles) {
      let d = p5.Vector.dist(this.pos, other.pos);
      if (other != this && d < perceptionRadius) {
        steering.add(other.vel);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.vel);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  cohere() {
    let perceptionRadius = 50;
    let steering = createVector();
    let total = 0;

    for (let other of vehicles) {
      let d = p5.Vector.dist(this.pos, other.pos);
      if (other != this && d < perceptionRadius) {
        steering.add(other.pos);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      return this.arrive(steering);
    }
    return createVector(0, 0);
  }

  separate() {
    let perceptionRadius = 50;
    let steering = createVector();
    let total = 0;

    for (let other of vehicles) {
      let d = p5.Vector.dist(this.pos, other.pos);
      if (other != this && d < perceptionRadius) {
        let diff = p5.Vector.sub(this.pos, other.pos);
        diff.div(d * d); 
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.vel);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  arrive(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();
    let speed = this.maxSpeed;
    if (d < this.rayonZoneDeFreinage) speed = map(d, 0, this.rayonZoneDeFreinage, 0, this.maxSpeed);
    desired.setMag(speed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  

    this.history.push(this.pos.copy());
    if (this.history.length > this.historySize) {
      this.history.shift(); 
    }
  }

  show() {

    
    stroke(this.color);
    strokeWeight(this.size);
    point(this.pos.x, this.pos.y);
  }
}



/// Version 1 ///
/* class Vehicle {
    constructor(x, y, color = [random(255), random(255), random(255)], maxSpeed = 5) {
      this.pos = createVector(random(width), random(height));
      this.target = createVector(x, y);
      this.vel = createVector();
      this.acc = createVector();
      this.color = color;
      this.maxSpeed = 5;
      this.maxForce = 0.3;
      this.rayonZoneDeFreinage = 100;
      this.size = 10;
    }
  
    behaviors() {
      this.target.x += random(-2, 2);
      this.target.y += random(-2, 2);
      let arrive = this.arrive(this.target);
      this.applyForce(arrive);
    }
  
    arrive(target) {
      let desired = p5.Vector.sub(target, this.pos);
      let d = desired.mag();
      let speed = this.maxSpeed;
      if (d < this.rayonZoneDeFreinage) speed = map(d, 0, this.rayonZoneDeFreinage, 0, this.maxSpeed);
      desired.setMag(speed);
      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxForce);
      return steer;
    }
  
    applyForce(force) {
      this.acc.add(force);
    }
  
    update() {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0); 
    }
  
    show() {
      stroke(this.color);
      strokeWeight(this.size);
      point(this.pos.x, this.pos.y);
      //push();
      //translate(this.pos.x, this.pos.y);
      //rotate(this.vel.heading());
      //ellipse(0,0, this.rayonZoneDeFreinage);
    }
  } */
  