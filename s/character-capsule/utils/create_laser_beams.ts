import {Scene} from "@babylonjs/core/scene.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {AbstractMesh} from "@babylonjs/core/Meshes/abstractMesh.js"
import {PickingInfo} from "@babylonjs/core/Collisions/pickingInfo.js"
import {PhysicsImpostor} from "@babylonjs/core/Physics/v1/physicsImpostor.js"
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial.js"

export function create_laser_beams ({
		pick, robotRightGun, robotLeftGun, laserMaterial, scene
	}: {
		pick: PickingInfo
		robotRightGun: AbstractMesh
		robotLeftGun: AbstractMesh
		laserMaterial: StandardMaterial
		scene: Scene
	}) {

	const laserBeams = [
		MeshBuilder.CreateCylinder("laser", {height: 1, diameterTop: 0.025, diameterBottom: 0.025}),
		MeshBuilder.CreateCylinder("laser", {height: 1, diameterTop: 0.025, diameterBottom: 0.025})
	]

	laserBeams.forEach((laserBeam, i) => {
		laserBeam.material = laserMaterial
		laserBeam.rotation = new Vector3(1.6, 0, 0)
		i === 0
			? laserBeam.parent = robotRightGun!
			: laserBeam.parent = robotLeftGun!
		laserBeam.setParent(null)
		laserBeam.physicsImpostor = new PhysicsImpostor(
			laserBeam, PhysicsImpostor.CylinderImpostor,
			{mass: 0.1, restitution: 100, friction: 0}, scene)
		laserBeam.physicsImpostor?.setLinearVelocity(
			pick.pickedPoint?.scale(20)!
		)
	})

	return laserBeams
}
