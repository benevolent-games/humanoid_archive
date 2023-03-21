
import {Scene} from "@babylonjs/core/scene.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"
import {PhysicsImpostor} from "@babylonjs/core/Physics/v1/physicsImpostor.js"

export async function spawnPhysicsCube(
		scene: Scene,
		normal: Vector3,
		position: Vector3,
		material: PBRMaterial,
	) {

	const box = MeshBuilder.CreateBox("box", {
		size: 1.5,
	}, scene)

	box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, {
		mass: 3,
		friction: 0.5,
		restitution: 0.5,
	})

	const scaledNormal = normal.scale(5)
	const {x, y, z} = position
	const newPosition = new Vector3(x, y < 6 ? y+2 : 6, z).add(scaledNormal)

	box.position = newPosition
	box.material = material

	return box
}
