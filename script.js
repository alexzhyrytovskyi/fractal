/*
	authors: 
		Alex Zhyrytovskyi,
		Valeriy Balabanov
	  
	created: 07.03.2014
*/

var canvas;
var ctx;
var image;
var pixels;
var MAX_ITERATIONS = 80;
var COLORS_COUNT = 7;
var palette = new Array(MAX_ITERATIONS);
var colors = new Array(COLORS_COUNT);
var x1 = -2;
var y1 = -2;
var x2 = 2;
var y2 = 2;

function initColors() {
	colors[0] = [0x00, 0x00, 0x00];
	colors[1] = [0x99, 0x88, 0xFF];
	colors[2] = [0xFF, 0xFF, 0xFF];
	colors[3] = [0x55, 0x00, 0x00];
	colors[4] = [0xFF, 0x55, 0xEE];
	colors[5] = [0xFF, 0xFF, 0x00];
	colors[6] = [0xFF, 0xFF, 0xFF];
}

function mixColors(color1, color2, i, n) {
	return [
		(color2[0] - color1[0]) * i / n + color1[0],
		(color2[1] - color1[1]) * i / n + color1[1],
		(color2[2] - color1[2]) * i / n + color1[2]
	]
}

function initPalette() {
	var fragmentSize = Math.round(MAX_ITERATIONS / (COLORS_COUNT-1));
	var fragmentIndex = 0;
	var fragmentPos = 0;
	for (var i = 0; i < MAX_ITERATIONS; i++) {
		palette[i] = mixColors(colors[fragmentIndex], colors[fragmentIndex + 1], fragmentPos, fragmentSize);
		fragmentPos++;
		if (fragmentPos > fragmentSize) {
			fragmentPos = 0;
			fragmentIndex++;
		}
	}
}

function mandelbrot(x, y) {
	var x0 = x;
	var y0 = y;
	var n = 0;
	while (x*x + y*y < 4 && n < MAX_ITERATIONS) {
		var xt = x*x - y*y + x0;
		var yt = 2*x*y + y0;
		x = xt;
		y = yt;
		n++;
	}
	if (n >= MAX_ITERATIONS)
		n = 0;
	return n;
}

function putPixel(x, y, c) {
	var offs = (y * canvas.width + x) * 4;
	pixels[offs    ] = c[0];
	pixels[offs + 1] = c[1];
	pixels[offs + 2] = c[2];
	pixels[offs + 3] = 255;
}

function drawFractal() {
	canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");
	image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    pixels = image.data;
	
	var timestamp = new Date().getTime();
	
	var size = canvas.width < canvas.height ? canvas.width : canvas.height;
	var left = (canvas.width - size) / 2;
	var top = (canvas.height - size) / 2;
	
	var kx = (x2 - x1) / size;
	var ky = (y2 - y1) / size;
	for (var y = 0; y < canvas.height; y++) {
        for (var x = 0; x < canvas.width; x++) {
			var i = x1 + (x - left) * kx;
			var j = y1 + (y - top) * ky;
			var n = mandelbrot(i, j);
			var color = palette[n];
			putPixel(x, y, color);
        }
    }
	
	var timeout = new Date().getTime() - timestamp;
	document.getElementById('timeout').innerHTML = 'Frame timeout: ' + timeout + ' ms';

    ctx.putImageData(image, 0, 0);
}

function onMouseDown(e) {
	if (e.which == 1) {
		var mouseX = e.clientX - canvas.offsetLeft;
		var mouseY = e.clientY - canvas.offsetTop;
		var cw2 = canvas.width / 2;
		var ch2 = canvas.height / 2;
		
		var dx = (x2 - x1) / 2.0 * 0.6;
		var dy = (y2 - y1) / 2.0 * 0.6;	
		var xc = (x2 + x1) / 2.0 + 0.8 * (x2 - x1) / 2.0 * (mouseX - cw2) / cw2;
		var yc = (y2 + y1) / 2.0 + 0.8 * (y2 - y1) / 2.0 * (mouseY - ch2) / ch2;
		x1 = xc - dx;
		y1 = yc - dy;
		x2 = xc + dx;
		y2 = yc + dy;
		
		drawFractal();
	}
}

function onLoad() {
	canvas = document.getElementById("canvas");
	canvas.onmousedown = onMouseDown;

	initColors();
	initPalette();
	
    drawFractal();
}

function onReset() {
	x1 = -2;
	y1 = -2;
	x2 = 2;
	y2 = 2;
	drawFractal();
}
