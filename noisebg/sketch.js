/* SIMPLEX NOISE INFO SOURCE:
https://discourse.processing.org/t/perlin-3d-noise-working-correctly/18988/4
*/


// debug settings
var mode = 3;
var showLines = false;

// default values
const sclDefault = 30;
const incXYDefault = 0.07;
const incZDefault = 0.005;
const octavesDefault = 3;
const ampDecDefault = 0.43;
const freqIncDefault = 6;
const hpDefault = 0.6;
const mouseRangeDefault = 10;
const mouseStrengthDefault = 1.3
const displacementDefault = 2.2;
const shrinkageDefault = 0

var colorPicker;
var buttonDefault;
var canvas;

// colors
var r1 = 7;
var g1 = 8;
var b1 = 8;
var r2Default = 66;
var g2Default = 88;
var b2Default = 162;

// other variables
var scl, incXY, incZ, hp;
var cols, rows;
var zOff = 0;
var simplex = new SimplexNoise();
var octaveOffsets = []

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('z-index', '-10');
  canvas.style('position', 'fixed');
  rectMode(CORNER)

  cols = floor(width / sclDefault) + 1;
  rows = floor(height / sclDefault) + 1;

  frameRate(25);
  

    for (let i = 0; i < 5; i++) {
      let offsetX = random(-100000, 100000);
      let offsetY = random(-100000, 100000);
      octaveOffsets.push(createVector(offsetX, offsetY));
    }
}

function draw() {
  background(r1, g1, b1);

  scl = sclDefault
  let incXY = incXYDefault
  let incZ = incZDefault
  let octaves = octavesDefault
  let amplitudeDecrease = ampDecDefault
  let frequencyIncrease = freqIncDefault
  let highpass = hpDefault
  let mouseRange = mouseRangeDefault
  let mouseStrength = mouseStrengthDefault
  let cellDisplacement = displacementDefault
  let cellShrinkage = shrinkageDefault

  let noisemap = NoisemapGenerator.generateNoisemap(incXY, zOff, highpass, octaves, amplitudeDecrease, frequencyIncrease)
  let highlight = HighlightGenerator.generateHighlight(mouseRange, mouseStrength)

  var yOff = 0;

  if(cellDisplacement >= 0){
  for (let y = rows - 1; y >= 0; y--) {
    
    for (let x = cols - 1; x >= 0; x--) {
        drawCell(x*scl, y*scl, noisemap[y][x], highlight[y][x], cellDisplacement, cellShrinkage)
    }

  }
  }
  else {
    for (let y = 0; y < rows; y++) {
    
    for (let x = 0; x < cols; x++) {
        drawCell(x*scl, y*scl, noisemap[y][x], highlight[y][x], cellDisplacement, cellShrinkage)
    }

  }
  }

  zOff += incZ;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, false)
  cols = floor(width / sclDefault) + 1;
  rows = floor(height / sclDefault) + 1;  
}


function drawCell(x, y, noiseValue, highlightValue, cellDisplacement, cellShrinkage) {
    let dx, dy, dw, dh, w, h
    let r2 = 66
    let g2 = 88
    let b2 = 162

    let value

      if (highlightValue > 0) {
        value = noiseValue * highlightValue
      }
    
    
    if (value > 1) value = 1

    let r = floor(map(value, 0, 1, r1, r2));
    let g = floor(map(value, 0, 1, g1, g2));
    let b = floor(map(value, 0, 1, b1, b2));

    fill(r, g, b);
    noStroke();

  
  
    if (mode == 1) {
      dx = (scl - (value * scl)) / 2
      dy = dx
      w = scl - 2 * dx
      h = w
    } 
  else if (mode == 2) {
      let valueTemp = map(value, 0, 1, -1, 1)
      dx = scl * valueTemp * 0.5
      dy = dx
      w = sq(value) * scl
      if (w < scl * 0.6) w = scl * 0.6
      h = w
    }
  else if (mode == 3) {
    dx = (value * scl * cellDisplacement)/2
    dy = dx
    w = (1-((1-value) * cellShrinkage))*scl
    h = w
  }

    if (value > 0) {
      rect(x + dx, y + dy, w, h);
    }
    if (showLines) {
      if(value < 0.5) stroke(0, 0, 255)
      if(value >= 0.5) stroke(255, 0, 0)
      strokeWeight(1);
      line(x, y, x + dx, y + dy)
    }
  }





function defaultValues() {

  colorPicker.remove();
  colorPicker = createColorPicker(color(r2Default, g2Default, b2Default));
  colorPicker.position(155, 230);

  scl = sclDefault;
  resize();
}

function resize() {
  cols = floor(width / scl) + 1;
  rows = floor(height / scl) + 1;
}