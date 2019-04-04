var POPULATION = 400;
var WIDTH = 20, HEIGHT = 20;
var COINFITNESS = 10;
var TOFITNESS = 1, AWAYFITNESS = -1.5;
var canvases = [];
var snakes = [];
var stop = false;
var DELAY = 20;
var generation = 0;
var LEN = 4;

var time = 0;
var prevAverage = 0;
var interval = null;

function Start() {
  document.getElementsByClassName('startButton')[0].style.display = 'none';
  document.getElementsByClassName('stopButton')[0].style.display = 'block';
  document.getElementsByClassName('pauseButton')[0].style.display = 'block';
  document.getElementById('inputPopulation').disabled = true;
  document.getElementById('inputPixel').disabled = true;
  document.getElementById('inputCoinFitness').disabled = true;
  document.getElementById('inputTowardFitness').disabled = true;
  document.getElementById('inputAwayFitness').disabled = true;
  document.getElementById('inputLength').disabled = true;
  document.getElementById('inputDelay').disabled = true;

  POPULATION = parseInt(document.getElementById('inputPopulation').value);
  WIDTH = HEIGHT = parseInt(document.getElementById('inputPixel').value);
  COINFITNESS = parseInt(document.getElementById('inputCoinFitness').value);
  TOFITNESS = parseInt(document.getElementById('inputTowardFitness').value);
  AWAYFITNESS = parseInt(document.getElementById('inputAwayFitness').value);
  LEN = parseInt(document.getElementById('inputLength').value);
  DELAY = parseInt(document.getElementById('inputDelay').value);
  if (WIDTH < 2) return;
  if (POPULATION < 10) return;

  var table = document.getElementById('evolutionTable');
  table.innerHTML = '';
  canvases = [];
  for (var i = 0; i < POPULATION; i++) {
    var nTd = document.createElement('div');
    nTd.classList += 'evolutionTd';
    var nCanvas = document.createElement('canvas');
    nCanvas.width = 100;
    nCanvas.height = 100;
    nTd.appendChild(nCanvas);
    canvases.push(new Canvas(nCanvas));
    table.appendChild(nTd);
  }

  myChart.data.datasets = [{
    label: '평균',
      data: [ 0 ],
      backgroundColor: [
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [],
      borderWidth: 0
  },
  {
    label: '최저',
    data: [ 0 ],
    backgroundColor: [
      'rgba(75, 192, 192, 0.2)'
    ],
    borderColor: [],
    borderWidth: 0
  },
  {
    label: '최대',
    data: [ 0 ],
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)'
    ],
    borderColor: [],
    borderWidth: 0
  }];
  myChart.data.labels = [ '0' ];
  myChart.update();

  for (var i = 0; i < POPULATION; i++) {
    snakes.push(new Snake());
    DrawEvolution(i);
  }

  stop = false;
  time = 0;
  prevAverage = -Math.pow(2, 32);
  generation = 1;
  interval = setInterval(function () {
    if (!stop) AllEvolution();
    if (oldDelay != DELAY) {
      CustomClearInterval();
    }
  }, DELAY);
}

function Stop() {
  document.getElementsByClassName('startButton')[0].style.display = 'block';
  document.getElementsByClassName('stopButton')[0].style.display = 'none';
  document.getElementsByClassName('pauseButton')[0].style.display = 'none';
  document.getElementById('inputPopulation').disabled = false;
  document.getElementById('inputPixel').disabled = false;
  document.getElementById('inputCoinFitness').disabled = false;
  document.getElementById('inputTowardFitness').disabled = false;
  document.getElementById('inputAwayFitness').disabled = false;
  document.getElementById('inputLength').disabled = false;
  document.getElementById('inputDelay').disabled = false;

  clearInterval(interval);
  snakes = [];
  stop = false;
}

function Pause() {
  stop ^= 1;
  document.getElementById('inputDelay').disabled ^= 1;
  DELAY = parseInt(document.getElementById('inputDelay').value);
}

