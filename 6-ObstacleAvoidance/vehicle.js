/*
  Calcule la projection orthogonale du point a sur le vecteur b
  a et b sont des vecteurs calculés comme ceci :
  let v1 = p5.Vector.sub(a, pos); soit v1 = pos -> a
  let v2 = p5.Vector.sub(b, pos); soit v2 = pos -> b
  */
function findProjection(pos, a, b) {
  let v1 = p5.Vector.sub(a, pos);
  let v2 = p5.Vector.sub(b, pos);
  v2.normalize();
  let sp = v1.dot(v2);
  v2.mult(sp);
  v2.add(pos);
  return v2;
}

class Vehicle {
  static debug = false;

  constructor(x, y) {
    // position du véhicule
    this.pos = createVector(x, y);
    // vitesse du véhicule
    this.vel = createVector(0, 0);
    // accélération du véhicule
    this.acc = createVector(0, 0);
    // vitesse maximale du véhicule
    this.maxSpeed = 6;
    // force maximale appliquée au véhicule
    this.maxForce = 0.9;
    this.color = "white";
    // à peu près en secondes
    this.dureeDeVie = 5;

    this.r_pourDessin = 8;
    // rayon du véhicule pour l'évitement
    this.r = this.r_pourDessin * 3;

    // Pour évitement d'obstacle
    this.largeurZoneEvitementDevantVaisseau = this.r / 2;

    // chemin derrière vaisseaux
    this.path = [];
    this.pathMaxLength = 30;
  }

  avoidAmeliore(obstacles) {
    let ahead = this.vel.copy().setMag(50).add(this.pos);
    let ahead2 = this.vel.copy().setMag(25).add(this.pos);

    stroke(255, 0, 0);
    line(this.pos.x, this.pos.y, ahead.x, ahead.y);
    stroke(255, 255, 0);
    line(this.pos.x, this.pos.y, ahead2.x, ahead2.y);

    for (let obstacle of obstacles) {
        let d1 = ahead.dist(obstacle.pos);
        let d2 = ahead2.dist(obstacle.pos);

        if (d1 < obstacle.r + this.r) {
            let force = p5.Vector.sub(ahead, obstacle.pos);
            force.setMag(this.maxSpeed);
            force.sub(this.vel);
            force.limit(this.maxForce);
            return force;
        }

        if (d2 < obstacle.r + this.r) {
            let force = p5.Vector.sub(ahead2, obstacle.pos);
            force.setMag(this.maxSpeed);
            force.sub(this.vel);
            force.limit(this.maxForce);
            return force;
        }
    }
    return createVector(0, 0);
}

  // on fait une méthode applyBehaviors qui applique les comportements
  // seek et avoid
  applyBehaviors(target, obstacles) {

    let seekForce = this.arrive(target);
    //let avoidForce = this.avoid(obstacles);
    let avoidForce = this.avoidAmeliore(obstacles);
    // let avoidForce = this.avoid(vehicules, obstacles);
    seekForce.mult(1.0);
    avoidForce.mult(1.5);

    this.applyForce(seekForce);
    this.applyForce(avoidForce);
  }

  avoid(vehicles, obstacles) {
    let force = createVector(0,0);
    for (let obstacle of obstacles) {
      let distance = this.pos.dist(obstacle.pos);
      if (distance < this.r + obstacle.r) {
          let repelForce = p5.Vector.sub(this.pos, obstacle.pos);
          repelForce.setMag(this.maxSpeed);
          force.add(repelForce);
      }
    }

    for (let vehicle of vehicles) {
      if (vehicle !== this) {
          let distance = this.pos.dist(vehicle.pos);
          if (distance < this.r + vehicle.r) {
              let repelForce = p5.Vector.sub(this.pos, vehicle.pos);
              repelForce.setMag(this.maxSpeed);
              force.add(repelForce);
          }
      }
  }

  force.limit(this.maxForce);
  return force;
}



  
  getObstacleLePlusProche(obstacles) {
    let plusPetiteDistance = 100000000;
    let obstacleLePlusProche=undefined;

    obstacles.forEach(o => {
      // Je calcule la distance entre le vaisseau et l'obstacle
      const distance = this.pos.dist(o.pos);
      if (distance < plusPetiteDistance) {
        plusPetiteDistance = distance;
        obstacleLePlusProche = o;
      }
    });

    return obstacleLePlusProche;
  }

  getVehiculeLePlusProche(vehicules) {
    let plusPetiteDistance = Infinity;
    let vehiculeLePlusProche;

    vehicules.forEach(v => {
      if (v != this) {
        // Je calcule la distance entre le vaisseau et le vehicule
        const distance = this.pos.dist(v.pos);
        if (distance < plusPetiteDistance) {
          plusPetiteDistance = distance;
          vehiculeLePlusProche = v;
        }
      }
    });

    return vehiculeLePlusProche;
  }


  getClosestObstacle(pos, obstacles) {
    // on parcourt les obstacles et on renvoie celui qui est le plus près du véhicule
    let closestObstacle = null;
    let closestDistance = 1000000000;
    for (let obstacle of obstacles) {
      let distance = pos.dist(obstacle.pos);
      if (closestObstacle == null || distance < closestDistance) {
        closestObstacle = obstacle;
        closestDistance = distance;
      }
    }
    return closestObstacle;
  }

