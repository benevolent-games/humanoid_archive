
import {Scene} from "@babylonjs/core/scene.js"
import {Color3} from "@babylonjs/core/Maths/math.color.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"
import {PhysicsImpostor} from "@babylonjs/core/Physics/v1/physicsImpostor.js"

export async function spawnPhysicsCube(
		scene: Scene,
		position: Vector3
	) {

	const material = new PBRMaterial("mat", scene)
	material.albedoColor = new Color3(1, 0, 0)
	material.ambientColor = new Color3(1, 1, 1)
	material.roughness = 0.5
	material.metallic = 0.5

	const box = MeshBuilder.CreateBox("box", {
		size: 1.5,
	}, scene)

	box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, {
		mass: 3,
		restitution: 0.5
	})

	box.position = position
	box.material = material

	return box
}
