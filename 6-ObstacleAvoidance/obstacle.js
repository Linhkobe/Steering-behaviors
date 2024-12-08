class Obstacle {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;
    this.color = color(0, 255, 0);
  }

  shouldRemove(vehicle) {
    let distance = this.pos.dist(vehicle.pos);
    return distance < 500;
  }

  show() {
    fill(this.color);
    stroke(0);
    strokeWeight(3);
    circle(this.pos.x, this.pos.y, this.r * 2);
/*     push();
    fill(this.color);
    stroke(0)
    strokeWeight(3);
    ellipse(this.pos.x, this.pos.y, this.r * 2);
    fill(0);
    ellipse(this.pos.x, this.pos.y, 10);
    pop(); */
  }
}