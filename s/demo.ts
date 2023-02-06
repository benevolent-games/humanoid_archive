
import "@babylonjs/core/Meshes/instancedMesh.js"
import "@babylonjs/core/Materials/standardMaterial.js"
import "@babylonjs/loaders/glTF/2.0/index.js"
import "@babylonjs/loaders/glTF/2.0/Extensions/KHR_draco_mesh_compression.js"
import "@babylonjs/core/Lights/Shadows/index.js"
import "@babylonjs/core/Culling/ray.js"

import {makeRealmEcs} from "./realm/ecs.js"
import {spawnCube} from "./utils/spawn-cube.js"
import {showCoolGlb} from "./utils/show-cool-glb.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {registerElements} from "@chasemoskal/magical"
import {getElements} from "@benev/toolbox/x/babylon/theater/get-elements.js"
import {BenevTheater} from "@benev/toolbox/x/babylon/theater/element.js"



void async function main() {
	registerElements(getElements())

	const benevTheather = document.querySelector<BenevTheater>("benev-theater")
	const theater = benevTheather?.babylon!
	
	document.querySelector("[data-loading]")!.remove()
	
	// theater.onresize()
	theater.start()
	
	await showCoolGlb({
		...theater,
		// url: `/assets/humanoid8.glb`,
		url: `https://dl.dropbox.com/s/75bruebli9xg2l6/humanoid8.glb`,
	})

	const box = await spawnCube(
		theater.scene,
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
}()
