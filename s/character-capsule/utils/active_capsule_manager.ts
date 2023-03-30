import {Scene} from "@babylonjs/core/scene.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {PhysicsImpostor} from "@babylonjs/core/Physics/v1/physicsImpostor.js"
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial.js"

export function active_capsule_manager({
		capsuleTransformNode, scene
	}: {
		capsuleTransformNode: TransformNode
		scene: Scene
	}) {
	let activeCapsule: Mesh | null = null
	const material = new StandardMaterial("capsule", scene)
	material.alpha = 0.1

	return {
		getActiveCapsule: () => activeCapsule,
		makeCrouchingCapsuleActive() {
			const crouchingCapsule = MeshBuilder.CreateCapsule("robot-capsule", {
				radius: 0.80,
				height: 2.2,
				updatable: true,
			}, scene)
			crouchingCapsule.physicsImpostor = new PhysicsImpostor(crouchingCapsule, PhysicsImpostor.MeshImpostor, {
				mass: 3,
				friction: 2,
				restitution: 0,
			})
			capsuleTransformNode.parent = crouchingCapsule
			crouchingCapsule.physicsImpostor.physicsBody.setAngularFactor(0)
			crouchingCapsule.material = material
			if (activeCapsule) crouchingCapsule.position = activeCapsule?.position
			activeCapsule?.dispose()
			activeCapsule = crouchingCapsule
			return crouchingCapsule
		},
		makeStandingCapsuleActive() {
			let standingCapsule = MeshBuilder.CreateCapsule("robot-capsule", {
					radius: 0.80,
					height: 3,
					updatable: true,
				}, scene)
			standingCapsule.physicsImpostor = new PhysicsImpostor(standingCapsule, PhysicsImpostor.MeshImpostor, {
				mass: 3,
				friction: 2,
				restitution: 0,
			})
			standingCapsule.physicsImpostor.physicsBody.setAngularFactor(0)
			capsuleTransformNode.parent = standingCapsule
			standingCapsule.material = material
			if (activeCapsule) standingCapsule.position = activeCapsule.position
			activeCapsule?.dispose()
			activeCapsule = standingCapsule
			return standingCapsule
		}
	}
}
