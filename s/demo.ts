
import "@benev/toolbox/x/html.js"

import "@babylonjs/core/Loading/Plugins/babylonFileLoader.js"
import "@babylonjs/loaders/glTF/2.0/Extensions/KHR_draco_mesh_compression.js"
import "@babylonjs/core/Materials/standardMaterial.js"
import "@babylonjs/core/Lights/Shadows/index.js"
import "@babylonjs/core/Meshes/instancedMesh.js"
import "@babylonjs/loaders/glTF/2.0/index.js"
import "@babylonjs/core/Culling/ray.js"

import "@babylonjs/core/PostProcesses/index.js"
import "@babylonjs/core/Rendering/index.js"

import {SSAO2RenderingPipeline} from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/ssao2RenderingPipeline.js"

import {makeRealmEcs} from "./realm/ecs.js"
import {spawnCube} from "./utils/spawn-cube.js"
import {showCoolGlb} from "./utils/show-cool-glb.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {BenevTheater} from "@benev/toolbox/x/babylon/theater/element.js"
import {makeSpectatorCamera} from "@benev/toolbox/x/babylon/camera/spectator-camera.js"
import {Color3, Color4} from "@babylonjs/core/Maths/math.color.js"

import {SceneLoader} from "@babylonjs/core/Loading/sceneLoader.js"
import {CascadedShadowGenerator} from "@babylonjs/core/Lights/Shadows/index.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {DefaultRenderingPipeline, DepthOfFieldEffectBlurLevel, TonemappingOperator} from "@babylonjs/core/PostProcesses/index.js"
import {DirectionalLight} from "@babylonjs/core/Lights/directionalLight.js"
import {HemisphericLight} from "@babylonjs/core/Lights/hemisphericLight.js"

void async function main() {
	document.querySelector("[data-loading]")!.remove()

	const theater = document.querySelector<BenevTheater>("benev-theater")!
	await theater.updateComplete

	const {
		nubContext,
		babylon: {
			renderLoop,
			engine,
			scene,
			resize,
			start,
		}
	} = theater

	if(!nubContext)
		throw new Error("nubContext not found")

	scene.clearColor = new Color4(1.0, 0.98, 0.95, 1.0)

	const ambient = 0.2
	scene.ambientColor = new Color3(ambient, ambient, ambient)

	SceneLoader.ShowLoadingScreen = false

	const lighting_assets = await showCoolGlb({scene, url: `https://dl.dropbox.com/s/f2b7lyw6vgpp9bl/lighting2.babylon`})
	const factory_assets = await showCoolGlb({scene, url: `https://dl.dropbox.com/s/fnndwk4lk3doy37/skyfactory.glb`})

	const [light] = lighting_assets.lights
	const shadow_generator = light.getShadowGenerator() as CascadedShadowGenerator
	const shadow_map = shadow_generator.getShadowMap()

	const true_factory_meshes = (
		factory_assets
			.meshes
			.filter(m => m instanceof Mesh)
	)

	for (const m of true_factory_meshes) {
		m.receiveShadows = true
		shadow_generator.addShadowCaster(m)
	}

	const camera = makeSpectatorCamera({
		scene,
		engine,
		nubContext,
		renderLoop,
		walk: 0.5,
		lookSensitivity: {
			stick: 1/50,
			mouse: 1/1_000,
		},
	})

	{
		const direction = new Vector3(0.8, 0.6, -0.9)
		const backlight = new HemisphericLight("backlight", direction, scene)
		backlight.intensity = 1
		backlight.diffuse = new Color3(1, 1, 1)
	}

	{
		shadow_generator.autoCalcDepthBounds = true
		shadow_generator.bias = 0.01
		shadow_generator.normalBias = 0
		camera.minZ = 1
		camera.maxZ = 500
	}

	{
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

		// pipeline.grainEnabled = true
		// pipeline.grain.intensity = 5
		// pipeline.grain.animated = true
	}

	{
		const ao_settings = 0.75
		// const ao_settings = {ssaoRatio: 0.75, blurRatio: 0.75, combineRatio: 1}
		const ao = new SSAO2RenderingPipeline("ssao", scene, ao_settings, [camera])
		ao.radius = 10
		ao.totalStrength = 1.5
		ao.base = 0.15
		ao.samples = 16
		ao.maxZ = 600
		ao.minZAspect = 0.5
		// SSAOPipeline.expensiveBlur = true;
	}

	// const box = await spawnCube(
	// 	scene,
	// 	new Vector3(3, 1, 0),
	// )
	
	const realm = makeRealmEcs<{
		count: number
	}>(({system}) => ({
		
		systems: [
			system()
			.label("counter")
			.selector(({count}) => ({count}))
			.executor(({count}) => {
				const newCount = count + 1
				return {count: newCount}
			}),
		]
	}))
	
	const id = realm.addEntity({count: 0})
	realm.executeSystems()
	// setInterval(realm.executeSystems, 1000)

	console.log("🤖 humanoid ready")
	resize(theater.settings.resolutionScale ?? 100)
	start()
}()
