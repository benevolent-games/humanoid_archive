
import {Scene} from "@babylonjs/core/scene.js"
import {Vector3} from "@babylonjs/core/Maths/math.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {PhysicsImpostor} from "@babylonjs/core/Physics/v1/physicsImpostor.js"
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial.js"


export function makeRobotCapsule(scene: Scene) {

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
	capsule.position = new Vector3(0, 5, 8)

	return capsule
}
