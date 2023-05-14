import {SolidParticleSystem} from "@babylonjs/core/Particles/solidParticleSystem.js"
import {Particle} from "./Particle.js"

export interface Sps extends SolidParticleSystem {
	recycleParticle: (p: Particle) => any
	updateParticle: (p: Particle) => any
	particles: Particle[] | any[]
}