function DrawMenu() {
  oldWidth = window.innerWidth;
  if (window.innerWidth > 700) {
    if (!menuOn) {
      document.getElementsByClassName('everythingElse')[0].style.display = 'none';
      document.getElementsByClassName('menu')[0].style.display = 'none';
      document.getElementsByClassName('controlMenu')[0].style = false;
      document.getElementsByClassName('controlMenu')[0].style.width = '70px';
      document.getElementsByClassName('smallButton')[0].innerHTML = '>';
      document.getElementsByClassName('workspace')[0].style.width = 'calc(100% - 70px)';
      document.getElementsByClassName('workspace')[0].style.marginLeft = '90px';
    } else {
      document.getElementsByClassName('everythingElse')[0].style = false;
      document.getElementsByClassName('menu')[0].style = false;
      document.getElementsByClassName('controlMenu')[0].style = false;
      document.getElementsByClassName('smallButton')[0].innerHTML = '<';
      document.getElementsByClassName('workspace')[0].style = false;
    }
  } else {
    if (!menuOn) {
      document.getElementsByClassName('everythingElse')[0].style.display = 'none';
      document.getElementsByClassName('smallButton')[0].innerHTML = '>';
      document.getElementsByClassName('controlMenu')[0].style = false;
      document.getElementsByClassName('menu')[0].style = false;
      document.getElementsByClassName('workspace')[0].style = false;
      document.getElementsByClassName('controlMenu')[0].style.paddingBottom = '0';
    } else {
      document.getElementsByClassName('everythingElse')[0].style = false;
      document.getElementsByClassName('menu')[0].style = false;
      document.getElementsByClassName('controlMenu')[0].style = false;
      document.getElementsByClassName('smallButton')[0].innerHTML = '<';
      document.getElementsByClassName('workspace')[0].style = false;
    }
  }
}

var menuOn = true;
var oldWidth = window.innerWidth;
function SwapMenu() {
  console.log(window.innerWidth);
  menuOn ^= 1;
  console.log(menuOn);
  DrawMenu();
}

var widthInterval = setInterval(function () {
  if (!menuOn && window.innerWidth != oldWidth) DrawMenu();
}, 200);

function CustomClearInterval() {
  oldDelay = DELAY;
  clearInterval(interval);
  interval = setInterval(function () {
    if (!stop) AllEvolution();
    if (oldDelay != DELAY) {
      CustomClearInterval();
    }
  }, DELAY);
}

var oldDelay = DELAY;

var chartCtx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(chartCtx, {
  type: 'line',
  data: {
    labels: [ '0' ],
    datasets: [{
      label: '평균',
        data: [ 0 ],
        backgroundColor: [
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [],
        borderWidth: 0
    },
    {
      label: '최저',
      data: [ 0 ],
      backgroundColor: [
        'rgba(75, 192, 192, 0.2)'
      ],
      borderColor: [],
      borderWidth: 0
    },
    {
      label: '최대',
      data: [ 0 ],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)'
      ],
      borderColor: [],
      borderWidth: 0
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
        }
      }]
    }
  }
});

function addData(chart, label, data) {
  chart.data.labels.push(label);
  var k = 0;
  chart.data.datasets.forEach(function (dataset) {
    dataset.data.push(data[k++]);
    dataset.backgroundColor.push(dataset.backgroundColor[0]);
  });
  chart.update();
}

