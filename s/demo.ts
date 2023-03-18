
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

import {NubEffectEvent} from "@benev/nubs"
import {makeRealmEcs} from "./realm/ecs.js"
import {loadMapGlb} from "./utils/load-map-glb.js"
import {setupPhysics} from "./physics/setup-physics.js"

import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {Color3, Color4} from "@babylonjs/core/Maths/math.color.js"
import {BenevTheater} from "@benev/toolbox/x/babylon/theater/element.js"
import {makeSpectatorCamera} from "@benev/toolbox/x/babylon/camera/spectator-camera.js"

import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {spawnPhysicsCube} from "./utils/spawn-physics-cube.js"
import {SceneLoader} from "@babylonjs/core/Loading/sceneLoader.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"
import {HemisphericLight} from "@babylonjs/core/Lights/hemisphericLight.js"
import {PhysicsImpostor} from "@babylonjs/core/Physics/v1/physicsImpostor.js"
import {CascadedShadowGenerator} from "@babylonjs/core/Lights/Shadows/index.js"
import {DefaultRenderingPipeline, DepthOfFieldEffectBlurLevel, TonemappingOperator} from "@babylonjs/core/PostProcesses/index.js"


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

	const gravity = new Vector3(0, -9.81, 0)
	await setupPhysics(scene, gravity)

	const {hash} = window.location
	const quality = (
		hash.startsWith("#quality=")
			? hash.match(/^#quality=(.*)$/)![1]
			: "low"
	) ?? "low"

	scene.clearColor = new Color4(1.0, 0.98, 0.95, 1.0)

	const ambient = 0.2
	scene.ambientColor = new Color3(ambient, ambient, ambient)

	SceneLoader.ShowLoadingScreen = false

	const lighting_assets = await loadMapGlb({scene, url: `https://dl.dropbox.com/s/f2b7lyw6vgpp9bl/lighting2.babylon`})
	const {
		assets: factory_assets,
		collision_meshes,
		noCollision_meshes
	} = await loadMapGlb({scene, url: `https://dl.dropbox.com/s/h7x05efphbi7l9j/humanoidconcept7.glb`})
	// const {assets: factory_assets, collision_meshes} = await loadMapGlb({scene, url: `/assets/temp/humanoidconcept7.glb`})

	const [light] = lighting_assets.assets.lights
	const shadow_generator = light.getShadowGenerator() as CascadedShadowGenerator
	const shadow_map = shadow_generator.getShadowMap()

	const regular_meshes = (
		factory_assets
			.meshes
			.filter(m => m instanceof Mesh)
	)

	for (const m of [...regular_meshes, ...noCollision_meshes]) {
		m.receiveShadows = true
		shadow_generator.addShadowCaster(m)
	}

	for (const m of regular_meshes) {
		m.physicsImpostor = new PhysicsImpostor(m, PhysicsImpostor.MeshImpostor, {
			mass: 0,
			friction: 0.5,
			restitution: 0.3,
		})
	}

	for (const m of collision_meshes) {
		m.isVisible = false
		m.physicsImpostor = new PhysicsImpostor(m, PhysicsImpostor.MeshImpostor, {
			mass: 0,
			friction: 0.4,
			restitution: 0.5
		}, scene)
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
		camera.minZ = 1
		camera.maxZ = 500
	}

	{
		const direction = new Vector3(0.8, 0.6, -0.9)
		const backlight = new HemisphericLight("backlight", direction, scene)
		backlight.intensity = 1
		backlight.diffuse = new Color3(1, 1, 1)
	}

	switch (quality) {
		case "low":
			theater.settings.resolutionScale = 50
			break

		case "medium":
			// {
			// 	shadow_generator.autoCalcDepthBounds = true
			// 	shadow_generator.bias = 0.01
			// 	shadow_generator.normalBias = 0
			// }

			{
				const pipeline = new DefaultRenderingPipeline("default", false, scene, [camera])

				pipeline.fxaaEnabled = true
				pipeline.samples = 4

				pipeline.bloomEnabled = true
				pipeline.bloomThreshold = 0.6;
				pipeline.bloomWeight = 0.3;
				pipeline.bloomKernel = 32;
				pipeline.bloomScale = 0.2;

				pipeline.depthOfFieldEnabled = true
				pipeline.depthOfFieldBlurLevel = DepthOfFieldEffectBlurLevel.Low
				pipeline.depthOfField.focusDistance = 100 * 1000
				pipeline.depthOfField.focalLength = 50
				pipeline.depthOfField.fStop = 1.4

				// pipeline.imageProcessingEnabled = true
				// pipeline.imageProcessing.vignetteEnabled = true
				// pipeline.imageProcessing.vignetteWeight = 0.75
				// pipeline.imageProcessing.toneMappingEnabled = true
				// pipeline.imageProcessing.toneMappingType = TonemappingOperator.Photographic

				// pipeline.grainEnabled = true
				// pipeline.grain.intensity = 5
				// pipeline.grain.animated = true
			}

			{
				const ao_settings = 0.5
				// const ao_settings = {ssaoRatio: 0.75, blurRatio: 0.75, combineRatio: 1}
				const ao = new SSAO2RenderingPipeline("ssao", scene, ao_settings, [camera])
				ao.radius = 5
				ao.totalStrength = 0.5
				ao.base = 0.15
				ao.maxZ = 600
				ao.samples = 4
				ao.minZAspect = 0.5
				// ao.expensiveBlur = false;
			}
			break

		case "high":
			{
				shadow_generator.autoCalcDepthBounds = true
				shadow_generator.bias = 0.01
				shadow_generator.normalBias = 0
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
			break
	}

	const boxMaterial = (() => {
		const material = new PBRMaterial("mat", scene)
		material.albedoColor = new Color3(1, 0, 0)
		material.ambientColor = new Color3(1, 1, 1)
		material.roughness = 0.5
		material.metallic = 0.5

		return material
	})()

	NubEffectEvent.target(window)
		.listen(e => {
			const centerX = engine.getRenderWidth() / 2
			const centerY = engine.getRenderHeight() / 2
			const ray = scene.pick(centerX, centerY)

			const isLeftClick = e.detail.effect === "primary"
			const isRightClick = e.detail.effect === "secondary"

			if (isRightClick && ray.pickedPoint && ray.pickedMesh?.name !== "box") {
				const normal = ray.getNormal(true)!
				spawnPhysicsCube(scene, normal, ray.pickedPoint, boxMaterial)
			}
			else if (isLeftClick && ray.pickedMesh?.name === "box") {
				ray.pickedMesh.applyImpulse(new Vector3(0, 5, 0), ray.pickedPoint!);
			}
		})



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
