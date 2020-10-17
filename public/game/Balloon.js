const { Vector } = require('p5');

class Balloon {
  /**
   * @param {import('p5')} p5 
   * @param {number} x 
   * @param {number} y 
   * @param {number} r 
   * @param {string} name
   */
  constructor(p5, x, y, r, name) {
    this.p5 = p5;
    this.pos = this.p5.createVector(x, y);
    this.r = r;
    this.v = p5.createVector(0, 0);
    this.name = name;
  }

  update() {
    const { p5, r } = this;
    const mouse = p5.createVector(p5.mouseX - p5.windowWidth / 2, p5.mouseY - p5.windowHeight / 2);
    mouse.setMag(384 / r);
    this.v.lerp(mouse, 0.2);
    this.pos.add(this.v);
    this.pos.x = p5.constrain(this.pos.x, -1000 + r / 2, 1000 - r / 2);
    this.pos.y = p5.constrain(this.pos.y, -1000 + r / 2, 1000 - r / 2);
  }

  show() {
    const { p5, pos, r, name } = this;
    p5.fill(255);
    p5.ellipse(pos.x, pos.y, r);
    p5.fill(0);
    p5.textAlign(p5.CENTER);
    p5.textSize(32);
    p5.text(name, pos.x, pos.y + 10);
  }

  contact(entity) {
    const { p5, pos, r } = this;
    const entityPos = p5.createVector(entity.x, entity.y);
    const dist = Vector.dist(pos, entityPos);
    if (dist < r / 2 + entity.r / 2) {
      if (r > entity.r) {
        const area = p5.PI * Math.pow(r / 2, 2) + p5.PI * Math.pow(entity.r / 2, 2);
        this.r = Math.sqrt(area / p5.PI) * 2;
        return 1;
      } else if (r < entity.r) {
        console.log('sei stato mangiato');
        return -1;
      }
    }
    return 0;
  }
}

module.exports = Balloon;