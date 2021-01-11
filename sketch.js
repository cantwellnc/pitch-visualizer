let audioContext;
let mic;
let pitch;
const btn = document.querySelector("button");
const body = document.querySelector("body");
const status = document.querySelector("#status");

btn.addEventListener("click", setup, {once: true});

async function setup() {
    audioContext = new AudioContext();
    stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    startPitch(stream, audioContext);
  }

function startPitch(stream, audioContext) {
    pitch = ml5.pitchDetection('./models/pitch-detection/crepe', audioContext , stream, modelLoaded);
}

async function modelLoaded() {
    status.textContent='Model Loaded';
    const a = await sleep(2000);
    status.style.display = "none";
    getPitch();
}

async function getPitch() {
    pitch.getPitch(function(err, frequency) {
        if (frequency) {
            document.querySelector('#result').textContent = frequency;
            // const color = clamp(frequency*Math.random() + frequency*Math.random(), 0, 255);
            // body.style.background = rgb(color, color + Math.random()*255, color - Math.random()*255);
            body.style.background = rgb(clamp(Math.sqrt(frequency), 0, 255), clamp(Math.sqrt(frequency/2), 0, 255), clamp(frequency/3,0,255)); 
        }
    });
    const stop = await sleep(300);
    getPitch();
}

function sleep(ms){
	return new Promise(resolve => setTimeout(resolve, ms)); 
}

function rgb(r, g, b){
    return `rgb(${r},${g},${b})`;
}

function clamp(num, min, max){
    return Math.min(Math.max(num, min), max);
}

