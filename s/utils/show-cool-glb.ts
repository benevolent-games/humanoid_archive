
import {loadGlb} from "./babylon/load-glb.js"
import {Scene} from "@babylonjs/core/scene.js"
import {Color3} from "@babylonjs/core/Maths/math.color.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {TargetCamera} from "@babylonjs/core/Cameras/targetCamera.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"

import { Quaternion } from "@babylonjs/core/Maths/math.vector.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

import {V2} from "../utils/v2.js"
import * as v2 from "../utils/v2.js"
import {cap} from "../utils/numpty.js"
import {makeSpectatorCamera} from "./make-spectator-camera.js"

export async function showCoolGlb({url, scene, canvas}: {
		url: string
		scene: Scene
		canvas: HTMLCanvasElement
	}) {

	makeSpectatorCamera({scene})

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
