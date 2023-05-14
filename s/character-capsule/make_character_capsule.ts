
import {V3} from "@benev/toolbox/x/utils/v3.js"
import {v2, V2} from "@benev/toolbox/x/utils/v2.js"
import {add_to_look_vector_but_cap_vertical_axis} from "@benev/toolbox/x/babylon/flycam/utils/add_to_look_vector_but_cap_vertical_axis.js"

import {Scene} from "@babylonjs/core/scene.js"
import {Ray} from "@babylonjs/core/Culling/ray.js"
import {AbstractMesh} from "@babylonjs/core/Meshes/abstractMesh.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {Color3, Quaternion, Vector3} from "@babylonjs/core/Maths/math.js"
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial.js"

import {BlasterVFX} from "../utils/blaster-vfx.js"
import {RailgunVFX} from "../utils/railgun-vfx.js"
import {RobotPuppet} from "../utils/robot-puppet.js"
import {RocketLauncherVFX} from "../utils/rocket-launcher-vfx.js"
import {active_capsule_manager} from "./utils/active_capsule_manager.js"

export function make_character_capsule({
		scene, position, robot_puppet
	}: {
		scene: Scene
		position: V3
		robot_puppet: RobotPuppet
	}) {

	let current_look = v2.zero()
	let capsuleTransformNode = new TransformNode("capsule-node", scene)
	let robotCoasterParent = new TransformNode("capsule-node", scene)

	const {
		makeStandingCapsuleActive,
		makeCrouchingCapsuleActive,
		getActiveCapsule
	} = active_capsule_manager({capsuleTransformNode, scene})
	const initialCapsule = makeStandingCapsuleActive()
	initialCapsule.position = new Vector3(...position)

	const predicate = (m: AbstractMesh) => m.name.startsWith("humanoid_base")
	const robotRightGun = robot_puppet.upper?.getChildMeshes().find(m => m.name == "nocollision_spherebot_gunright1_primitive0")!
	const robotLeftGun = robot_puppet.upper?.getChildMeshes().find(m => m.name == "nocollision_spherebot_gunleft1_primitive0")!
	const laserMaterial = new StandardMaterial("laserMaterial", scene)
	laserMaterial.emissiveColor = Color3.Red()
	let isSomethingAboveChecker: null | number = null
	// let activeWeapon = 0

	// const blast = new BlasterVFX('blaster', {
	// 		cache:200
	// }, scene)
	// const railgun = new RailgunVFX("railgun", {
	// 	cache: 200
	// }, scene)
	// const rocketLauncher = new RocketLauncherVFX("rocket-launcher", {
	// 	cache: 200
	// }, scene)

	return {
		capsuleTransformNode,
		// shoot() {
		// 	// const shootRay = new Ray(robotRightGun!.position, robotRightGun!.forward, 100)
		// 	// const pick = scene.pickWithRay(shootRay)
		// 	const engine = scene.getEngine();
		// 	const pick = scene.pick(engine.getRenderWidth() / 2, engine.getRenderHeight() / 2);
		// 	if (pick?.hit) {
		// 		const activeCapsule = getActiveCapsule()!
		// 		if (activeWeapon === 0)
		// 			blast.shootBlaster(blast, scene, robotRightGun, activeCapsule)
		// 		else if (activeWeapon === 1) railgun.shootRailgun(railgun, scene, robotRightGun, activeCapsule, pick.distance)
		// 		else rocketLauncher.shootRocketLauncher(rocketLauncher, scene, robotRightGun, pick!.getNormal(true)!)
		// 	}
		// },
		// switchWeapon() {
		// 	activeWeapon += 1
		// 	if(activeWeapon === 3) activeWeapon = 0
		// },
		// jump() {
		// 	const activeCapsule = getActiveCapsule()
		// 	const ray = new Ray(new Vector3(
		// 		activeCapsule!.position.x,
		// 		activeCapsule!.position.y,
		// 		activeCapsule!.position.z), Vector3.Down(), 1.8)
		// 	const pick = scene.pickWithRay(ray, predicate)
		// 	if(pick?.hit)
		// 		activeCapsule!.physicsImpostor?.applyImpulse(
		// 			new Vector3(0, 20, 0), activeCapsule!.getAbsolutePosition()
		// 		)
		// },
		// crouch() {
		// 	makeCrouchingCapsuleActive()
		// 	robot_puppet.upper!.position = new Vector3(0, 1.2, 0)
		// },
		// stand() {
		// 	const activeCapsule = getActiveCapsule()
		// 	const ray = new Ray(activeCapsule!.getAbsolutePosition(), Vector3.Up(), 1.5)
		// 	const isSomethingAbove = scene.pickWithRay(ray, predicate)?.hit
		// 	if (!isSomethingAbove) {
		// 		makeStandingCapsuleActive()
		// 		robot_puppet.upper!.position = new Vector3(0, 1.6, 0)
		// 	} else {
		// 		if (!isSomethingAboveChecker) {
		// 			isSomethingAboveChecker = setInterval(() => {
		// 				const activeCapsule = getActiveCapsule()
		// 				const ray = new Ray(activeCapsule!.getAbsolutePosition(), Vector3.Up(), 1.5)
		// 				const isSomethingAbove = scene.pickWithRay(ray, predicate)?.hit
		// 				if (!isSomethingAbove) {
		// 					makeStandingCapsuleActive()
		// 					robot_puppet.upper!.position = new Vector3(0, 1.6, 0)
		// 					clearInterval(isSomethingAboveChecker!)
		// 					isSomethingAboveChecker = null
		// 				}
		// 			}, 100)
		// 		}
		// 	}
		// },
		add_move(vector: V2) {
			const [x, z] = vector
			const translation = new Vector3(x, 0, z)
			const activeCapsule = getActiveCapsule()

			const translation_considering_rotation = translation
				.applyRotationQuaternion(activeCapsule!.absoluteRotationQuaternion)
			activeCapsule!.position.addInPlace(translation_considering_rotation)
		},

		add_look(vector: V2) {
			const [x, y] = current_look
			const activeCapsule = getActiveCapsule()
			current_look = add_to_look_vector_but_cap_vertical_axis(current_look, vector)

			activeCapsule!.rotationQuaternion = Quaternion
				.RotationYawPitchRoll(x, 0, 0)
			robot_puppet.setVerticalAim(y)

			// code about aligning robot coaster to slope
			robotCoasterParent.rotationQuaternion = Quaternion
				.RotationYawPitchRoll(-x, 0, 0)
			const ray = new Ray(new Vector3(activeCapsule!.position.x, activeCapsule!.position.y, activeCapsule!.position.z), Vector3.Down(), 1.8)
			const pick = scene.pickWithRay(ray, predicate)
			let slopeNormal = pick!.getNormal(true)!
			if (pick?.pickedMesh) {
				let direction = new Vector3(Math.cos(x), 0, Math.sin(x));
				let right = Vector3.Cross(slopeNormal, direction).normalize()
				direction = Vector3.Cross(right, slopeNormal).normalize()
				const up = Vector3.Cross(direction, right).normalize()
				robot_puppet.coaster!.rotationQuaternion = Quaternion
					.RotationQuaternionFromAxis(right, up,direction)
			}
			if (robot_puppet.coaster!.parent != robotCoasterParent) {
				robot_puppet.coaster!.parent = robotCoasterParent
				robotCoasterParent.parent = capsuleTransformNode
				robot_puppet.coaster!.position = new Vector3(0, -1, 0)
			}
		},
	}
}
