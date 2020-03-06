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

  ctx.fillStyle = 'red';
  //fillCanvas(simpleDistribution(21, 16).map(v => { return {x: v.x * 40, y: v.y * 40}}));

  ctx.fillStyle = 'gray';
  fillCanvas((new EvenDistribution()).get(21, 4, 16).map(v => { return {x: v.x * 40, y: v.y * 40}}));
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

class EvenDistribution{
  get(amount, clusterSize, sideLength) {
    const _out = [];
    const clusters = this.generateClusters(clusterSize, sideLength);

    const powClusterSize = Math.pow(clusterSize, 2);

    let modulo = amount % powClusterSize;
    const avgAmount = Math.floor(amount / powClusterSize);

    clusters.unorderedForEach(cluster => {
      let currAmount = avgAmount;
      if (modulo > 0) {
        currAmount++;
        modulo--;
      }
      for (let i = 0; i < currAmount; i++) {
        _out.push({
          x: Math.floor(Math.random() * clusterSize) + cluster.x,
          y: Math.floor(Math.random() * clusterSize) + cluster.y
        });
      } 
    });

    return _out;
  }

  generateClusters(clusterSize, sideLength) {
    const _out = [];
    for (let i = 0; i < sideLength; i += clusterSize) {
      for (let j = 0; j < sideLength; j += clusterSize) {
        _out.push({
          x: i,
          y: j, 
        });
      }
    }
    return _out;
  }
}

Array.prototype.unorderedForEach = function(func) {
  const _copy = [...this];
  _copy.sort(v => (Math.random() > 0.5) ? 1 : -1);
  _copy.forEach(el => func(el));
}
