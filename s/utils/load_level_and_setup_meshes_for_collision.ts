
import {Scene} from "@babylonjs/core/scene.js"
import {Color3} from "@babylonjs/core/Maths/math.color.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"
import {PhysicsImpostor} from "@babylonjs/core/Physics/v1/physicsImpostor.js"
import {CascadedShadowGenerator} from "@babylonjs/core/Lights/Shadows/cascadedShadowGenerator.js"

import {loadGlb} from "./babylon/load-glb.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"

export async function load_level_and_setup_meshes_for_collision({
		url, scene, shadow_generator
	}: {
		url: string
		scene: Scene
		shadow_generator: CascadedShadowGenerator
	}) {

	const assets = await loadGlb(scene, url)
	const meshes = assets.meshes
		.filter(m => m instanceof Mesh)

	const physics_impostor_settings = {
		mass: 0,
		friction: 2,
		restitution: 0.3
	}

	meshes
		.filter(m => !m.name.includes("collision"))
		.forEach(m => {
			m.receiveShadows = true
			shadow_generator.addShadowCaster(m)
			m.physicsImpostor = new PhysicsImpostor(m,
				PhysicsImpostor.MeshImpostor,
				physics_impostor_settings,
				scene
			)
		})

	meshes
		.filter(m => m.name.startsWith("collision"))
		.forEach(m => {
			m.isVisible = false
			m.physicsImpostor = new PhysicsImpostor(m,
				PhysicsImpostor.MeshImpostor,
				physics_impostor_settings,
				scene
				)
		})

	meshes
		.filter(m => m.name.startsWith("nocollision"))
		.forEach(m => {
			m.receiveShadows = true
			shadow_generator.addShadowCaster(m)
		})

	for (const material of assets.materials) {
		if (material instanceof PBRMaterial)
			material.ambientColor = new Color3(1, 1, 1)
	}

}
