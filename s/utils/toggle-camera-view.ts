
import {NubCauseEvent} from "@benev/nubs"
import {Scene} from "@babylonjs/core/scene.js"
import {TargetCamera} from "@babylonjs/core/Cameras/targetCamera.js"

export function toggleCameraView({
		scene, first_person_camera, third_person_camera,
	}: {
		scene: Scene
		first_person_camera: TargetCamera
		third_person_camera: TargetCamera
	}) {

	NubCauseEvent
		.target(window)
		.listen(({detail}) => {

			const toggle_key_is_pressed = (
				detail.kind === "key" &&
				detail.cause === "KeyX" &&
				detail.pressed
			)

			if (toggle_key_is_pressed)
				scene.activeCamera = scene.activeCamera === first_person_camera
					? third_person_camera
					: first_person_camera
	})
}
