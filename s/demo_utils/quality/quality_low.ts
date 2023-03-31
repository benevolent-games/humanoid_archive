
import {QualityOptions} from "./types.js"
import {setup_lighting} from "../setup_lighting.js"

export async function quality_low({scene, theater}: QualityOptions) {
	theater.settings.resolutionScale = 50
	return setup_lighting({scene, enable_shadows: true})
}
