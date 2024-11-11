// Path Following (Path Following)
// The Nature of Code
// The Coding Train / Daniel Shiffman
// https://youtu.be/LrnR6dc2IfM
// https://thecodingtrain.com/learning/nature-of-code/5.7-path-following.html

// Path Following: https://editor.p5js.org/codingtrain/sketches/dqM054vBV
// Complex Path: https://editor.p5js.org/codingtrain/sketches/2FFzvxwVt

// on v1 qui part de pos et va vers a,
// on a v2 qui part pos et va vers b
// renvoie le point b projeté sur v1
/* function findProjection(pos, a, b) {
  let v1 = p5.Vector.sub(a, pos);
  let v2 = p5.Vector.sub(b, pos);
  v2.normalize();
  let sp = v1.dot(v2);
  v2.mult(sp);
  v2.add(pos);
  return v2;
} */
  function findProjection(pos, a, b) {
    let v1 = p5.Vector.sub(b, a); 
    let v2 = p5.Vector.sub(pos, a); 
    let sp = v1.dot(v2) / v1.dot(v1);
    if (sp < 0) return a.copy(); 
    if (sp > 1) return b.copy(); 
    v1.mult(sp);
    return p5.Vector.add(a, v1); 
  }

class Vehicle {
  constructor(x, y, color = [255]) {
    this.pos = createVector(x, y);
    this.prevPos = this.pos.copy();
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 6;
    this.maxForce = 0.1;
    this.r = 16;
    this.color = color;
    this.separationWeight = 1; 
    this.alignmentWeight = 1;

    // Wander
    this.distanceCercle = 150;
    this.wanderRadius = 50;
    this.wanderTheta = PI / 2;
    this.displaceRange = 0.3;
  }

  wander() {
    let noiseValue = noise(this.wanderTheta);
    this.wanderTheta += map(noiseValue, 0, 1, -this.displaceRange, this.displaceRange);

    let wanderPoint = this.vel.copy();
    wanderPoint.setMag(this.distanceCercle);
    wanderPoint.add(this.pos);

    fill(0, 255, 0);
    noStroke();
    circle(wanderPoint.x, wanderPoint.y, 16);

    let theta = this.wanderTheta + this.vel.heading();
    let x = this.wanderRadius * cos(theta);
    let y = this.wanderRadius * sin(theta);

    wanderPoint.add(x, y);

    noFill();
    stroke(255);
    circle(wanderPoint.x, wanderPoint.y, this.wanderRadius * 2);

    stroke(255);
    line(this.pos.x, this.pos.y, wanderPoint.x, wanderPoint.y);

    let steer = p5.Vector.sub(wanderPoint, this.pos);
    steer.setMag(this.maxSpeed);
    this.applyForce(steer);
  }

  follow(path) {
    // Path following algorithm here!!

    // Step 1 calculate future position
    let future = this.vel.copy();
    // dans 20 frames d'animation
    future.mult(20);
    future.add(this.pos);

    fill(0, 0, 255); // Blue color for future
    noStroke();
    circle(future.x, future.y, 16);

    // Touver le point le plus proche sur le chemin
    let closestPoint = null;
    let closestDistance = Infinity;

    for (let i = 0; i < path.points.length - 1; i++) {
      let a = path.points[i];
      let b = path.points[i + 1];
      let target = findProjection(future, a, b); // Project future point onto line segment

      let d = p5.Vector.dist(future, target);
      if (d < closestDistance) {
        closestDistance = d;
        closestPoint = target;
      }
    }

    if (closestPoint) {
      fill(0, 255, 0); // Green color for closest point
      noStroke();
      circle(closestPoint.x, closestPoint.y, 16);
    }

    // If the closest distance is greater than the path radius, seek the closest point
    if (closestDistance > path.radius) {
      return this.seek(closestPoint);
    } else {
      return createVector(0, 0); // No steering force needed
    }
  }
  

    // on le dessine en rouge
    // fill(255, 0, 0);

    // on le dessine en bleu
/*     fill(0, 0, 255);

    noStroke();
    circle(future.x, future.y, 16);

    // Step 2 Is future on path?
    // On calcule la projection perpendiculaire du point "futur" sur le chemin
    let target = findProjection(path.start, future, path.end);

    // on le dessine en vert
    fill(0, 255, 0);
    noStroke();
    circle(target.x, target.y, 16);

    // on regarde si la distance entre le point futur et le point projeté
    // est inférieure à la demi largeur du chemin.
    // Si oui, on efait rien, le vehicule est sur la route,
    // si non on fait seek vers le point projeté, pour rapprocher
    // le véhicule de la route
    let d = p5.Vector.dist(future, target);
    if (d > path.radius) {
      return this.seek(target);
    } else {
      return createVector(0, 0);
    }
  } */

  seek(target, arrival = false) {
    let force = p5.Vector.sub(target, this.pos);
    let desiredSpeed = this.maxSpeed;
    if (arrival) {
      let slowRadius = 100;
      let distance = force.mag();
      if (distance < slowRadius) {
        desiredSpeed = map(distance, 0, slowRadius, 0, this.maxSpeed);
      }
    }
    force.setMag(desiredSpeed);
    force.sub(this.vel);
    force.limit(this.maxForce);
    return force;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.prevPos = this.pos.copy();
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  show() {
    stroke(255);
    strokeWeight(2);
    // fill(255);
    fill(this.color);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
    pop();

    stroke(150);
    strokeWeight(1);
    line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y);
    this.prevPos = this.pos.copy();
  }

  edges() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }

  applyBehaviors() {
    
    let separationForce = this.separate(vehicles); 
    let alignmentForce = this.align(vehicles); 
    
    separationForce.mult(this.separationWeight);
    alignmentForce.mult(this.alignmentWeight);
    
    this.applyForce(separationForce);
    this.applyForce(alignmentForce);
  }

  separate(vehicles) {
    let desiredSeparation = 25; 
    let steer = createVector(0, 0);
    let count = 0;
  
    for (let other of vehicles) {
      let d = p5.Vector.dist(this.pos, other.pos);
      if (d > 0 && d < desiredSeparation) {
        let diff = p5.Vector.sub(this.pos, other.pos);
        diff.normalize();
        diff.div(d); 
        steer.add(diff);
        count++;
      }
    }
  
    if (count > 0) {
      steer.div(count); // Average the steering forces
    }
  
    if (steer.mag() > 0) {
      steer.setMag(this.maxSpeed);
      steer.sub(this.vel);
      steer.limit(this.maxForce);
    }
  
    return steer;
  }

  align(vehicles) {
    let neighborDist = 50; // Distance to search for neighbors
    let sum = createVector(0, 0);
    let count = 0;
  
    for (let other of vehicles) {
      let d = p5.Vector.dist(this.pos, other.pos);
      if (d > 0 && d < neighborDist) {
        sum.add(other.vel); 
        count++;
      }
    }
  
    if (count > 0) {
      sum.div(count);
      sum.setMag(this.maxSpeed);
      let steer = p5.Vector.sub(sum, this.vel);
      steer.limit(this.maxForce);
      return steer;
    }
  
    return createVector(0, 0);
  }
}
