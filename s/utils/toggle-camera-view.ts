
import {NubCauseEvent} from "@benev/nubs"
import {Scene} from "@babylonjs/core/scene.js"
import {TargetCamera} from "@babylonjs/core/Cameras/targetCamera.js"
import {Vector3} from "@babylonjs/core/Maths/math.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

export function toggleCameraView({
		character_camera, robot_upper
	}: {
		robot_upper: TransformNode
		character_camera: TargetCamera
	}) {

	enum CameraView {
		first_person,
		third_person,
	}

	let view = CameraView.first_person

	NubCauseEvent
		.target(window)
		.listen(({detail}) => {

			const toggle_key_is_pressed = (
				detail.kind === "key" &&
				detail.cause === "KeyX" &&
				detail.pressed
			)

			const {x, y, z} = robot_upper.position

			if (toggle_key_is_pressed) {
				if (view === CameraView.first_person) {
					character_camera.position = new Vector3(x, y + 1, z - 6)
					view = CameraView.third_person
				}
				else if(view === CameraView.third_person) {
					character_camera.position = new Vector3(x, y, z)
					view = CameraView.first_person
				}
			}
	})
}
