document.addEventListener('DOMContentLoaded', () => {
  let canvas = document.querySelector('canvas');
  canvas.width = 640;
  canvas.height = 640;

  let ctx = canvas.getContext('2d');

  let fillCanvas = (points) => {
    points.forEach(vec => {
      ctx.fillRect(vec.x, vec.y, 40, 40);
    });
  }
  const distribution = evenDistribution(20, 16);

  ctx.fillStyle = 'red';
  fillCanvas(distribution.next().value.map(v => { return {x: v.x * 40, y: v.y * 40}}));

  ctx.fillStyle = 'black';
  fillCanvas(distribution.next().value.map(v => { return {x: v.x * 40, y: v.y * 40}}));
});

function simpleDistribution(amount, sideLength) {
  const _out = [];
  for (let i = 0; i < amount; i++) {
    let o = {};
    do {
      o = {
        x: Math.round(Math.random() * sideLength),
        y: Math.round(Math.random() * sideLength)
      }
    } while(_out.includes(o));
    _out.push(o);
  }
  return _out;
}

function* evenDistribution(amount, sideLength) {
  const iterations = 1;
  const _out = [];
  for (let i = 0; i < amount; i++) {
    let o = {};
    do {
      o = {
        x: Math.floor(Math.random() * sideLength),
        y: Math.floor(Math.random() * sideLength)
      }
    } while(_out.includes(o));
    _out.push(o);
  }
  yield _out;
  for (let j = 0; j < iterations; j++) {
    for (let i = 0; i < amount; i++) {
      const nearest = _out.reduce((prev, curr) => (prev.x + prev.y < curr.x + curr.y) ? prev : curr);
      if (isNear(_out[i], nearest)) {
        const direction = Opposite(getDirectionVector(_out[i], nearest));
        _out[i] = Clamp(Add(_out[i], direction), sideLength);
      }
    }
  }
  yield _out;
}

function getDirectionVector(vec1, vec2) {
  return {
    x: (vec2.x - vec1.x > 0) ? 1 : (vec2.x - vec1.x < 0) ? -1 : 0,
    y: (vec2.y - vec1.y > 0) ? 1 : (vec2.y - vec1.y < 0) ? -1 : 0,
  };
}

function isNear(vec1, vec2) {
  return Math.abs(vec2.x - vec1.x) < 2 && Math.abs(vec2.y - vec1.y) < 2;
}

function Opposite(vec) {
  return {x: -vec.x, y: -vec.y};
}

function Add(vec1, vec2) {
  return {x: vec1.x + vec2.x, y: vec1.y + vec2.y};
}

function Clamp(vec, max) {
  return {
    x: (vec.x < max) ? vec.x : max - 1,
    y: (vec.y < max) ? vec.y : max - 1
  }
}
