// Path Following (Path Following)
// The Nature of Code
// The Coding Train / Daniel Shiffman
// https://youtu.be/LrnR6dc2IfM
// https://thecodingtrain.com/learning/nature-of-code/5.7-path-following.html

// Path Following: https://editor.p5js.org/codingtrain/sketches/dqM054vBV
// Complex Path: https://editor.p5js.org/codingtrain/sketches/2FFzvxwVt

//let vehicle;
let vehicles = [];
let path;
let speedSlider, radiusSlider;
let separationWeightSlider, alignmentWeightSlider;

function setup() {
  createCanvas(1600, 900);

  // sliders
  createP('Vitesse du Véhicule').position(20, 0);
  speedSlider = createSlider(1, 20, 6);
  speedSlider.position(20, 30);
  speedSlider.style('width', '200px');

  createP('Rayon du Chemin').position(20, 60);
  radiusSlider = createSlider(10, 100, 20);
  radiusSlider.position(20, 90);
  radiusSlider.style('width', '200px');

  createP('Poids de Séparation').position(20, 120);
  separationWeightSlider = createSlider(0, 5, 1, 0.1);
  separationWeightSlider.position(20, 150);
  separationWeightSlider.style('width', '200px');

  createP('Poids d\'Alignement').position(20, 180);
  alignmentWeightSlider = createSlider(0, 5, 1, 0.1);
  alignmentWeightSlider.position(20, 210);
  alignmentWeightSlider.style('width', '200px');

  let initialVehicle = new Vehicle(100, 100);
  vehicles.push(initialVehicle);
  //vehicle = new Vehicle(100, 100);
  // vehicle.vel.x = 2;
  // path = new Path(0, height / 2, width, height / 2);
  const pathPoints = [
    createVector(200, height / 2 - 100),
    createVector(400, height / 2 - 50),
    createVector(600, height / 2 + 50),
    createVector(800, height / 2 - 100),
    createVector(1000, height / 2 + 50),
    createVector(1200, height / 2 - 50),
    createVector(1400, height / 2),
    createVector(1600, height / 2 + 100),
    createVector(200, height / 2 - 100) 
  ];
  
  path = new Path(pathPoints);

  // Ajouter les véhicules avec le comportement wander
    for (let i = 0; i < 5; i++) {
      let wanderVehicle = new Vehicle(random(width), random(height), color(0, 255, 0)); // Green vehicles
      vehicles.push(wanderVehicle);
    }
}

function draw() {
  background(200);

  path.radius = radiusSlider.value();

  //vehicle.maxSpeed = speedSlider.value();

  // path.end.y = mouseY;

  for (let vehicle of vehicles) {
    vehicle.maxSpeed = speedSlider.value();
    vehicle.separationWeight = separationWeightSlider.value(); 
    vehicle.alignmentWeight = alignmentWeightSlider.value(); 
    vehicle.applyForce(vehicle.follow(path));
    vehicle.edges();
    vehicle.wander();
    vehicle.update();
    vehicle.show();
  }

/*   let force = vehicle.follow(path);
  vehicle.applyForce(force);

  vehicle.edges();
  vehicle.update();
  vehicle.show(); */

  path.show();
}

function mousePressed() {
  let newVehicle = new Vehicle(mouseX, mouseY);
  vehicles.push(newVehicle);
}

// Ajouter un véhicule qui est rapid et en rouge
function keyPressed() {
  if (key === 'R' || key === 'r') { 
    let fastVehicle = new Vehicle(mouseX, mouseY);
    fastVehicle.maxSpeed = 15; 
    fastVehicle.color = color(255, 0, 0); 
    vehicles.push(fastVehicle);
  }
}
