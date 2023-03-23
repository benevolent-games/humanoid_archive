
import {V3} from "@benev/toolbox/x/utils/v3.js"
import {v2, V2} from "@benev/toolbox/x/utils/v2.js"
import {add_to_look_vector_but_cap_vertical_axis} from "@benev/toolbox/x/babylon/flycam/utils/add_to_look_vector_but_cap_vertical_axis.js"

import {Scene} from "@babylonjs/core/scene.js"
import {Quaternion, Vector3} from "@babylonjs/core/Maths/math.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
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

	return {
		capsule,

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
