
import {loadGlb} from "./babylon/load-glb.js"
import {Scene} from "@babylonjs/core/scene.js"
import {Color3} from "@babylonjs/core/Maths/math.color.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"
import {ArcRotateCamera} from "@babylonjs/core/Cameras/arcRotateCamera.js"

export async function showCoolGlb({url, scene, canvas}: {
		url: string
		scene: Scene
		canvas: HTMLCanvasElement
	}) {

	const camera = (() => {
		const name = "cam"
		const alpha = 0
		const beta = 0
		const radius = 3
		const target = new Vector3(0, 5, 0)
		const setActiveOnSceneIfNoneActive = true
		return new ArcRotateCamera(
			name,
			alpha,
			beta,
			radius,
			target,
			scene,
			setActiveOnSceneIfNoneActive,
		)
	})()

	camera.attachControl(canvas, true)
	camera.minZ = 0.5
	camera.maxZ = 500.0

	const assets = await loadGlb(scene, url)
	const meshes = new Set(assets.meshes)

	;[...meshes]
		.filter(m => m.name.startsWith("collision"))
		.forEach(m => {
			m.dispose()
			meshes.delete(m)
		})

	for (const material of assets.materials) {
		if (material instanceof PBRMaterial)
			material.ambientColor = new Color3(1, 1, 1)
	}
}