  arrive(target) {
    let force = p5.Vector.sub(target, this.pos);
    let desiredSpeed = this.maxSpeed;
    let slowRadius = 100;
    let distance = force.mag();
    if (distance < slowRadius) {
      desiredSpeed = map(distance, 0, slowRadius, 0, this.maxSpeed);
    }

    force.setMag(desiredSpeed);
    force.sub(this.vel);
    force.limit(this.maxForce);
    return force;
    // 2nd argument true enables the arrival behavior
    //return this.seek(target, true);
  }

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

  wander() {
    let wanderRadius = 25;
    let wanderDistance = 50;

    
    let target = this.vel.copy();
    target.setMag(wanderDistance);
    target.add(this.pos);

  
    let circleOffset = this.vel.copy();
    circleOffset.setMag(wanderRadius);
    let circleCenter = target.copy().add(circleOffset);

  
    let angle = random(TWO_PI);
    let offset = createVector(cos(angle), sin(angle)).mult(wanderRadius);
    let steering = p5.Vector.sub(circleCenter.add(offset), this.pos);

    steering.limit(this.maxForce);
    return steering;
}

  // inverse de seek !
  flee(target) {
    return this.seek(target).mult(-1);
  }

  /* Poursuite d'un point devant la target !
     cette methode renvoie la force à appliquer au véhicule
  */
  pursue(vehicle) {
    let target = vehicle.pos.copy();
    let prediction = vehicle.vel.copy();
    prediction.mult(10);
    target.add(prediction);
    fill(0, 255, 0);
    circle(target.x, target.y, 16);
    return this.seek(target);
  }

  evade(vehicle) {
    let pursuit = this.pursue(vehicle);
    pursuit.mult(-1);
    return pursuit;
  }

  // applyForce est une méthode qui permet d'appliquer une force au véhicule
  // en fait on additionne le vecteurr force au vecteur accélération
  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    let wanderForce = this.wander();
    this.applyForce(wanderForce);
    // on ajoute l'accélération à la vitesse. L'accélération est un incrément de vitesse
    // (accélératiion = dérivée de la vitesse)
    this.vel.add(this.acc);
    // on contraint la vitesse à la valeur maxSpeed
    this.vel.limit(this.maxSpeed);
    // on ajoute la vitesse à la position. La vitesse est un incrément de position, 
    // (la vitesse est la dérivée de la position)
    this.pos.add(this.vel);

    this.edges();

    // on remet l'accélération à zéro
    this.acc.set(0, 0);

    // mise à jour du path (la trainée derrière)
    this.ajoutePosAuPath();

    // durée de vie
    this.dureeDeVie -= 0.01;
  }

  ajoutePosAuPath() {
    // on rajoute la position courante dans le tableau
    this.path.push(this.pos.copy());

    // si le tableau a plus de 50 éléments, on vire le plus ancien
    if (this.path.length > this.pathMaxLength) {
      this.path.shift();
    }
  }

  // On dessine le véhicule, le chemin etc.
  show() {
    // dessin du chemin
    this.drawPath();
    // dessin du vehicule
    this.drawVehicle();
  }

  drawVehicle() {
    // formes fil de fer en blanc
    stroke(255);
    // épaisseur du trait = 2
    strokeWeight(2);

    // formes pleines
    fill(this.color);

    // sauvegarde du contexte graphique (couleur pleine, fil de fer, épaisseur du trait, 
    // position et rotation du repère de référence)
    push();
    // on déplace le repère de référence.
    translate(this.pos.x, this.pos.y);
    // et on le tourne. heading() renvoie l'angle du vecteur vitesse (c'est l'angle du véhicule)
    rotate(this.vel.heading());

    // Dessin d'un véhicule sous la forme d'un triangle. Comme s'il était droit, avec le 0, 0 en haut à gauche
    triangle(-this.r_pourDessin, -this.r_pourDessin / 2, -this.r_pourDessin, this.r_pourDessin / 2, this.r_pourDessin, 0);
    // Que fait cette ligne ?
    //this.edges();

    // draw velocity vector
    pop();
    noFill();
    stroke(255, 150);
    strokeWeight(1);
    circle(this.pos.x, this.pos.y, this.r * 2);
  }

  drawPath() {
    push();
    stroke(255);
    noFill();
    strokeWeight(1);

    fill(this.color);
    // dessin du chemin
    this.path.forEach((p, index) => {
      if (!(index % 5)) {
       
        circle(p.x, p.y, 1);
      }
    });
    pop();
  }
  drawVector(pos, v, color) {
    push();
    // Dessin du vecteur vitesse
    // Il part du centre du véhicule et va dans la direction du vecteur vitesse
    strokeWeight(3);
    stroke(color);
    line(pos.x, pos.y, pos.x + v.x, pos.y + v.y);
    // dessine une petite fleche au bout du vecteur vitesse
    let arrowSize = 5;
    translate(pos.x + v.x, pos.y + v.y);
    rotate(v.heading());
    translate(-arrowSize / 2, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
  }

  // que fait cette méthode ?
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
}

class Target extends Vehicle {
  constructor(x, y) {
    super(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(5);
  }

  show() {
    push();
    stroke(255);
    strokeWeight(2);
    fill("#F063A4");
    push();
    translate(this.pos.x, this.pos.y);
    circle(0, 0, this.r * 2);
    pop();
    pop();
  }
}