function AllEvolution() {
  for (var i = 0; i < POPULATION; i++) {
    if (!snakes[i].alive) continue;
    snakes[i].Evolution();
    DrawEvolution(i);
    var newMove = { length: snakes[i].body.length, body: snakes[i].body[0], looking: snakes[i].looking, coin: snakes[i].coin };
    if (snakes[i].moves.filter(function (snake) {
      if (snake.length != newMove.length) return false;
      if (snake.looking != newMove.looking) return false;
      if (snake.coin.x != newMove.coin.x || snake.coin.y != newMove.coin.y) return false;
      if (snake.body.x != newMove.body.x || snake.body.y != newMove.body.y) return false;
      return true;
    }).length > 0) snakes[i].alive = false;
    else snakes[i].moves.push(newMove);
    if (!snakes[i].alive) DrawEvolution(i);
  }
  document.getElementById('h2').innerHTML = generation + '세대 인공지능, 살아 있는 개체 수: ' + aliveCount();
  time++;

  if (allDead()) {
    var average = 0, minimum = Math.pow(2, 32), maximum = 0;
    snakes.forEach(function (snake) {
       average += snake.fitness;
       minimum = Math.min(minimum, snake.fitness);
       maximum = Math.max(maximum, snake.fitness);
    });
    average /= POPULATION;
    prevAverage = minimum;
    addData(myChart, generation.toString(), [ average, minimum, maximum ]);

    time = 0;
    snakes.sort(function (a, b) {
      if (a.fitness > b.fitness) return -1;
      if (a.fitness < b.fitness) return 1;
      return 0;
    });
    var newSnakes = [], safeSnakes;
    for (var i = 0; i < POPULATION / 10; i++) {
      newSnakes[i] = snakes[i];
      newSnakes[i].body = [{ x: null, y: null }];
      if (WIDTH & 1) newSnakes[i].body[0].x = (WIDTH - 1) / 2;
      else newSnakes[i].body[0].x = (WIDTH - 2) / 2 + Math.floor(Math.random() * 2);
      if (HEIGHT & 1) newSnakes[i].body[0].y = (HEIGHT - 1) / 2;
      else newSnakes[i].body[0].y = (HEIGHT - 2) / 2 + Math.floor(Math.random() * 2);
      for (var j = 0; j < LEN; j++) newSnakes[i].body.push(newSnakes[i].body[0]);
      newSnakes[i].coin = null;
      while (!newSnakes[i].coin || newSnakes[i].body.filter(item => item.x == newSnakes[i].coin.x && item.y == newSnakes[i].coin.y).length > 0) {
        newSnakes[i].coin = { x: Math.floor(Math.random() * WIDTH), y: Math.floor(Math.random() * HEIGHT) };
      }
      newSnakes[i].input = [];
      newSnakes[i].looking = Math.floor(Math.random() * 4);
      newSnakes[i].length = newSnakes[i].body.length;
      newSnakes[i].alive = true;
      newSnakes[i].fitness = 0;
      newSnakes[i].moves = [{ length: newSnakes[i].body.length, body: newSnakes[i].body[0], looking: newSnakes[i].looking, coin: newSnakes[i].coin }];
    }
    safeSnakes = newSnakes.length;
    for (var i = safeSnakes; i < POPULATION; i++) newSnakes[i] = mutate(snakes[Select(snakes)], snakes[Select(snakes)]);
    snakes = newSnakes;

    generation++;
  }
}

function allDead() {
  return aliveCount() == 0;
}

function aliveCount() {
  var cnt = 0;
  snakes.forEach(function (snake) {
    if (snake.alive) cnt++;
  });
  return cnt;
}

function Select(snakes) {
  var minFitness = -Math.pow(2, 32);
  for (var i = 0; i < snakes.length; i++) minFitness = Math.min(minFitness, snakes[i].fitness);
  var fitnessSum = 0;
  for (var i = 0; i < snakes.length; i++) fitnessSum += snakes[i].fitness - minFitness;
  var point = Math.floor(Math.random() * fitnessSum);
  var sum = 0;
  for (var i = 0; i < snakes.length; i++) {
    sum += snakes[i].fitness - minFitness;
    if (point < sum) return i;
  }
  return snakes.length - 1;
}

