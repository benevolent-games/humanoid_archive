
import {Scene} from "@babylonjs/core/scene.js"
import {Color3} from "@babylonjs/core/Maths/math.color.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"

import {loadGlb} from "./babylon/load-glb.js"

export async function loadMapGlb({url, scene}: {
		url: string
		scene: Scene
	}) {

	const assets = await loadGlb(scene, url)
	const meshes = new Set(assets.meshes)
	const mesh_array = [...meshes]

	const collision_meshes = mesh_array.filter(
		m => m.name.startsWith("collision")
	)

	const noCollision_meshes = mesh_array.filter(
		m => m.name.startsWith("nocollision")
	)

	mesh_array
		.filter(m => m.name.includes("collision"))
		.forEach(m => {
			m.dispose()
			meshes.delete(m)
		})

	for (const material of assets.materials) {
		if (material instanceof PBRMaterial)
			material.ambientColor = new Color3(1, 1, 1)
	}

	return {assets, collision_meshes, noCollision_meshes}
}
