
import {Scene} from "@babylonjs/core/scene.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {Color3, Vector3} from "@babylonjs/core/Maths/math.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {AbstractMesh} from "@babylonjs/core/Meshes/abstractMesh.js"
import {PhysicsImpostor} from "@babylonjs/core/Physics/v1/physicsImpostor.js"
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial.js"

import {v2, V2} from "@benev/toolbox/x/utils/v2.js"
import {V3, v3} from "@benev/toolbox/x/utils/v3.js"

import {loadGlb} from "../utils/babylon/load-glb.js"

const material = new StandardMaterial("capsule")
material.alpha = 0.1

const laserMaterial = new StandardMaterial("laserMaterial")
laserMaterial.emissiveColor = Color3.Red()

export class Robot_puppet_dummy {
	#scene: Scene
	starting_position: V3 = v3.zero()
	current_look: V2 = v2.zero()
	is_loaded = this.#loadGlb()
	capsule: Mesh
	health = 100

	constructor(scene: Scene, position: V3) {
		this.#scene = scene
		this.starting_position = position
		this.capsule = this.#makeCapsule(3, this.starting_position)
		this.is_loaded.then((m) => {
			m.meshes.forEach(
				(mesh: AbstractMesh & {shootable?: boolean}) => {
					if (mesh.id.startsWith("collision"))
						mesh.visibility = 0
						mesh.shootable = true
				}
			)
			const root = this.root as AbstractMesh
			root.position = new Vector3(0,-0.8,0)
			root.parent = this.capsule
		})
	}

	get upper() {
		return this.#scene.getTransformNodeByName("upper_dummy")
	}

	get getHealth() {
		return this.health
	}

	set setHealth(health: number) {
		this.health = health
	}

	get isDead() {
		return this.health === 0
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

	#makeCapsule(height: number, position: V3) {
		const capsule = MeshBuilder.CreateCapsule("robot-dummy-capsule", {
			radius: 0.8,
			height,
			updatable: true,
		}, this.#scene)
		capsule.position = new Vector3(...position)
		capsule.physicsImpostor = new PhysicsImpostor(capsule, PhysicsImpostor.MeshImpostor, {
			mass: 3,
			friction: 0.5,
			restitution: 0.5,
		});
		(capsule as Mesh & {shootable: boolean}).shootable = true
		capsule.physicsImpostor.physicsBody.setAngularFactor(0)
		capsule.material = material
		return capsule
	}
}
