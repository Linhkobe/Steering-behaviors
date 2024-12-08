class Obstacle {
    constructor(x, y, r) {
        this.position = createVector(x, y);
        this.radius = r;
    }

    show() {
        fill(0, 255, 0, 150); 
        noStroke();
        ellipse(this.position.x, this.position.y, this.radius * 2);
    }

    applyRepulsion(boid) {
        let distance = boid.position.dist(this.position);
        if (distance < this.radius + 10) { 
            let force = p5.Vector.sub(boid.position, this.position);
            force.setMag(boid.maxSpeed);
            force.sub(boid.velocity);
            force.limit(boid.maxForce);
            boid.acceleration.add(force);
        }
    }
}