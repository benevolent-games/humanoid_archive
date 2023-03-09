
import "@benev/toolbox/x/html.js"

import "@babylonjs/core/Loading/Plugins/babylonFileLoader.js"
import "@babylonjs/loaders/glTF/2.0/Extensions/KHR_draco_mesh_compression.js"
import "@babylonjs/core/Materials/standardMaterial.js"
import "@babylonjs/core/Lights/Shadows/index.js"
import "@babylonjs/core/Meshes/instancedMesh.js"
import "@babylonjs/loaders/glTF/2.0/index.js"
import "@babylonjs/core/Culling/ray.js"

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
		walk: 0.7,
		lookSensitivity: {
			stick: 1/50,
			mouse: 1/1_000,
		},
	})

	{
		shadow_generator.autoCalcDepthBounds = true
		shadow_generator.bias = 0.01
		shadow_generator.normalBias = 0
		camera.minZ = 1
		camera.maxZ = 500
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
