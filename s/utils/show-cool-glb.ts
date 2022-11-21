
import {loadGlb} from "./babylon/load-glb.js"
import {Scene} from "@babylonjs/core/scene.js"
import {Color3} from "@babylonjs/core/Maths/math.color.js"
import {makeSpectatorCamera} from "./make-spectator-camera.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"

import {NubContext} from "@benev/nubs"
import {walker} from "./walker.js"

export async function showCoolGlb({url, scene, canvas, renderLoop}: {
		url: string
		scene: Scene
		canvas: HTMLCanvasElement
		renderLoop: Set<() => void>
	}) {

	const walk = 1
	const sprint = walk * 2

	const cam = makeSpectatorCamera({scene})
	const nubContext: InstanceType <typeof NubContext> = document.querySelector("nub-context")!

	renderLoop.add(() => {
		const lookVector = nubContext.actions.vector2.look?.vector
		if(lookVector) {
			cam.rotateCamera(lookVector)
		}

		const moveVector = nubContext.actions.vector2.move?.vector
		const isPressed = {
			forward: !!nubContext.actions.key.forward?.pressed,
			backward: !!nubContext.actions.key.backward?.pressed,
			leftward: !!nubContext.actions.key.leftward?.pressed,
			rightward: !!nubContext.actions.key.rightward?.pressed,
		}

		const walking = walker({
			walk,
			sprint,
			isPressed,
			moveVector
		})

		cam.moveCam(walking.getForce())
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
