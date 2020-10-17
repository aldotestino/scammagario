const url = document.URL;

const socket = require('socket.io-client')(url);
const Balloon = require('./Balloon');

/**
 * 
 * @param {import('p5')} p5 
 */
function sketch(p5) {
  let me;
  const food = [];
  const food_number = 20;
  let players = [];
  const eaten = new Set();

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    const name = window.prompt('Inserisci il tuo nome');
    me = new Balloon(p5, p5.random(-800, 800), p5.random(100, 200), 60, name);
    for (let i = 0; i < food_number; i++) {
      food.push({
        x: p5.random(-900, 900),
        y: p5.random(-900, 900),
        r: 40,
        color: {
          r: p5.random(255),
          g: p5.random(255),
          b: p5.random(255)
        }
      });
    }
    socket.emit('clientstart', {
      name: me.name,
      x: me.pos.x,
      y: me.pos.y,
      r: me.r
    });

    socket.on('gameupdate', updatedPlayers => {
      players = updatedPlayers;
    });
  };

  function drawEnemie(player) {
    p5.fill(255, 0, 0);
    p5.ellipse(player.x, player.y, player.r);
    p5.textAlign(p5.CENTER);
    p5.fill(0);
    p5.text(player.name, player.x, player.y + 10);
  }

  function drawFood(food) {
    p5.fill(food.color.r, food.color.g, food.color.b);
    p5.ellipse(food.x, food.y, food.r);
  }

  function drawBounds() {
    p5.stroke(0, 255, 255);
    p5.strokeWeight(4);
    p5.line(-1000, -1000, 1000, -1000);
    p5.line(1000, -1000, 1000, 1000);
    p5.line(1000, 1000, -1000, 1000);
    p5.line(-1000, 1000, -1000, -1000);
    p5.stroke(0);
    p5.strokeWeight(1);

    p5.stroke(255);
    for (let i = -950; i < 1000; i += 50) {
      p5.line(i, -1000, i, 1000);
      p5.line(-1000, i, 1000, i);
    }
    p5.stroke(0);
  }

  p5.draw = () => {
    p5.background(0);
    p5.line(0, 0, 200, 0);
    p5.translate(p5.width / 2, p5.height / 2);
    p5.translate(-me.pos.x, -me.pos.y);

    drawBounds();

    me.show();
    me.update();

    food.forEach((f, i) => {
      drawFood(f);
      const contact = me.contact(f);
      if (contact === 1) {
        food.splice(i, 1);
      }
    });

    players.forEach((p, i) => {
      if (p.id !== socket.id && !eaten.has(p.id)) {
        drawEnemie(p);
        const contact = me.contact(p);
        if (contact === 1) {
          socket.emit('eat', p.id);
          eaten.add(p.id);
          players.splice(i, 1);
        } else if (contact === -1) {
          alert('Sei stato mangiato!');
          p5.noLoop();
        }
      }
    });
    socket.emit('clientupdate', {
      x: me.pos.x,
      y: me.pos.y,
      r: me.r
    });
  };
}

module.exports = sketch;