let vehicles = [];
let font;
let pointDensitySlider, speedSlider, colorSlider, sizeSlider;
let inputText = "TUAN LINH DAO";
let sampleFactor = 0.1;

function preload() {
  font = loadFont('RobotoCondensed-Italic-VariableFont_wght.ttf'); 
}

function setup() {
  createCanvas(1500, 1000);

  pointDensitySlider = createSlider(0.05, 1, sampleFactor, 0.01);
  speedSlider = createSlider(1, 20, 5);
  colorSlider = createSlider(0, 255, 127);
  sizeSlider = createSlider(1, 10, 4);

  pointDensitySlider.position(20, 10);
  speedSlider.position(20, 40);
  colorSlider.position(20, 70);
  sizeSlider.position(20, 100);

  setupVehiclesForText(inputText);
}

function setupVehiclesForText(str) {
  let points = font.textToPoints(str, width / 6, height / 3, 120, {
    sampleFactor: sampleFactor
  });

  originalPoints = points.map(p => createVector(p.x, p.y));

  vehicles = [];
  points.forEach((point) => {
    let randomColor = color(random(255), random(255), random(255));
    let maxSpeed = speedSlider.value();
    vehicles.push(new Vehicle(point.x, point.y, randomColor, maxSpeed));
  });
}

function draw() {
/*   let bgColor = color((frameCount % 255), (frameCount * 2) % 255, (frameCount * 3) % 255);
  background(bgColor); */
  background(200);

  fill(0); 
  textSize(16); 
  noStroke(); 

  text("Speed", 160, 25);
  text("Point Density", 160, 55);
  text("Color", 160, 85);
  text("Point Size", 160, 115);

  let newDensity = pointDensitySlider.value();
  if (newDensity !== sampleFactor) {
    sampleFactor = newDensity;
    setupVehiclesForText(inputText);
  }

  let maxSpeed = speedSlider.value();
  let colorValue = colorSlider.value();
  let pointSize = sizeSlider.value();

  let textWidth = font.textBounds(inputText, width / 4, height / 2, 128).width;
  let textHeight = 128; 

  for (let vehicle of vehicles) {
    vehicle.maxSpeed = maxSpeed;
    //vehicle.color = color(colorValue, colorValue, 255 - colorValue); 
    vehicle.color = color(random(colorValue), random(colorValue), 255 - colorValue);
    vehicle.size = pointSize;
    vehicle.update();
    vehicle.behaviors();
    vehicle.show();
  }
}


function keyPressed() {
  if (key === 'd') {
    let newText = prompt("Entrer votre nouveau texte:");
    if (newText) {
      inputText = newText.toUpperCase();
      setupVehiclesForText(newText);
    }
  }
}


/* function mousePressed() {
  shuffle(vehicles, true);
  for (let vehicle of vehicles) {
    let randomTarget = createVector(random(width), random(height));
    vehicle.target = randomTarget;
  }
} */


/// Version 2 ///
/* let vehicles = [];
let font;
let pointDensitySlider, speedSlider, colorSlider, sizeSlider;
let inputText = "TUAN LINH DAO";
let sampleFactor = 0.1;

function preload() {
  font = loadFont('RobotoCondensed-Italic-VariableFont_wght.ttf'); 
}

  function setup() {
    createCanvas(2000, 2000);

    // Sliders
    pointDensitySlider = createSlider(0.05, 0.2, sampleFactor, 0.01);
    speedSlider = createSlider(0, 10, 5);
    colorSlider = createSlider(0, 255, 127);
    sizeSlider = createSlider(0, 100, 50);

    pointDensitySlider.position(20, 10);
    speedSlider.position(20, 40);
    colorSlider.position(20, 70);
    sizeSlider.position(20, 100);

  
    setupVehiclesForText(inputText);
  }

function setupVehiclesForText(str) {
  let points = font.textToPoints(str, 200 , 300, 128, {
    sampleFactor: sampleFactor
  });

  vehicles = []; 
  points.forEach((point) => {
    let randomColor = color(random(255), random(255), random(255));
    let maxSpeed = speedSlider.value();
    vehicles.push(new Vehicle(point.x, point.y, randomColor, maxSpeed));
  });
}

function draw() {
  background(200);

  fill(165);
  text("Speed", 160, 20);
  text("Point Density", 160, 54);
  text("Color", 160, 85);
  text("Size", 160, 115);

  let newDensity = pointDensitySlider.value();
  if (newDensity !== sampleFactor) {
    sampleFactor = newDensity;
    setupVehiclesForText(inputText);
  }
  let colorValue = colorSlider.value();
  let maxSpeed = speedSlider.value();
  let pointSize = sizeSlider.value();

  for (let vehicle of vehicles) {
    vehicle.maxSpeed = maxSpeed;
    vehicle.color = color(random(colorValue), random(colorValue), 255 - colorValue);
    vehicle.size = pointSize; 
    vehicle.update();
    vehicle.behaviors();
    vehicle.show();
  }
}

function keyPressed() {
  if (keyCode === "d") {
    let newText = prompt("Enter new text:");
    if (newText) {
      inputText = newText.toUpperCase();
      setupVehiclesForText(inputText);
    }
  }
} */

