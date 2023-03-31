
import {TonemappingOperator} from "@babylonjs/core/PostProcesses/tonemapPostProcess.js"
import {DepthOfFieldEffectBlurLevel} from "@babylonjs/core/PostProcesses/depthOfFieldEffect.js"
import {SSAO2RenderingPipeline} from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/ssao2RenderingPipeline.js"
import {DefaultRenderingPipeline} from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline.js"

import {QualityOptions} from "./types.js"
import {setup_lighting} from "../setup_lighting.js"

export async function quality_high({
		scene,
		camera,
	}: QualityOptions) {

	const pipeline = new DefaultRenderingPipeline("default", true, scene, [camera])

	pipeline.fxaaEnabled = true
	pipeline.samples = 8

	pipeline.bloomEnabled = true
	pipeline.bloomThreshold = 0.8;
	pipeline.bloomWeight = 0.3;
	pipeline.bloomKernel = 256;
	pipeline.bloomScale = 0.5;

	pipeline.depthOfFieldEnabled = true
	pipeline.depthOfFieldBlurLevel = DepthOfFieldEffectBlurLevel.Low
	pipeline.depthOfField.focusDistance = 100 * 1000
	pipeline.depthOfField.focalLength = 50
	pipeline.depthOfField.fStop = 1.4

	pipeline.imageProcessingEnabled = true
	pipeline.imageProcessing.vignetteEnabled = true
	pipeline.imageProcessing.vignetteWeight = 0.75
	pipeline.imageProcessing.toneMappingEnabled = true
	pipeline.imageProcessing.toneMappingType = TonemappingOperator.Photographic

	const ao_settings = 0.75
	// const ao_settings = {ssaoRatio: 0.75, blurRatio: 0.75, combineRatio: 1}
	const ao = new SSAO2RenderingPipeline("ssao", scene, ao_settings, [camera])
	ao.samples = 32
	ao.radius = 10
	ao.totalStrength = 1.5
	ao.base = 0.15
	ao.maxZ = 600
	ao.minZAspect = 0.5
	ao.expensiveBlur = true

	const lighting = await setup_lighting({scene, enable_shadows: true})
	const shadows = lighting.shadows!
	shadows.generator.autoCalcDepthBounds = true
	shadows.generator.bias = 0.01
	shadows.generator.normalBias = 0

	return lighting

}
