
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

	
	const six_inches = 0.1524
	const square_root_of_3 = 1.732
	const cube_width = box.scaling.x * box.getBoundingInfo().maximum.x
	const max_size_across_cube_diagonally = cube_width * square_root_of_3
	const distance_from_surface = six_inches + (max_size_across_cube_diagonally / 2)

	const {x, y, z} = position
	const newPosition = new Vector3(
		normal.x < 0 ? x - distance_from_surface :
		normal.x > 0 ? x + distance_from_surface : x,
		
		normal.y < 0 ? y - distance_from_surface :
		normal.y > 0 ? y + distance_from_surface : y,
		
		normal.z < 0 ? z - distance_from_surface :
		normal.z > 0 ? z + distance_from_surface : z
	)

	box.position = newPosition
	box.material = material

	return box
}
