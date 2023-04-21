
import {Scene} from "@babylonjs/core/scene.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

import {loadGlb} from "./babylon/load-glb.js"
import {v2, V2} from "@benev/toolbox/x/utils/v2.js"
import {V3, v3} from "@benev/toolbox/x/utils/v3.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {PhysicsImpostor} from "@babylonjs/core/Physics/v1/physicsImpostor.js"
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial.js"
import {Color3, Quaternion, Vector3} from "@babylonjs/core/Maths/math.js"
import {add_to_look_vector_but_cap_vertical_axis} from "@benev/toolbox/x/babylon/flycam/utils/add_to_look_vector_but_cap_vertical_axis.js"
import {Ray} from "@babylonjs/core/Culling/ray.js"
import {create_laser_beams} from "../character-capsule/utils/create_laser_beams.js"
import {AbstractMesh} from "@babylonjs/core/Meshes/abstractMesh.js"

const material = new StandardMaterial("capsule")
material.alpha = 0.1

const laserMaterial = new StandardMaterial("laserMaterial")
laserMaterial.emissiveColor = Color3.Red()

export class Robot_puppet {
	#scene: Scene
	starting_position: V3 = v3.zero()
	current_look: V2 = v2.zero()
	is_loaded = this.#loadGlb()
	#capsule: Mesh


	constructor(scene: Scene, position: V3) {
		this.#scene = scene
		this.starting_position = position
		this.#capsule = this.#makeCapsule(3, this.starting_position)

		this.is_loaded.then((m) => {
			m.meshes.forEach(
				(mesh) => {
					if (mesh.id.startsWith("collision"))
						mesh.visibility = 0
				}
			)
			const root = this.root as TransformNode
			root.position = new Vector3(0,-0.8,0)
			root.parent = this.#capsule
			})
	}

	async #loadGlb() {
		return await loadGlb(this.#scene, `https://dl.dropbox.com/s/ka0uunak8h9fts5/spherebot3_1.glb`)
	}

	#change_character_capsule({
			capsule_height, robot_upper_y
		}: {
			capsule_height: number
			robot_upper_y: number
		}) {
		const {x, y, z} = this.#capsule.position
		this.#capsule.dispose(true)
		const standing_capsule = this.#makeCapsule(capsule_height, [x, y, z])
		standing_capsule.physicsImpostor?.physicsBody.setAngularFactor(0)
		this.#capsule = standing_capsule
		this.root!.parent = this.#capsule
		this.upper!.position = new Vector3(0, robot_upper_y, 0)
	}

	#makeCapsule(height: number, position: V3) {
		const capsule = MeshBuilder.CreateCapsule("robot-capsule", {
			radius: 0.8,
			height,
			updatable: true,
		}, this.#scene)
		capsule.position = new Vector3(...position)
		capsule.physicsImpostor = new PhysicsImpostor(capsule, PhysicsImpostor.MeshImpostor, {
			mass: 3,
			friction: 2,
			restitution: 0,
		})
		capsule.physicsImpostor.physicsBody.setAngularFactor(0)
		capsule.material = material
		return capsule
	}

	get upper() {
		return this.#scene.getTransformNodeByName("upper")
	}

	get coaster() {
		return this.#scene.getTransformNodeByName("coaster")
	}

	get root() {
		return this.#scene.getTransformNodeByName("coaster")?.parent
	}

	setVerticalAim(y: number) {
		if (this.upper) {
			this.upper.rotationQuaternion = Quaternion.RotationYawPitchRoll(
				0, -y, 0,
			)
		}
	}

	move(vector: V2) {
		const [x, z] = vector
		const translation = new Vector3(x, 0, z)
		const activeCapsule = this.#capsule

		const translation_considering_rotation = translation
			.applyRotationQuaternion(activeCapsule!.absoluteRotationQuaternion)
		activeCapsule!.position.addInPlace(translation_considering_rotation)
	}

	look(vector: V2) {
		const [x, y] = this.current_look
		const activeCapsule = this.#capsule
		this.current_look = add_to_look_vector_but_cap_vertical_axis(this.current_look, vector)

		activeCapsule!.rotationQuaternion = Quaternion
			.RotationYawPitchRoll(x, 0, 0)
		this.setVerticalAim(y)
	}

	shoot() {
		const robotRightGun = this.upper?.getChildMeshes().find(m => m.name == "nocollision_spherebot_gunright1_primitive0")!
		const robotLeftGun = this.upper?.getChildMeshes().find(m => m.name == "nocollision_spherebot_gunleft1_primitive0")!

		const shootRay = new Ray(robotRightGun!.position, robotRightGun!.forward, 100)
		const pick = this.#scene.pickWithRay(shootRay)
		const scene = this.#scene

		if (pick?.hit) {
			const laserBeams = create_laser_beams({
				pick, robotLeftGun, robotRightGun, scene, laserMaterial
			})
			const removeLaserBeam = setTimeout(() =>
				laserBeams.forEach(laserBeam => laserBeam.dispose()), 500)
			return () => clearTimeout(removeLaserBeam)
		}
	}

	jump() {
		const activeCapsule = this.#capsule
		const predicate = (m: AbstractMesh) => m.name.startsWith("humanoid_base")
		const ray = new Ray(new Vector3(
			activeCapsule.position.x,
			activeCapsule.position.y,
			activeCapsule.position.z), Vector3.Down(), 1.8)
		const pick = this.#scene.pickWithRay(ray, predicate)

		if(pick?.hit)
			activeCapsule.physicsImpostor?.applyImpulse(
				new Vector3(0, 20, 0),
				activeCapsule.getAbsolutePosition()
			)
	}

	crouch() {
		this.#change_character_capsule({
			capsule_height: 2.2,
			robot_upper_y: 1.2,
		})
	}

	stand() {
		this.#change_character_capsule({
			capsule_height: 3,
			robot_upper_y: 1.6,
		})
	}
}