function mutate(a, b) {
  var brainSize = a.brain.layer.length;
  for (var i = 1; i < a.brain.layer.length; i++) brainSize += a.brain.layer[i - 1] * a.brain.layer[i] + a.brain.layer[i];
  brainSize *= 32;
  var point = Math.floor(Math.random() * brainSize);
  var newSnake = new Snake();

  var currentSize = 0;
  for (var i = 0; i < newSnake.brain.layer.length; i++) {
    if (i) for (var j = 0; j < newSnake.brain.layer[i]; j++) {
      if (currentSize > point) newSnake.brain.node[i].bios[j] = a.brain.node[i].bios[j];
      else if (currentSize + 32 <= point) newSnake.brain.node[i].bios[j] = b.brain.node[i].bios[j];
      else {
        var nPoint = point - currentSize; // slice from here
        newSnake.brain.node[i].bios[j] = 0;
        for (var j = 0; j < 32; j++) {
          if (j < nPoint) {
            if (a.brain.node[i].bios[j] & (1 << j))
              newSnake.brain.node[i].bios[j] |= (1 << j);
          } else {
            if (b.brain.node[i].bios[j] & (1 << j))
              newSnake.brain.node[i].bios[j] |= (1 << j);
          }
        }
      }
      currentSize += 32;
      if (Math.floor(Math.random() * 125) == 0) newSnake.brain.node[i].bios[j] ^= (1 << Math.floor(Math.random() * 32));
    }
    if (i) {
      for (var j = 0; j < newSnake.brain.layer[i]; j++) {
        for (var k = 0; k < newSnake.brain.layer[i - 1]; k++) {
          // newSnake.brain.node[i].weight[j][k]
          if (currentSize > point) newSnake.brain.node[i].weight[j][k] = a.brain.node[i].weight[j][k]
          else if (currentSize + 32 <= point) newSnake.brain.node[i].weight[j][k] = b.brain.node[i].weight[j][k]
          else {
            var nPoint = point - currentSize; // slice from here
            newSnake.brain.node[i].weight[j][k] = 0;
            for (var l = 0; l < 32; l++) {
              if (l < nPoint) {
                if (a.brain.node[i].weight[j][k] & (1 << l))
                  newSnake.brain.node[i].weight[j][k] |= (1 << l);
              } else {
                if (b.brain.node[i].weight[j][k] & (1 << l))
                  newSnake.brain.node[i].weight[j][k] |= (1 << l);
              }
            }
          }
          currentSize += 32;
          if (Math.floor(Math.random() * 125) == 0) newSnake.brain.node[i].weight[j][k] ^= (1 << Math.floor(Math.random() * 32));
        }
      }
    }
  }
  var colorBrainSize = 18;
  var colorPoint = Math.floor(Math.random() * colorBrainSize);
  var colorCurrent = 0;
  newSnake.brain.color = [ 0, 0, 0 ];
  for (var i = 0; i < 3; i++) {
    if (colorCurrent > colorPoint) newSnake.brain.color[i] = a.brain.color[i];
    else if (colorCurrent + 6 <= colorPoint) newSnake.brain.color[i] = b.brain.color[i];
    else {
      var nPoint = colorPoint - colorCurrent;
      for (var j = 0; j < 6; j++) {
        if (j < nPoint) {
          if (a.brain.color[i] & (1 << j))
            newSnake.brain.color[i] |= (1 << j);
        } else {
          if (b.brain.color[i] & (1 << j))
            newSnake.brain.color[i] |= (1 << j);
        }
      }
    }
    currentSize += 6;
    if (Math.floor(Math.random() * 50) == 0) newSnake.brain.color[i] ^= (1 << Math.floor(Math.random() * 6));
  }
  return newSnake;
}

function Canvas(canvas) {
  this.canvas = canvas;
  this.ctx = canvas.getContext('2d');
}

function Snake() {
  this.body = [{ x: null, y: null }];
  if (WIDTH & 1) this.body[0].x = (WIDTH - 1) / 2;
  else this.body[0].x = (WIDTH - 2) / 2 + Math.floor(Math.random() * 2);
  if (HEIGHT & 1) this.body[0].y = (HEIGHT - 1) / 2;
  else this.body[0].y = (HEIGHT - 2) / 2 + Math.floor(Math.random() * 2);
  for (var i = 0; i < LEN; i++) this.body.push(this.body[0]);
  this.brain = new Chromosome([ 6, 24, 16, 3 ]); // distance * 3, type * 3 * 3
  while (!this.coin || this.body.filter(item => item.x == this.coin.x && item.y == this.coin.y).length > 0) {
    this.coin = { x: Math.floor(Math.random() * WIDTH), y: Math.floor(Math.random() * HEIGHT) };
  }
  this.input = [];
  this.looking = Math.floor(Math.random() * 4);
  this.length = this.body.length;
  this.alive = true;
  this.fitness = 0;
  this.moves = [{ length: this.body.length, body: this.body[0], looking: this.looking, coin: this.coin }];
}

