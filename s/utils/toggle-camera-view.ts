import {NubCauseEvent, NubDetail} from "@benev/nubs"

import {Scene} from "@babylonjs/core/scene.js"
import {TargetCamera} from "@babylonjs/core/Cameras/targetCamera.js"

export function toggleCameraView(
		{scene, first_person_camera, third_person_camera
	}: {
		scene: Scene
		first_person_camera: TargetCamera
		third_person_camera: TargetCamera
	}) {

	NubCauseEvent.target(window)
		.listen(({detail}) => {
			const toggleKeyPressed = detail.cause === "KeyX" && (detail as NubDetail.Key).pressed
			if (toggleKeyPressed)
				if (scene.activeCamera!.id === "first-cam")
					scene.activeCamera = third_person_camera
					else scene.activeCamera = first_person_camera
	})
}
