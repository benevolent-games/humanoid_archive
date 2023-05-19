import {Scene} from "@babylonjs/core/scene.js"
import {AbstractMesh} from "@babylonjs/core/Meshes/abstractMesh.js"
import {PhysicsImpostor, PhysicsImpostorParameters} from "@babylonjs/core/Physics/v1/physicsImpostor.js"

export const createPhysicsImpostor = function (
	scene: Scene,
	entity: AbstractMesh,
	impostor: number,
	options: PhysicsImpostorParameters,
	reparent: boolean) {
		if (entity == null) return
		entity.checkCollisions = false
		const parent = entity.parent
		if (reparent === true) entity.parent = null
		entity.physicsImpostor = new PhysicsImpostor(entity, impostor, options, scene)
		if (reparent === true) entity.parent = parent
}
