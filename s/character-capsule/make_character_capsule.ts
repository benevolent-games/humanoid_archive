
import {V3} from "@benev/toolbox/x/utils/v3.js"
import {v2, V2} from "@benev/toolbox/x/utils/v2.js"
import {add_to_look_vector_but_cap_vertical_axis} from "@benev/toolbox/x/babylon/flycam/utils/add_to_look_vector_but_cap_vertical_axis.js"

import {Scene} from "@babylonjs/core/scene.js"
import {Ray} from "@babylonjs/core/Culling/ray.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {AbstractMesh} from "@babylonjs/core/Meshes/abstractMesh.js"
import {Color3, Quaternion, Vector3} from "@babylonjs/core/Maths/math.js"
import {PhysicsImpostor} from "@babylonjs/core/Physics/v1/physicsImpostor.js"
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial.js"
import {RobotPuppet} from "../utils/robot-puppet.js"


export function make_character_capsule({
		scene, position, robot_puppet
	}: {
		scene: Scene
		position: V3
		robot_puppet: RobotPuppet
	}) {

	let current_look = v2.zero()

	const capsule = MeshBuilder.CreateCapsule("robot-capsule", {
		radius: 0.80,
		height: 3,
	}, scene)

	capsule.physicsImpostor = new PhysicsImpostor(capsule, PhysicsImpostor.MeshImpostor, {
		mass: 3,
		friction: 2,
		restitution: 0,
	})

	capsule.physicsImpostor.physicsBody.setAngularFactor(0)

	const material = new StandardMaterial("capsule", scene)
	material.alpha = 0.1

	capsule.material = material
	capsule.position = new Vector3(...position)

	const ray = new Ray(new Vector3(capsule.position.x, capsule.position.y, capsule.position.z), Vector3.Down(), 1.8)
	const predicate = (m: AbstractMesh) => m.name.startsWith("humanoid_base")

	const robotGun = robot_puppet.upper?.getChildMeshes().find(m => m.name == "nocollision_spherebot_gunright1_primitive0")
	const shootRay = new Ray(robotGun!.getAbsolutePosition(), robotGun!.forward, 100)
	const laserMaterial = new StandardMaterial("laserMaterial", scene)
	laserMaterial.diffuseColor = Color3.Red()

	return {
		capsule,
		shoot() {
			shootRay.origin = new Vector3(robotGun!.position.x, robotGun!.position.y, robotGun!.position.z)
			shootRay.direction = robotGun!.forward!
			const pick = scene.pickWithRay(shootRay)
			if (pick?.hit) {
				const laserBeam = MeshBuilder.CreateCylinder("laser", {height: 2, diameterTop: 0.025, diameterBottom: 0.025});
				laserBeam.material = laserMaterial
				laserBeam.rotation = new Vector3(1.6,0,0)
				laserBeam.parent = robotGun!
				laserBeam.setParent(null)
				laserBeam.physicsImpostor = new PhysicsImpostor(laserBeam, PhysicsImpostor.CylinderImpostor, {mass: 0.1, restitution: 10, friction: 0}, scene)
				laserBeam.physicsImpostor?.setLinearVelocity(
					pick.pickedPoint?.scale(50)!
				)
				const removeLaserBeam = setTimeout(() => laserBeam.dispose(), 500)
				return () => clearTimeout(removeLaserBeam)
			}
		},
		jump() {
			ray.origin = new Vector3(capsule.position.x, capsule.position.y, capsule.position.z)
			const pick = scene.pickWithRay(ray, predicate)
			if(pick?.hit)
				capsule.physicsImpostor?.applyImpulse(
					new Vector3(0, 20, 0), capsule.getAbsolutePosition()
				)
		},
		add_move(vector: V2) {
			const [x, z] = vector
			const translation = new Vector3(x, 0, z)

			const translation_considering_rotation = translation
				.applyRotationQuaternion(capsule.absoluteRotationQuaternion)

			capsule.position.addInPlace(translation_considering_rotation)
		},

		add_look(vector: V2) {
			current_look = add_to_look_vector_but_cap_vertical_axis(current_look, vector)
			const [x, y] = current_look
			capsule.rotationQuaternion = Quaternion
				.RotationYawPitchRoll(x, 0, 0)
			robot_puppet.setVerticalAim(y)
		},
	}
}
