
import {V3} from "@benev/toolbox/x/utils/v3.js"
import {v2, V2} from "@benev/toolbox/x/utils/v2.js"
import {add_to_look_vector_but_cap_vertical_axis} from "@benev/toolbox/x/babylon/flycam/utils/add_to_look_vector_but_cap_vertical_axis.js"

import {Scene} from "@babylonjs/core/scene.js"
import {Quaternion, Vector3} from "@babylonjs/core/Maths/math.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {PhysicsImpostor} from "@babylonjs/core/Physics/v1/physicsImpostor.js"
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial.js"


export function make_character_capsule({
		scene, position
	}: {
		scene: Scene
		position: V3
	}) {

	let current_look = v2.zero()

	const capsule = MeshBuilder.CreateCapsule("character-capsule", {
		radius: 1.2,
		height: 5,
	}, scene)

	// capsule.physicsImpostor = new PhysicsImpostor(capsule, PhysicsImpostor.CylinderImpostor, {
	// 	mass: 3,
	// 	friction: 1
	// })

	const material = new StandardMaterial("capsule", scene)
	material.alpha = 0.5

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
				.RotationYawPitchRoll(x, -y, 0)
		},
	}
}
