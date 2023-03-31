
import {Scene} from "@babylonjs/core/scene.js"
import {CascadedShadowGenerator} from "@babylonjs/core/Lights/Shadows/cascadedShadowGenerator.js"

import {LightingRig} from "./quality/types.js"
import {loadGlb} from "../utils/babylon/load-glb.js"

export async function setup_lighting({scene, enable_shadows}: {
		scene: Scene
		enable_shadows: boolean
	}): Promise<LightingRig> {

	const url = "https://dl.dropbox.com/s/f2b7lyw6vgpp9bl/lighting2.babylon"
	const lighting_assets = await loadGlb(scene, url)
	const [light] = lighting_assets.lights

	return {
		light,
		shadows: enable_shadows
			? (() => {
				const generator = light.getShadowGenerator() as CascadedShadowGenerator
				const map = generator.getShadowMap()!
				return {generator, map}
			})()
			: undefined,
	}
}
