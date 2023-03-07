
import "@benev/toolbox/x/html.js"

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

void async function main() {
	document.querySelector("[data-loading]")!.remove()

	const theater = document.querySelector<BenevTheater>("benev-theater")!
	await theater.updateComplete

	const {
		nubContext,
		babylon: {
			renderLoop,
			engine,scene,
			resize, start}
	} = theater

	if(!nubContext)
		throw new Error("nubContext not found")

	await showCoolGlb({
		scene,
		engine,
		renderLoop,
		nubContext,
		// url: `/assets/humanoid8.glb`,
		url: `https://dl.dropbox.com/s/75bruebli9xg2l6/humanoid8.glb`,
	})

	const box = await spawnCube(
		scene,
		new Vector3(3, 1, 0),
	)
	
	const realm = makeRealmEcs<{
		count: number
	}>(({system}) => ({
		
		systems: [
			system()
			.label("counter")
			.selector(({count}) => ({count}))
			.executor(({count}) => {
				const newCount = count + 1
				console.log("COUNT", newCount)
				return {count: newCount}
			}),
		]
	}))
	
	const id = realm.addEntity({count: 0})
	realm.executeSystems()
	// setInterval(realm.executeSystems, 1000)
	
	console.log("🤖 humanoid ready")
	resize()
	start()
}()
