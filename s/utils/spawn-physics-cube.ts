
import {Scene} from "@babylonjs/core/scene.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"
import {PhysicsImpostor} from "@babylonjs/core/Physics/v1/physicsImpostor.js"

export async function spawn_physics_cube_near_physics_point(
		scene: Scene,
		surface_normal: Vector3,
		surface_point: Vector3,
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

	const new_position = surface_point.add(
		surface_normal.scale(distance_from_surface)
	)

	box.position = new_position
	box.material = material;
	(box as Mesh & {shootable: boolean}).shootable = true
	return box
}
