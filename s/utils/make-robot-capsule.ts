
import {Node} from "@babylonjs/core/node.js"
import {Scene} from "@babylonjs/core/scene.js"
import {V3} from "@benev/toolbox/x/utils/v3.js"
import {Nullable} from "@babylonjs/core/types.js"
import {Vector3} from "@babylonjs/core/Maths/math.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {PhysicsImpostor} from "@babylonjs/core/Physics/v1/physicsImpostor.js"
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial.js"


export function makeRobotCapsule(scene: Scene, root?: Nullable<Node> | undefined, position?: V3) {

	const material = new StandardMaterial("ccapsule", scene)
	material.alpha = 0.5

	const capsule = MeshBuilder.CreateCapsule("robot-capsule", {
		radius: 0.7,
		height: 3,
	}, scene)

	capsule.physicsImpostor = new PhysicsImpostor(capsule, PhysicsImpostor.CylinderImpostor, {
		mass: 3,
		friction: 1
	})

	capsule.material = material
	
	if(root) {root.parent = capsule}
	if (position) {capsule.position = new Vector3(...position)}

	return capsule
}
