
import {V3} from "@benev/toolbox/x/utils/v3.js"

import {Scene} from "@babylonjs/core/scene.js"
import {Vector3} from "@babylonjs/core/Maths/math.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {PhysicsImpostor} from "@babylonjs/core/Physics/v1/physicsImpostor.js"
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial.js"
import {v2, V2} from "@benev/toolbox/x/utils/v2.js"


export function make_character_capsule({scene, position}: {
		scene: Scene
		position: V3
	}) {

	const material = new StandardMaterial("ccapsule", scene)
	material.alpha = 0.5

	const capsule = MeshBuilder.CreateCapsule("robot-capsule", {
		radius: 1.2,
		height: 5,
	}, scene)

	capsule.physicsImpostor = new PhysicsImpostor(capsule, PhysicsImpostor.CylinderImpostor, {
		mass: 3,
		friction: 1
	})

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
	}
}
