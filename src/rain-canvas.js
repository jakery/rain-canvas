'use strict';

let settings = {
	// Number of raindrops on the screen. 100 = light rain. 5000 = torrential downpour.
	// Default: 500
	raindropCount: 500,

	// Style of the background.
	// Default: 'rgb(0,0,0)' (Solid black)
	backgroundStyle: 'rgb(0,0,0)',

	// Style of the raindrops.
	// Default: 'rgb(0, 127, 255)' (Solid, lightish blue)
	raindropStyle: 'rgb(0,127,255)',

	// Minimum and  length of raindrop line, in pixels.
	// Default: { min: 30,  max: 60}
	raindropLengthRange: {
		min: 30,
		max: 60
	},

	// If true, the number of raindrops falling builds over time.
	// (One new drop per animation frame until max is reached)
	// Note: If set to false and 'raindropCount' is high, there
	// will be a delay while the raindrop array populates.
	// Default: true
	gradual: true
}

let dropArray, canvas, ctx;

class rainDrop {
	constructor() {
		this.length = (Math.random() * (settings.raindropLengthRange.max - settings.raindropLengthRange.min)) + settings.raindropLengthRange.min;
		this.moveXLength = this.length / 3;
		this.moveYLength = this.length / 2;
		this.drawXLength = Math.floor(this.length * 0.66);

		this.randomStartRange = document.body.clientWidth * 1.66;
		this.randomStartOffset = document.body.clientWidth * .8;
		this.startAboveScreenOffset = 100;

		this.initPosition = {
			x: (Math.random() * this.randomStartRange) - this.randomStartOffset,
			y: (0 - this.length) - this.startAboveScreenOffset
		}

		this.startPosition = {
			x: this.initPosition.x,
			y: this.initPosition.y
		};

	}

	draw() {
		ctx.moveTo(this.startPosition.x, this.startPosition.y);
		ctx.lineTo(this.startPosition.x + this.drawXLength, this.startPosition.y + this.length);
	}

	update() {
		this.startPosition.x += this.moveXLength;
		this.startPosition.y += this.moveYLength;
		if (this.startPosition.y > document.body.clientHeight && this.startPosition.x > document.body.clientWidth) {
			this.startPosition.x = this.initPosition.x;
			this.startPosition.y = this.initPosition.y;
		}
	}
}

let animate = function animate() {
	if (settings.gradual && dropArray.length < settings.raindropCount) {
		dropArray.push(new rainDrop());
	}
	ctx.clearRect(0, 0, document.body.clientWidth, document.body.clientHeight);

	// Background.
	ctx.beginPath();
	ctx.rect(0,0,document.body.clientWidth, document.body.clientHeight);
	ctx.fillStyle = settings.backgroundStyle;
	ctx.fill();

	ctx.beginPath();
	for (let i = 0; i < dropArray.length; i++) {
		dropArray[i].update();
		dropArray[i].draw();
	}
	ctx.stroke();
	window.requestAnimationFrame(animate);
}

let setWindowHeight = function setWindowHeight(){
    var windowHeight = window.innerHeight;
    document.body.style.height = windowHeight + "px";
}

let init = function init() {

	setWindowHeight();
	window.addEventListener("resize",setWindowHeight,false);

	canvas = document.getElementById('weather');
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;

	ctx = canvas.getContext('2d');
	dropArray = [];

	ctx.lineWidth = 1;
	ctx.strokeStyle = settings.raindropStyle;

	// Spin up all raindrops on the screen at once.
	if (!settings.gradual) {
		for (let i = 0; i < settings.raindropCount; i++) {
			dropArray.push(new rainDrop());
			for (let j = 0; j < dropArray.length; j++) {
				dropArray[j].update();
			}
		}
	}
	window.requestAnimationFrame(animate);
}

init();