Snake.prototype.SetInput = function (index, data) {
  this.input[index] = data;
}

Snake.prototype.Get = function (layer, index) {
  if (!layer) return this.input[index];
  var sum = 0.;
  for (var i = 0; i < this.brain.layer[layer - 1]; i++) sum += this.Get(layer - 1, i) * (this.brain.node[layer].weight[index][i] - Math.pow(2, 31)) / 100000;
  return ReLU(sum + (this.brain.node[layer].bios[index] - Math.pow(2, 31)) / 100000);
}

function Chromosome(arr) {
  this.layer = arr;
  this.node = [];
  for (var i = 0; i < arr.length; i++) {
    this.node[i] = { weight: [], bios: [] };
    if (i) {
      for (var j = 0; j < arr[i]; j++) {
        var nWeight = [];
        for (var k = 0; k < arr[i - 1]; k++) {
          nWeight[k] = Math.floor(Math.random() * Math.pow(2, 32));
        }
        this.node[i].weight[j] = nWeight;
      }
      for (var j = 0; j < arr[i]; j++) this.node[i].bios[j] = Math.floor(Math.random() * Math.pow(2, 32));
    }
  }
  this.color = [ Math.floor(Math.random() * 63), Math.floor(Math.random() * 63), Math.floor(Math.random() * 63) ];
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function ReLU(x) {
  return Math.max(0, x);
}

function DrawEvolution(i) {
  var ctx = canvases[i].ctx;
  ctx.clearRect(0, 0, 100, 100);
  if (snakes[i].alive) {
    var color = snakes[i].brain.color;
    ctx.fillStyle = "rgb(" + (color[0] + 192) + ", " + (color[1] + 192) + ", " + (color[2] + 192) + ")";
    var rgb = 0;
    snakes[i].body.forEach(function (item) {
      rgb++;
      ctx.fillStyle = "rgb(" + Math.floor(color[0] + 96 - 96 / rgb) + ", " + Math.floor(color[1] + 96 - 96 / rgb) + ", " + Math.floor(color[2] + 96 - 96 / rgb) + ")";
      ctx.fillRect(item.x * 100 / WIDTH, item.y * 100 / HEIGHT, 100 / WIDTH, 100 / HEIGHT);
    });
  }
  else {
    ctx.fillStyle = "rgb(225, 225, 225)";
    snakes[i].body.forEach(item => ctx.fillRect(item.x * 100 / WIDTH, item.y * 100 / HEIGHT, 100 / WIDTH, 100 / HEIGHT));
  }
  ctx.fillStyle = "rgb(150, 150, 0)";
  ctx.fillRect(snakes[i].coin.x * 100 / WIDTH, snakes[i].coin.y * 100 / HEIGHT, 100 / WIDTH, 100 / HEIGHT);
}

Snake.prototype.Evolution = function () {
  if (!this.alive) return this.length;

  var distanceToCoin = Math.pow(this.body[0].x - this.coin.x, 2) + Math.pow(this.body[0].y - this.coin.y, 2);
  var dt = [ [ 0, -1 ], [ 1, 0 ], [ 0, 1 ], [ -1, 0 ] ];//x, y;

  var direction = this.looking, snake = this.body[0];
  this.SetInput(0, 1); // clear straight ahead
  if (this.body[0].x + dt[direction][0] >= WIDTH || this.body[0].x + dt[direction][0] < 0 || this.body[0].y + dt[direction][1] >= HEIGHT || this.body[0].y + dt[direction][1] < 0) this.SetInput(0, 0);
  else if (this.body.filter(function (item) {
    return item.x == snake.x + dt[direction][0] && item.y == snake.y + dt[direction][1];
  }).length > 0) this.SetInput(0, 0);
  direction = (this.looking + 1) % 4;
  this.SetInput(1, 1); // clear right
  if (this.body[0].x + dt[direction][0] >= WIDTH || this.body[0].x + dt[direction][0] < 0 || this.body[0].y + dt[direction][1] >= HEIGHT || this.body[0].y + dt[direction][1] < 0) this.SetInput(1, 0);
  else if (this.body.filter(function (item) {
    return item.x == snake.x + dt[direction][0] && item.y == snake.y + dt[direction][1];
  }).length > 0) this.SetInput(1, 0);
  direction = (this.looking + 3) % 4;
  this.SetInput(2, 1); // clear left
  if (this.body[0].x + dt[direction][0] >= WIDTH || this.body[0].x + dt[direction][0] < 0 || this.body[0].y + dt[direction][1] >= HEIGHT || this.body[0].y + dt[direction][1] < 0) this.SetInput(2, 0);
  else if (this.body.filter(function (item) {
    return item.x == snake.x + dt[direction][0] && item.y == snake.y + dt[direction][1];
  }).length > 0) this.SetInput(2, 0);
  if (this.looking == 0) {
    this.SetInput(3, this.coin.x < this.body[0].x ? 1 : 0);
    this.SetInput(4, this.coin.x > this.body[0].x ? 1 : 0);
    this.SetInput(5, this.coin.y < this.body[0].y ? 1 : 0);
  } else if (this.looking == 1) {
    this.SetInput(3, this.coin.y < this.body[0].y ? 1 : 0);
    this.SetInput(4, this.coin.y > this.body[0].y ? 1 : 0);
    this.SetInput(5, this.coin.x > this.body[0].x ? 1 : 0);
  } else if (this.looking == 2) {
    this.SetInput(3, this.coin.x > this.body[0].x ? 1 : 0);
    this.SetInput(4, this.coin.x < this.body[0].x ? 1 : 0);
    this.SetInput(5, this.coin.y > this.body[0].y ? 1 : 0);
  } else {
    this.SetInput(3, this.coin.y > this.body[0].y ? 1 : 0);
    this.SetInput(4, this.coin.y < this.body[0].y ? 1 : 0);
    this.SetInput(5, this.coin.x < this.body[0].x ? 1 : 0);
  }

  var result = [ this.Get(2, 0), this.Get(2, 1), this.Get(2, 2) ];
  if (result[1] > result[0] && result[1] > result[2]) this.looking = (this.looking + 3) % 4;
  else if (result[2] > result[0] && result[2] > result[1]) this.looking = (this.looking + 1) % 4;

  var target = { x: this.body[0].x + dt[this.looking][0], y: this.body[0].y + dt[this.looking][1] };
  if (target.x == WIDTH || target.x < 0 || target.y == HEIGHT || target.y < 0 || this.body.filter(item => item.x == target.x && item.y == target.y).length > 0) {
    this.alive = false;
    return;
  }

  this.body.unshift({ x: this.body[0].x + dt[this.looking][0], y: this.body[0].y + dt[this.looking][1] });
  var newDistanceToCoin = Math.pow(this.body[0].x - this.coin.x, 2) + Math.pow(this.body[0].y - this.coin.y, 2);
  if (newDistanceToCoin > distanceToCoin) this.fitness += AWAYFITNESS;
  else this.fitness += TOFITNESS;

  if (this.body[0].x != this.coin.x || this.body[0].y != this.coin.y) this.body.pop();
  else while (!this.coin || this.body.filter(item => item.x == this.coin.x && item.y == this.coin.y).length > 0) {
    this.coin = { x: Math.floor(Math.random() * WIDTH), y: Math.floor(Math.random() * HEIGHT) };
    this.fitness += COINFITNESS;
    this.length++;
  }

  return this.length;
}
