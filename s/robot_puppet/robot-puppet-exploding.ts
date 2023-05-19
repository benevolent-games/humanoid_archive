
import {Scene} from "@babylonjs/core/scene.js"
import {Color3, Vector3} from "@babylonjs/core/Maths/math.js"
import {AbstractMesh} from "@babylonjs/core/Meshes/abstractMesh.js"
import {PhysicsImpostor} from "@babylonjs/core/Physics/v1/physicsImpostor.js"
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial.js"

import {v2, V2} from "@benev/toolbox/x/utils/v2.js"

import {loadGlb} from "../utils/babylon/load-glb.js"
import {createPhysicsImpostor} from "../utils/create-physics-impostor.js"

const material = new StandardMaterial("capsule")
material.alpha = 0.1

const laserMaterial = new StandardMaterial("laserMaterial")
laserMaterial.emissiveColor = Color3.Red()

export class Robot_puppet_exploding {
	#scene: Scene
	current_look: V2 = v2.zero()
	is_loaded = this.#loadGlb()

	constructor(scene: Scene) {
		this.#scene = scene
		this.is_loaded.then((m) => {
			m.meshes.forEach(
				(mesh: AbstractMesh & {shootable?: boolean}) => {
						mesh.visibility = 0
				}
			)
		})
	}

	get upper() {
		return this.#scene.getTransformNodeByName("upper_dummy")
	}

	explode(position: Vector3) {
		this.is_loaded.then(m => {
			for (const mesh of m.meshes) {
				if (mesh.id.startsWith("collision")) mesh.visibility = 0
				else mesh.visibility = 1
				if (mesh.id.includes("collision")) {
					createPhysicsImpostor(this.#scene, mesh, PhysicsImpostor.BoxImpostor, { mass: 3, restitution: 0.9 }, true);
					mesh.setAbsolutePosition(position)
				}
				
			}
		})
	}

	get root() {
		return this.#scene.getTransformNodeByName("coaster_dummy")?.parent
	}

	get coaster() {
		return this.#scene.getTransformNodeByName("coaster_dummy")
	}

	async #loadGlb() {
		return await loadGlb(this.#scene, `https://dl.dropbox.com/s/0s5i2mon0qlxh2u/spherebot4.glb?dl=0`)
	}
}
