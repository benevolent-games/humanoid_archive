
import "@babylonjs/core/Meshes/instancedMesh.js"
import "@babylonjs/core/Materials/standardMaterial.js"
import "@babylonjs/loaders/glTF/2.0/index.js"
import "@babylonjs/loaders/glTF/2.0/Extensions/KHR_draco_mesh_compression.js"
import "@babylonjs/core/Lights/Shadows/index.js"
import "@babylonjs/core/Culling/ray.js"

import {makeTheater} from "./utils/theater.js"
import {spawnCube} from "./utils/spawn-cube.js"
import {showCoolGlb} from "./utils/show-cool-glb.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"

void async function main() {
	console.log("🤖")
	
	const theater = makeTheater()
	window.addEventListener("resize", theater.onresize)
	
	document.querySelector("[data-loading]")!.remove()
	document.body.appendChild(theater.canvas)
	
	theater.onresize()
	theater.start()
	
	await showCoolGlb({
		...theater,
		url: `https://dl.dropbox.com/s/75bruebli9xg2l6/humanoid8.glb`,
	})

	await spawnCube(theater.scene, new Vector3(3, 1, 0))
}()
