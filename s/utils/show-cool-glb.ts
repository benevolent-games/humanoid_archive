
import {loadGlb} from "./babylon/load-glb.js"
import {Scene} from "@babylonjs/core/scene.js"
import {Engine} from "@babylonjs/core/Engines/engine.js"
import {Color3} from "@babylonjs/core/Maths/math.color.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"
import {wirePointerLockAttribute} from "./wire-pointer-lock-attribute.js"

import {makeSpectatorCamera} from "@benev/toolbox/x/babylon/camera/spectator-camera.js"


export async function showCoolGlb({url, scene, engine, renderLoop}: {
		url: string
		scene: Scene 
		engine: Engine
		renderLoop: Set<() => void>
	}) {

	wirePointerLockAttribute(document.body, "data-pointer-lock")
	makeSpectatorCamera({
		walk: 0.7,
		engine,
		scene,
		renderLoop,
		lookSensitivity: {
			stick: 1/50,
			mouse: 1/1_000,
		}
	})

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
