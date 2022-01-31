// code from: MauritsWilke big credits to them for helping

const random = (min, max) => Math.random() * (max - min) + min;
const urlParams = new URLSearchParams(window.location.search);
const settings = {
	mouseDivider: 100,
	connnectionRadius: 120,
	particleDivider: 9000,
	minParticleSize: 2,
	maxParticleSize: 3,
	particleSpeed: 0.8,
	maxParticles: 500,
	noCard: urlParams.has('noCard'),
	noMouse: urlParams.has('noMouse'),
	noClick: urlParams.has('noClick'),
	colour: urlParams.get('colour') === "random" ? `rgb(${Math.floor(random(0, 255))}, ${Math.floor(random(0, 255))}, ${Math.floor(random(0, 255))})` : urlParams.get('colour')
}
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = document.documentElement.clientWidth || document.body.clientWidth;;
canvas.height = document.documentElement.clientHeight || document.body.clientHeight;;
window.addEventListener('resize', () => {
	[canvas.width, canvas.height] = [innerWidth, innerHeight];
	mouse.radius = (canvas.height / settings.mouseDivider) * (canvas.width / settings.mouseDivider);
	update();
});

let particles = new Set();
let mouse = {
	x: null,
	y: null,
	radius: (canvas.height / settings.mouseDivider) * (canvas.width / settings.mouseDivider),
	lastMoved: 0
}

if (!settings.noMouse) window.addEventListener('mousemove', (event) => { if (!event.shiftKey) [mouse.x, mouse.y, mouse.lastMoved] = [event.pageX, event.pageY, Date.now()] });
if (!settings.noMouse) window.addEventListener('mouseout', () => [mouse.x, mouse.y] = [null, null]);
if (!settings.noClick) {
	['dblclick', 'touchstart'].forEach(e => window.addEventListener(e, (event) => {
		let [posX, posY] = [0, 0]
		if (event.type === "touchstart") {
			const evt = (typeof event.originalEvent === 'undefined') ? event : event.originalEvent;
			const touch = evt.touches[0] || evt.changedTouches[0];
			[posX, posY] = [touch.pageX, touch.pageY]
		} else { [posX, posY] = [event.pageX, event.pageY] }
		particles.forEach(particle => {
			if (Math.hypot(particle.pos[0] - posX, particle.pos[1] - posY) < mouse.radius * 3) {
				particle.vel = [Math.atan2(particle.pos[1] - posY, particle.pos[0] - posX), 4.5]
			}
		})
	}));
}

class Particle {
	constructor(pos, vel, size, colour) {
		this.pos = pos || [random(0, canvas.width), random(0, canvas.height)];
		this.vel = vel || [random(0, Math.PI * 2), settings.particleSpeed];
		this.size = size || random(settings.minParticleSize, settings.maxParticleSize);
		this.colour = colour || settings.colour || "rgb(255,255,255)";
		this.velStrive = this.vel[1];
	}

	draw() {
		ctx.beginPath();
		ctx.arc(this.pos[0], this.pos[1], this.size, 0, Math.PI * 2);
		ctx.fillStyle = this.colour;
		ctx.fill();
	}

	update() {
		if (this.vel[1] > this.velStrive) this.vel[1] -= 0.04
		if (this.vel[1] < this.velStrive) this.vel[1] = this.velStrive;
		const displacement = 10;
		const distance = Math.hypot(mouse.x - this.pos[0], mouse.y - this.pos[1]);
		if (!settings.noMouse && mouse.x && Date.now() - mouse.lastMoved < 300 && distance < mouse.radius + this.size) {
			if (mouse.x < this.pos[0] && this.pos[0] < canvas.width - this.size * 10) this.pos[0] += displacement;
			if (mouse.x > this.pos[0] && this.pos[0] > this.size * 10) this.pos[0] -= displacement;
			if (mouse.y < this.pos[1] && this.pos[1] < canvas.height - this.size * 10) this.pos[1] += displacement;
			if (mouse.y > this.pos[1] && this.pos[1] > this.size * 10) this.pos[1] -= displacement;
		}

		if (this.pos[0] + this.size > canvas.width || this.pos[0] - this.size < 0) this.vel[0] = Math.PI - this.vel[0] + random(-0.3, 0.3);
		if (this.pos[1] + this.size > canvas.height || this.pos[1] - this.size < 0) this.vel[0] = this.vel[0] * -1 + random(-0.3, 0.3);
		this.pos = [this.pos[0] + Math.cos(this.vel[0]) * this.vel[1], this.pos[1] + Math.sin(this.vel[0]) * this.vel[1]];
		this.draw();
		this.connect();
	}

	connect() {
		particles.forEach(particle => {
			const distance = Math.hypot(particle.pos[1] - this.pos[1], particle.pos[0] - this.pos[0])
			if (distance < settings.connnectionRadius) {
				ctx.strokeStyle = this.colour.replace(")", `, ${1 - distance / settings.connnectionRadius})`);
				ctx.beginPath();
				ctx.moveTo(this.pos[0], this.pos[1]);
				ctx.lineTo(particle.pos[0], particle.pos[1]);
				ctx.stroke();
			}
		})
	}
}

function init() {
	particles = new Set();
	let numberOfParticles = Math.round((canvas.height * canvas.width) / settings.particleDivider);
	while (particles.size < numberOfParticles && particles.size <= settings.maxParticles) particles.add(new Particle())
}

function animate() {
	requestAnimationFrame(animate);
	ctx.clearRect(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
	particles.forEach(particle => particle.update());
}

function update() {
	const newAmount = Math.round((canvas.height * canvas.width) / settings.particleDivider);
	if (particles.size > newAmount) particles = new Set([...Array.from(particles)].slice(0, newAmount))
	if (particles.size < newAmount) while (particles.size < newAmount && particles.size <= settings.maxParticles) particles.add(new Particle())

	particles.forEach(particle => {
		if (particle.pos[0] + particle.size > canvas.width || particle.pos[0] - particle.size < 0 || particle.pos[1] + particle.size > canvas.height || particle.pos[1] - particle.size < 0) particle.pos = [random(0, canvas.width), random(0, canvas.height)]
	});
}

init();
animate();
document.body.height = window.innerHeight;
document.body.width = window.innerWidth;

window.onload = () => { if (settings.noCard) document.getElementById('container').remove() };
