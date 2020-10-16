const url = document.URL;

const socket = require('socket.io-client')(url);
const Balloon = require('./Balloon');

/**
 * 
 * @param {import('p5')} p5 
 */
function sketch(p5) {
  let me;
  let players = [];
  let lost = false;

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    const name = window.prompt('Inserisci il tuo nome');
    me = new Balloon(p5, p5.random(-800, 800), p5.random(-800, 800), p5.random(100, 200), name);
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
    if (player.id === socket.id) return;
    p5.fill(255, 0, 0);
    p5.ellipse(player.x, player.y, player.r);
    p5.textAlign(p5.CENTER);
    p5.fill(0);
    p5.text(player.name, player.x, player.y + 10);
  }

  p5.draw = () => {
    p5.background(0);
    p5.line(0, 0, 200, 0);
    p5.translate(p5.width / 2, p5.height / 2);
    p5.translate(-me.pos.x, -me.pos.y);
    me.show();
    me.update();

    p5.stroke(0, 255, 255);
    p5.strokeWeight(4);
    p5.line(-1000, -1000, 1000, -1000);
    p5.line(1000, -1000, 1000, 1000);
    p5.line(1000, 1000, -1000, 1000);
    p5.line(-1000, 1000, -1000, -1000);
    p5.stroke(0);
    p5.strokeWeight(1);

    players.forEach(p => {
      drawEnemie(p);
      const contact = me.contact(p);
      if (contact === 1) {
        socket.emit('eaten', p.id);
      } else if (contact === -1) {
        alert('Sei stato mangiato!');
        lost = true;
        p5.noLoop();
      }
    });
    if (!lost) {
      socket.emit('clientupdate', {
        x: me.pos.x,
        y: me.pos.y,
        r: me.r
      });
    }
  };
}

module.exports = sketch;