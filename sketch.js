let img_graphics;
let water;
let last_fetch_pos = 0;
let last_play_pos = 0;
let pos = 0;
let displacementMag = 0;
let last_played = 0;
let poems = [];
let notes = [{}]
let clicked = false;

const soundtrack = {
  1: [1, 6],
  2: [4],
  3: [3],
  4: [2, 3],
  5: [4],
  6: [6],
  7: [2, 6],
  8: [9],
  9: [9],
  10: [1, 10],
  11: [6],
  12: [4],
  13: [3],
  14: [],
  15: [],
  16: [2, 4],
  17: [8],
  18: [6],
  19: [3, 6],
  20: [9],
  21: [8],
  22: [2, 5],
  23: [3, 7],
  24: [7],
  25: [3, 8],
  26: [2],
  27: [1]
}

async function preload(){
  waterShader = loadShader('shader.vert', 'shader.frag');
  water = createVideo(
    ["media/waves.mp4"],
    async function() {
      try {
        water.hide();
        water.volume(0);
        water.loop();
      } catch (err) {
        console.error(err);
      }
    }
  )
  
  notes.push(loadSound('media/C.mp3')); //1
  notes.push(loadSound('media/D.mp3')); //2
  notes.push(loadSound('media/E.mp3')); //3
  notes.push(loadSound('media/F.mp3')); //4
  notes.push(loadSound('media/Fs.mp3')); //5
  notes.push(loadSound('media/G.mp3')); //6
  notes.push(loadSound('media/Gs.mp3')); //7
  notes.push(loadSound('media/A.mp3')); //8
  notes.push(loadSound('media/B.mp3')); //9
  notes.push(loadSound('media/C2.mp3')); //10
  water.size(window.innerWidth, window.innerHeight);
  poems = await loadPoems();
}

function setup() {
  // See https://www.khronos.org/webgl/wiki/HandlingContextLost
  // TODO: WebGL still crashes often... recovery isn't working?
  var canvas = document.getElementById("defaultCanvas0");
  canvas.addEventListener("webglcontextlost", function(event) {
    event.preventDefault();
}, false);
  canvas.addEventListener(
    "webglcontextrestored", function() {preload(); setup();}, false);
    

  background(0);
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  
  img_graphics = createGraphics(window.innerWidth, window.innerHeight * 4);

  img_graphics.fill(255);
  img_graphics.textSize(70);
  img_graphics.textFont("Arial");
  img_graphics.textAlign(CENTER);
  img_graphics.noStroke();
  img_graphics.text('fall 2001', 0.3 * window.innerWidth, 0.8 * window.innerHeight);
  
  img_graphics.textSize(18);
  img_graphics.text('click, then scroll to begin', 0.3 * window.innerWidth, 0.9 * window.innerHeight);
  
  
  pixelDensity(1);
  frameRate(36);
}

function draw() {
  
  displacementMag *= 0.985;
  
  scaled_pos = pos % 620;
  
  shader(waterShader);
  waterShader.setUniform("horror", img_graphics.get(100*sin(pos * 0.06),scaled_pos + 100*sin(pos * 0.08),window.innerWidth, window.innerHeight));
  waterShader.setUniform("displacement", water);
  waterShader.setUniform('time', pos);
  waterShader.setUniform('displacementMult', displacementMag * (scaled_pos * scaled_pos + 1000) * 0.0003);
  
  rect(0,0,width,height);
}

function mousePressed() {
  clicked = true;
}

function mouseWheel(event) {
  if (event.delta < 0 || !clicked)
    return;
  pos += event.delta / 4;
  displacementMag = 1;
  if (pos - last_fetch_pos > 620) {
    fetchPoem();
    last_fetch_pos = pos;
  }
  if (pos - last_play_pos > 130) {
    playNext();
    last_play_pos = pos;
  }
}

async function loadPoems() {
    const response = await fetch('poems.txt');
    const data = await response.text();
    return data.split("<><><>>>>>>>><<<<<<<<><><>")
      .map((a) => ({sort: Math.random(), value: a}))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value);
}

function fetchPoem() {
  img_graphics.background(0);
  let txt = poems.pop();
  console.log(txt);
  
  img_graphics.textSize(20);
  
  img_graphics.textAlign(LEFT);
  img_graphics.text(txt, 0.6 * window.innerWidth, 0.8 * window.innerHeight);
}

function playNext() {
  let to_play = soundtrack[last_played % 27 + 1];
  for(let i = 0; i < to_play.length; i++) {
    console.log("play idx ", i, ": ", to_play[i]);
    notes[to_play[i]].play();
  }
  last_played++;
}