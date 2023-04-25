
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

import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {Color3, Color4} from "@babylonjs/core/Maths/math.color.js"
import {SceneLoader} from "@babylonjs/core/Loading/sceneLoader.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"
import {HemisphericLight} from "@babylonjs/core/Lights/hemisphericLight.js"
import {CascadedShadowGenerator} from "@babylonjs/core/Lights/Shadows/cascadedShadowGenerator.js"
import {SSAO2RenderingPipeline} from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/ssao2RenderingPipeline.js"
import {DefaultRenderingPipeline, DepthOfFieldEffectBlurLevel, TonemappingOperator} from "@babylonjs/core/PostProcesses/index.js"

import {NubDetail, NubEffectEvent} from "@benev/nubs"
import {BenevTheater} from "@benev/toolbox/x/babylon/theater/element.js"

import {loadGlb} from "./utils/babylon/load-glb.js"
import {setupPhysics} from "./physics/setup-physics.js"
import {toggleCameraView} from "./utils/toggle-camera-view.js"
import {spawn_physics_cube_near_physics_point} from "./utils/spawn-physics-cube.js"
import {TargetCamera} from "@babylonjs/core/Cameras/targetCamera.js"
import {make_character_capsule} from "./character-capsule/make_character_capsule.js"
import {load_level_and_setup_meshes_for_collision} from "./utils/load_level_and_setup_meshes_for_collision.js"
import {integrate_nubs_to_control_character_capsule} from "./character-capsule/integrate_nubs_to_control_character_capsule.js"
import {Robot_puppet} from "./utils/robot-puppet2.js"

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

	await setupPhysics(scene, [0, -9.81, 0])

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

	const lighting_assets = await loadGlb(scene, `https://dl.dropbox.com/s/f2b7lyw6vgpp9bl/lighting2.babylon`)

	const [light] = lighting_assets.lights
	const shadow_generator = light.getShadowGenerator() as CascadedShadowGenerator
	const shadow_map = shadow_generator.getShadowMap()!

	await load_level_and_setup_meshes_for_collision({
		url: `https://dl.dropbox.com/s/h7x05efphbi7l9j/humanoidconcept7.glb`, 
		scene,
		lighting: {
			light,
			shadows: {
				map: shadow_map,
				generator: shadow_generator,
			},
		},
	})

	const robot_puppet = new Robot_puppet(scene, [0,0,0])
	await robot_puppet.is_loaded

	integrate_nubs_to_control_character_capsule({
		nub_context: nubContext!,
		render_loop: renderLoop,
		speeds_for_movement: {
			slow: 1 / 50,
			base: 1 / 10,
			fast: 1 / 2,
		},
		look_sensitivity: {
			stick: 1 / 100,
			pointer: 1 / 200,
		},
		speeds_for_looking_with_keys_and_stick: {
			slow: 1 / 200,
			base: 1 / 25,
			fast: 1 / 5,
		},
		robot_puppet
	})

	const robot_upper = robot_puppet.upper!

	const character_camera = new TargetCamera(
		"first-cam", Vector3.Zero(), scene
	)
	character_camera.ignoreParentScaling = true
	character_camera.parent = robot_upper

	scene.activeCamera = character_camera
	const camera = scene.activeCamera

	toggleCameraView({
		robot_upper,
		character_camera,
	})

	camera.minZ = 1
	camera.maxZ = 500
	camera.fov = 1.2

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
			}

			{
				const ao_settings = 0.5
				const ao = new SSAO2RenderingPipeline("ssao", scene, ao_settings, [camera])
				ao.radius = 5
				ao.totalStrength = 0.5
				ao.base = 0.15
				ao.maxZ = 600
				ao.samples = 4
				ao.minZAspect = 0.5
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
			}
		
			{
				const ao_settings = 0.75
				const ao = new SSAO2RenderingPipeline("ssao", scene, ao_settings, [camera])
				ao.radius = 10
				ao.totalStrength = 1.5
				ao.base = 0.15
				ao.samples = 16
				ao.maxZ = 600
				ao.minZAspect = 0.5
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
		.listen(({detail}) => {
			const centerX = engine.getRenderWidth() / 2
			const centerY = engine.getRenderHeight() / 2
			const ray = scene.pick(centerX, centerY)
			const jump = detail.effect === "jump" && (detail as NubDetail.Key).pressed
			const crouch = detail.effect === "crouch" && (detail as NubDetail.Key).pressed
			const crouchEnd = detail.effect === "crouch" && !(detail as NubDetail.Key).pressed
			const isLeftClick = detail.effect === "primary" && (detail as NubDetail.Key).pressed
			const isRightClick = detail.effect === "secondary" && (detail as NubDetail.Key).pressed
			if (isRightClick && ray.pickedPoint && ray.pickedMesh?.name !== "box") {
				const surface_normal = ray.getNormal(true)!
				spawn_physics_cube_near_physics_point(
					scene, surface_normal, ray.pickedPoint, boxMaterial
				)
			}
			else if (isLeftClick && ray.pickedMesh?.name === "box") {
				const impulseForceDirection = new Vector3(
					ray.ray!.direction!.x * 5,
					ray.ray!.direction!.y * 5,
					ray.ray!.direction!.z * 5,
				)
				ray.pickedMesh.applyImpulse(
					impulseForceDirection,
					ray.pickedPoint!,
				)
			}
			if (jump) {
				robot_puppet.jump()
			}
			if (isLeftClick) {
				robot_puppet.shoot()
			}
			if (crouch) {
				robot_puppet.crouch()
			}
			if (crouchEnd) {
				robot_puppet.stand()
			}
		})

	console.log(`%c🤖 humanoid ready`, `color: green;`)
	resize(theater.settings.resolutionScale ?? 100)
	start()
}()
