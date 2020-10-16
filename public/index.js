const p5 = require('p5');
const sketch = require('./game/sketch');

// eslint-disable-next-line no-unused-vars
const game = new p5(sketch, document.getElementById('game'));