
import {Scene} from "@babylonjs/core/scene.js"
import {Ray} from "@babylonjs/core/Culling/ray.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {AbstractMesh} from "@babylonjs/core/Meshes/abstractMesh.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {Color3, Quaternion, Vector3} from "@babylonjs/core/Maths/math.js"
import {PhysicsImpostor} from "@babylonjs/core/Physics/v1/physicsImpostor.js"
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial.js"

import {v2, V2} from "@benev/toolbox/x/utils/v2.js"
import {V3, v3} from "@benev/toolbox/x/utils/v3.js"
import {add_to_look_vector_but_cap_vertical_axis} from "@benev/toolbox/x/babylon/flycam/utils/add_to_look_vector_but_cap_vertical_axis.js"

import {RailgunVFX} from "../utils/railgun-vfx.js"
import {BlasterVFX} from "../utils/blaster-vfx.js"
import {loadGlb} from "../utils/babylon/load-glb.js"
import {RocketLauncherVFX} from "../utils/rocket-launcher-vfx.js"

const material = new StandardMaterial("capsule")
material.alpha = 0.1

const laserMaterial = new StandardMaterial("laserMaterial")
laserMaterial.emissiveColor = Color3.Red()

export class Robot_puppet {
	#scene: Scene
	starting_position: V3 = v3.zero()
	current_look: V2 = v2.zero()
	is_loaded = this.#loadGlb()
	activeWeapon = 0
	capsule: Mesh
	railgun: RailgunVFX
	blaster: BlasterVFX
	rocketLauncher: RocketLauncherVFX
	#coater_transform_node: TransformNode
	#capsule_transform_node: TransformNode
	#is_base_mesh = (m: AbstractMesh) => m.name.startsWith("humanoid_base")


	constructor(scene: Scene, position: V3) {
		this.#scene = scene
		this.starting_position = position
		this.capsule = this.#makeCapsule(3, this.starting_position)
		this.rocketLauncher = new RocketLauncherVFX("rocket-launcher", {
			cache: 200
		}, scene)
		this.railgun = new RailgunVFX("railgun", {
			cache: 200
		}, scene)
		this.blaster = new BlasterVFX('blaster', {
			cache:200
		}, scene)
		this.#coater_transform_node = new TransformNode('robot-coaster', scene)
		this.#capsule_transform_node = new TransformNode('capsule', scene)
		this.#capsule_transform_node.parent = this.capsule
		this.is_loaded.then((m) => {
			m.meshes.forEach(
				(mesh) => {
					if (mesh.id.startsWith("collision"))
						mesh.visibility = 0
				}
			)
			const root = this.root as TransformNode
			root.position = new Vector3(0,-0.8,0)
			root.parent = this.capsule
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
		const {x, y, z} = this.capsule.position
		this.capsule.dispose(true)
		const new_capsule = this.#makeCapsule(capsule_height, [x, y, z])

		this.capsule = new_capsule
		this.#capsule_transform_node.parent = new_capsule
		this.root!.parent = this.capsule
		this.upper!.parent = this.#capsule_transform_node
		this.upper!.position.y = robot_upper_y
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

		const translation_considering_rotation = translation
			.applyRotationQuaternion(this.capsule.absoluteRotationQuaternion)
		this.capsule.position.addInPlace(translation_considering_rotation)
	}

	look(vector: V2) {
		const [x, y] = this.current_look
		this.current_look = add_to_look_vector_but_cap_vertical_axis(this.current_look, vector)

		this.capsule.rotationQuaternion = Quaternion
			.RotationYawPitchRoll(x, 0, 0)
		this.setVerticalAim(y)
	}

	shoot() {
		// const shootRay = new Ray(robotRightGun!.position, robotRightGun!.forward, 100)
		// const pick = this.#scene.pickWithRay(shootRay)
		const robotRightGun = this.upper?.getChildMeshes().find(m => m.name == "nocollision_spherebot_gunright1_primitive0")!
		const robotLeftGun = this.upper?.getChildMeshes().find(m => m.name == "nocollision_spherebot_gunleft1_primitive0")!
		const scene = this.#scene
		const engine = scene.getEngine();
		const pick = scene.pick(engine.getRenderWidth() / 2, engine.getRenderHeight() / 2)

		if (pick?.hit) {
			if (this.activeWeapon === 0)
				this.blaster.shootBlaster(this.blaster, scene, robotRightGun)
			else if (this.activeWeapon === 1) this.railgun.shootRailgun(this.railgun, scene, robotRightGun, pick.distance)
			else this.rocketLauncher.shootRocketLauncher(this.rocketLauncher, scene, robotRightGun, pick!.getNormal(true)!)
		}
	}

	jump() {
		const ray = new Ray(this.capsule.position, Vector3.Down(), 1.8)
		const pick = this.#scene.pickWithRay(ray, this.#is_base_mesh)

		if(pick?.hit)
			this.capsule.physicsImpostor?.applyImpulse(
				new Vector3(0, 20, 0),
				this.capsule.getAbsolutePosition()
			)
	}

	crouch() {
		this.#change_character_capsule({
			capsule_height: 2.2,
			robot_upper_y: 0.4,
		})
	}

	#is_something_above() {
		const ray = new Ray(this.capsule.getAbsolutePosition(), Vector3.Up(), 1.5)
		return this.#scene.pickWithRay(ray, this.#is_base_mesh)?.hit
	}

	switchWeapon() {
		this.activeWeapon += 1
		if(this.activeWeapon === 3) this.activeWeapon = 0
	}

	stand() {
		if(!this.#is_something_above()) {
			this.#change_character_capsule({
				capsule_height: 3,
				robot_upper_y: 0.8,
			})
		}
		else {
			const intervalId = setInterval(() => {
				if(!this.#is_something_above()) {
					this.#change_character_capsule({
						capsule_height: 3,
						robot_upper_y: 0.8,
					})
					clearInterval(intervalId)
				}
			}, 100)
		}
	}

	align_with_slope() {
		const [x, y] = this.current_look

		this.#coater_transform_node.rotationQuaternion = Quaternion
			.RotationYawPitchRoll(-x, 0, 0)

		const ray = new Ray(this.capsule.position ,Vector3.Down(), 1.8)
		const pick = this.#scene.pickWithRay(ray, this.#is_base_mesh)
		let slopeNormal = pick!.getNormal(true)!

		if (pick?.pickedMesh) {
			let direction = new Vector3(Math.cos(x), 0, Math.sin(x));
			let right = Vector3.Cross(slopeNormal, direction).normalize()
			direction = Vector3.Cross(right, slopeNormal).normalize()
			const up = Vector3.Cross(direction, right).normalize()
			this.coaster!.rotationQuaternion = Quaternion
				.RotationQuaternionFromAxis(right, up,direction)
		}
		if (this.coaster!.parent !== this.#coater_transform_node) {
			this.coaster!.parent = this.#coater_transform_node
			this.#coater_transform_node.parent = this.#capsule_transform_node
			this.coaster!.position = new Vector3(0, -1, 0)
		}
	}
}
