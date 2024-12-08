let pursuer1, pursuer2;
let target;
let targets = [];
let obstacles = [];
let vehicules = [];
let vehicles = [];
// let score = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pursuer1 = new Vehicle(100, 100);
  pursuer2 = new Vehicle(random(width), random(height));

  vehicules.push(pursuer1);
  vehicules.push(pursuer2);

  // On cree un obstace au milieu de l'écran
  // un cercle de rayon 100px
  // TODO
}

function draw() {
  // changer le dernier param (< 100) pour effets de trainée
  background(0, 0, 0, 100);

  target = createVector(mouseX, mouseY);

  // Dessin de la cible qui suit la souris
  // Dessine un cercle de rayon 32px à la position de la souris
  fill(255, 0, 0);
  noStroke();
  circle(target.x, target.y, 32);

  // dessin des obstacles
  // TODO
  obstacles.forEach(o => {
    o.show();
  })

  vehicules.forEach(v => {
    // pursuer = le véhicule poursuiveur, il vise un point devant la cible
    // déplacement et dessin du véhicule et de la target
    v.update();
    v.show();
    v.applyBehaviors(createVector(mouseX, mouseY), obstacles);
    targets = targets.filter(target => {
        if (v.pos.dist(target.pos) < target.r + v.r) {
            //score++;
            return false;
        }
        return true;
    });
});

  fill(255);
  textSize(32);
  // text(`Score: ${score}`, 10, 30);

  obstacles = obstacles.filter(o => !o.shouldRemove(pursuer1));
}

function mousePressed() {
  let target = new Target(mouseX, mouseY);
  targets.push(target);
  // TODO : ajouter un obstacle de taille aléatoire à la position de la souris

  let size = random(10, 50);
  let obstacle = new Obstacle(mouseX, mouseY, size);
  obstacles.push(obstacle);
}

function keyPressed() {
  if (key == "v") {
    vehicules.push(new Vehicle(random(width), random(height)));
  }
  if (key == "d") {
    Vehicle.debug = !Vehicle.debug;
  }
}