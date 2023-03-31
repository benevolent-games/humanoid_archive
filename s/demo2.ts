
import {v3} from "@benev/toolbox/x/utils/v3.js"
import {TargetCamera} from "@babylonjs/core/Cameras/targetCamera.js"
import {BenevTheater} from "@benev/toolbox/x/babylon/theater/element.js"

import {setupPhysics} from "./physics/setup-physics.js"
import {get_quality_from_hash} from "./demo_utils/quality/get_quality_from_hash.js"
import {apply_quality_setting} from "./demo_utils/quality/apply_quality_setting.js"
import {setup_babylon_scene_basics} from "./demo_utils/setup_babylon_scene_basics.js"
import {load_level_and_setup_meshes_for_collision} from "./utils/load_level_and_setup_meshes_for_collision.js"

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

	setup_babylon_scene_basics({
		scene,
		colors: {
			background: [1.0, 0.98, 0.95, 1.0],
			ambient: [0.2, 0.2, 0.2],
		},
	})

	const camera = new TargetCamera(
		"camera",
		v3.toBabylon([0, 5, 0]),
		scene,
	)

	camera.minZ = 1
	camera.maxZ = 500
	camera.fov = 1.2

	const lighting = await apply_quality_setting({
		scene,
		camera,
		theater,
		quality: get_quality_from_hash(window.location.hash),
	})

	await setupPhysics(scene, [0, -9.81, 0])

	await load_level_and_setup_meshes_for_collision({
		scene,
		lighting,
		url: "https://dl.dropbox.com/s/h7x05efphbi7l9j/humanoidconcept7.glb",
	})
}()
