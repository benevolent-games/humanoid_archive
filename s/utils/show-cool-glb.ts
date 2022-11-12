
import {loadGlb} from "./babylon/load-glb.js"
import {Scene} from "@babylonjs/core/scene.js"
import {Color3} from "@babylonjs/core/Maths/math.color.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"
import {ArcRotateCamera} from "@babylonjs/core/Cameras/arcRotateCamera.js"
import {FlyCamera} from "@babylonjs/core/Cameras/flyCamera.js"
import {UniversalCamera} from "@babylonjs/core/Cameras/universalCamera.js"
import {TargetCamera} from "@babylonjs/core/Cameras/targetCamera.js"

export async function showCoolGlb({url, scene, canvas}: {
		url: string
		scene: Scene
		canvas: HTMLCanvasElement
	}) {

	const camera = (() => {
		const name = "cam"
		const position = new Vector3(0, 0, 0)
		return new UniversalCamera(name, position, scene)
	})()

	camera.attachControl(canvas, true)
	camera.minZ = 0.5
	camera.speed = 0.75
	camera.angularSensibility = 4000

	camera.keysUp.push(87)
	camera.keysLeft.push(65)
	camera.keysDown.push(83)
	camera.keysRight.push(68)

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
