
import {Scene} from "@babylonjs/core/scene.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {Color3} from "@babylonjs/core/Maths/math.color.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"
import {PhysicsImpostor} from "@babylonjs/core/Physics/v1/physicsImpostor.js"

import {loadGlb} from "./babylon/load-glb.js"
import {LightingRig} from "../demo_utils/quality/types.js"

export async function load_level_and_setup_meshes_for_collision({
		url, scene, lighting,
	}: {
		url: string
		scene: Scene
		lighting: LightingRig
	}) {

	const assets = await loadGlb(scene, url)
	const meshes = assets.meshes.filter(m => m instanceof Mesh) as Mesh[]

	const physics_impostor_settings = {
		mass: 0,
		friction: 2,
		restitution: 0.3
	}

	function disable_visibility(mesh: Mesh) {
		mesh.isVisible = false
	}

	function enable_shadows(mesh: Mesh) {
		if (lighting.shadows) {
			mesh.receiveShadows = true
			lighting.shadows.generator.addShadowCaster(mesh)
		}
	}

	function enable_physics(mesh: Mesh & {shootable?: boolean}) {
		mesh.physicsImpostor = new PhysicsImpostor(mesh,
			PhysicsImpostor.MeshImpostor,
			physics_impostor_settings,
			scene
		);
		mesh.shootable = true
	}

	for (const mesh of meshes) {
		if (mesh.name.startsWith("collision")) {
			disable_visibility(mesh)
			enable_physics(mesh)
		}
		else if (mesh.name.startsWith("nocollision")) {
			enable_shadows(mesh)
		}
		else {
			enable_shadows(mesh)
			enable_physics(mesh)
		}
	}

	for (const material of assets.materials) {
		if (material instanceof PBRMaterial)
			material.ambientColor = new Color3(1, 1, 1)
	}
}
