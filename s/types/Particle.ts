import {Vector3} from "@babylonjs/core/Maths/math.js"
import {SolidParticle} from "@babylonjs/core/Particles/solidParticle.js"

export interface Particle extends SolidParticle {
	parent: number
	type: number
	scaleUp: number
	scaleMax: number
	scaleDown: number
	timer: number
	pow2Count: number
	textureCellSize: number
	animationSpeed: number
	lastFrame: number
	animationStep: number
	frameID: number
	direction: Vector3
	speed: number
	drop: number
	drag: number
	range: number
	distance: number
	subEmitRate: number
	subEmitTick: number
	distanceDelta: number
}
