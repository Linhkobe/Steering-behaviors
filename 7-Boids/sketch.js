// Flocking
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/124-flocking-boids.html
// https://youtu.be/mhjuuHl6qHM

const flock = [];

let alignSlider, cohesionSlider, separationSlider;
let target;
let obstacles = [];

function setup() {
  createCanvas(1000, 800);
  alignSlider = createSlider(0, 2, 1.5, 0.1);
  cohesionSlider = createSlider(0, 2, 1, 0.1);
  separationSlider = createSlider(0, 2, 2, 0.1);
  for (let i = 0; i < 200; i++) {
    flock.push(new Boid());
  }

}

function draw() {
  background(0);
  for (let obstacle of obstacles) {
    obstacle.show();
    for (let boid of flock) {
      obstacle.applyRepulsion(boid);
    }
  }
  const target = createVector(mouseX, mouseY);
  fill(255, 0, 0, 100);
  noStroke();
  ellipse(target.x, target.y, 50, 50);
  for (let boid of flock) {
    boid.edges();
    boid.flock(flock);
    boid.applyRepulsion(target);
    boid.update();
    boid.show();
  }  
}

function keyPressed() {
  if (key == 'o') {
    obstacles.push(new Obstacle(mouseX, mouseY, random(10, 50)));
  }
}