/// Version 1 ////
/* function draw() {
  background(0);
  for (let vehicle of vehicles) {
    vehicle.behaviors();
    vehicle.update();
    vehicle.show();
  }
} */

/* const nbVehicles = 10;
let vehicles = [];
let targets = [];  
let movingTarget;
let targetVelocities = [];
let targetsMoving = false;

function setup() {
  createCanvas(800, 800);

  createVehicles(nbVehicles);

  movingTarget = createVector(random(width), random(height));

  setInterval(changeTargetDirection, 1000);

  for (let i = 0; i < 20; i++) {
    vehicles.push(new Vehicle(random(width), random(height)));
  }

  // "M" Shape
  targets.push(createVector(100, 100));  
  targets.push(createVector(100, 140));
  targets.push(createVector(100, 180));
  targets.push(createVector(120, 160));  
  targets.push(createVector(140, 140));
  targets.push(createVector(140, 180));  

  // "B" Shape
  targets.push(createVector(200, 100));  
  targets.push(createVector(200, 140));
  targets.push(createVector(200, 180));
  targets.push(createVector(220, 100));  
  targets.push(createVector(240, 120));
  targets.push(createVector(220, 140));  
  targets.push(createVector(220, 160));  
  targets.push(createVector(240, 180));
  targets.push(createVector(220, 180));

  //20 targets
  let cols = 5;
  let rows = 4;
  let spacing = width / (cols + 1);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let target = createVector((j + 1) * spacing, (i + 1) * spacing);
      targets.push(target);
    }
  }
}

function changeTargetDirection() {
  movingTarget = createVector(random(width), random(height));
}

function createVehicles(nbVehicles) {
  for (let i = 0; i < nbVehicles; i++) {
    let x = random(width);
    let y = random(height);
    vehicles.push(new Vehicle(x, y));
  }
}

function draw() {
  background(0);

  if (allVehiclesArrived() && !targetsMoving) {
    setTimeout(moveTargetsRandomly, 2000);
    targetsMoving = true;
  }

  // Cible qui suit la souris, cercle rouge de rayon 32
  let target = createVector(mouseX, mouseY);
  fill(255, 0, 0);
  noStroke();
  ellipse(target.x, target.y, 32);

  let steering = vehicles[0].seek(target);
  vehicles[0].applyForce(steering);

  let vTargets = createVFormation(vehicles[0]);

  // Each following vehicle arrives at the vehicle in front of it
  for (let i = 1; i < vehicles.length; i++) {
    let targetPos = vehicles[i - 1].pos;
    let steering = vehicles[i].arrive(targetPos, 50);
    vehicles[i].applyForce(steering);
  }

  for (let i = 0; i < targets.length; i++) {
    targets[i].add(targetVelocities[i]);  // Move target

    // Wrap around the edges of the screen
    if (targets[i].x > width) targets[i].x = 0;
    if (targets[i].x < 0) targets[i].x = width;
    if (targets[i].y > height) targets[i].y = 0;
    if (targets[i].y < 0) targets[i].y = height;
  }

  vehicles.forEach((vehicle) => {
    vehicle.update();
    vehicle.show();
  });

  for (let target of vTargets) {
    fill(0, 255, 0);
    ellipse(target.x, target.y, 10);
  }

  if (targetsMoving) {
    for (let i = 0; i < targets.length; i++) {
      targets[i].add(targetVelocities[i]);
    }
  }
}

function keyPressed() {
  if (key === 'd') {
    Vehicle.debug = !Vehicle.debug;
  }
}

function createVFormation(vehicle) {
  let vTargets = [];
  let offset = 50;

  for (let i = -2; i <= 2; i++) {
    let targetPos = createVector(vehicle.pos.x + i * offset, vehicle.pos.y + abs(i) * offset);
    vTargets.push(targetPos);
  }

  return vTargets;
}

function allVehiclesArrived() {
  for (let i = 0; i < vehicles.length; i++) {
    let distance = p5.Vector.dist(vehicles[i].pos, targets[i]);
    if (distance > 50) {
      return false;
    }
  }
  return true;
}

function moveTargetsRandomly() {
  for (let i = 0; i < targets.length; i++) {
    let velocity = p5.Vector.random2D();
    velocity.mult(random(2, 5));
    targetVelocities.push(velocity);
  }
}
 */