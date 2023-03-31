
import {Scene} from "@babylonjs/core/scene.js"
import {Light} from "@babylonjs/core/Lights/light.js"
import {Camera} from "@babylonjs/core/Cameras/camera.js"
import {BenevTheater} from "@benev/toolbox/x/babylon/theater/element.js"
import {CascadedShadowGenerator} from "@babylonjs/core/Lights/Shadows/cascadedShadowGenerator.js"
import {RenderTargetTexture} from "@babylonjs/core/Materials/Textures/renderTargetTexture.js"

export type QualityOptions = {
	scene: Scene
	camera: Camera
	quality: string
	theater: BenevTheater
}

export type LightingRig = {
	light: Light
	shadows?: {
		map: RenderTargetTexture
		generator: CascadedShadowGenerator
	}
}
