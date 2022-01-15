// Hi there curious fella! 
// I decided to comment the entire code just for you!

// This gets the cavnas from index.html 
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');

// This sets the canvas to the current window size
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

// Variables
let particlesArray;
let mouseDivider = 100; // Increase this to shrink the mouse radius
let connectDivider = 7; // Increase this to shrink the minimum distance or a line
let particleDivider = 9000; // Decrease this to get more particles, change at your own risk of lagging your device :)
let minimumParticleSize = 1;
let particleSpeed = 2;
let mouse = {
	x: null,
	y: null,
	radius: (canvas.height / mouseDivider) * (canvas.width / mouseDivider)
}

// This locates the curser and sets the cursor position to 'mouse'
window.addEventListener('mousemove',
	function (event) {
		mouse.x = event.x;
		mouse.y = event.y;
	}
);

// To prevent a 'ghost cursor', itll set the position of the cursor to undefined when there is no cursor on the screen
window.addEventListener('mouseout',
	function () {
		mouse.x = undefined;
		mouse.x = undefined;
	}
);


// Big boi class to create particles
class Particle {
	constructor(x, y, directionX, directionY, size, colour) {
		this.x = x;
		this.y = y;
		this.directionX = directionX;
		this.directionY = directionY;
		this.size = size;
		this.colour = colour;
	}

	// This draws the particle, arc is basically a circle (who decided radians would be the thing to go with)
	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
		ctx.fillStyle = this.colour;
		ctx.fill();
	}

	// This updates the particles every frame
	update() {
		// These if statements check if the particle is at the edge of the page and if thats the case, it has to go back (there is no escape >:)
		if (this.x > canvas.width || this.x < 0) {
			this.directionX = -this.directionX;
		}
		if (this.y > canvas.height || this.y < 0) {
			this.directionY = -this.directionY;
		}

		// Now here's a lot of maths, but ill try and explain it
		// This first bit here is the difference between the mouse and the particle
		let dx = mouse.x - this.x;
		let dy = mouse.y - this.y;

		// With some trigonometry we can calculate the distance of the cursor to the particle
		let distance = Math.sqrt(dx * dx + dy * dy);

		// This just changes the movement if the mouse is near the particle. there are 4 if's to check which corner of the particle the mouse is in
		if (distance < mouse.radius + this.size) {
			if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
				this.x += 10;
			}
			if (mouse.x > this.x && this.x > this.size * 10) {
				this.x -= 10;
			}
			if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
				this.y += 10;
			}
			if (mouse.y > this.y && this.y > this.size * 10) {
				this.y -= 10;
			}
		}

		// This changes the position of the particle based on the direction value.
		this.x += this.directionX;
		this.y += this.directionY;
		this.draw();
	}
}

function init() {
	// The particles are all stored in this array.
	particlesArray = [];

	// Ohboi more maths?
	// The number of particles changes with the size of the canvas.
	let numberOfParticles = (canvas.height * canvas.width) / particleDivider;

	// This creates the particles 
	for (let i = 0; i < numberOfParticles; i++) {
		// This gives the particles a random size (with a minimum size of minimumParticleSize)
		let size = (Math.random() * 2) + minimumParticleSize;
		// Random position of the particle
		let x = (Math.random() * ((document.documentElement.clientWidth - size * 2) - (size * 2)) + size * 2);
		let y = (Math.random() * ((document.documentElement.clientHeight - size * 2) - (size * 2)) + size * 2);
		// This is the movement of the particle, we have '-2.5' at the end so the movement can also be negative :)
		let directionX = (Math.random() * particleSpeed) - (particleSpeed / 2);
		let directionY = (Math.random() * particleSpeed) - (particleSpeed / 2);
		// The colour of the particle, yes it can be random
		let colour = '#FFFFFF';

		// Creates a new particle with the values declared above
		particlesArray.push(new Particle(x, y, directionX, directionY, size, colour));
	}
}

function connect() {
	// Default value for the opacity of the lines, we are using opacity to prevent lines from flashing in and out of existence
	let opacityValue = 1;

	// Nested for loop that will loop trough all particles
	for (let i = 0; i < particlesArray.length; i++) {
		// For each particle itll check the position of all other particles and decide if they need a connection
		for (let j = 0; j < particlesArray.length; j++) {
			// More trigonomitry
			let distance = ((particlesArray[i].x - particlesArray[j].x) * (particlesArray[i].x - particlesArray[j].x))
				+ ((particlesArray[i].y - particlesArray[j].y) * (particlesArray[i].y - particlesArray[j].y));

			// We are using the size of the canvas to determine the length of the lines (to prevent weird line sizes on different screens)
			if (distance < (canvas.width / connectDivider) * (canvas.height / connectDivider)) {
				// Change the opacity based on the distance
				opacityValue = 1 - (distance / 20000);
				// Draws a line between the two dots
				ctx.strokeStyle = `rgb(255,255,255, ${opacityValue})`;
				ctx.lineWidth = 0.5;
				ctx.beginPath();
				ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
				ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
				ctx.stroke();
			}
		}
	}
}

// Animates the entire canvas
function animate() {
	requestAnimationFrame(animate);
	// Clears the canvas each frame
	ctx.clearRect(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);

	// Updates all particles
	for (let i = 0; i < particlesArray.length; i++) {
		particlesArray[i].update();
	}
	// Connects particles
	connect();
}

// When the user resizes the window, the canvas will automatically resize with it
window.addEventListener('resize',
	function () {
		canvas.width = innerWidth;
		canvas.height = innerHeight;
		mouse.radius = (canvas.height / mouseDivider) * (canvas.width / mouseDivider);
		// Calling init() again to regenerate all particles
		init();
	}
);

// Starts it all and animates it
init();
animate();

// If you have any questions about why I did something or if you have suggestions, feel free to contract me!


// This should fix ios viewheight because ew
document.body.height = window.innerHeight;