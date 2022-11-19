
import {V2} from "../utils/v2.js"
import * as v2 from "../utils/v2.js"
import {cap} from "../utils/numpty.js"
import {Scene} from "@babylonjs/core/scene.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import { Quaternion } from "@babylonjs/core/Maths/math.vector.js"
import {TargetCamera} from "@babylonjs/core/Cameras/targetCamera.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

export function makeSpectatorCamera({scene}: {
		scene: Scene
	}) {

	const camParent = new TransformNode("camT", scene)
	const camera = (() => {
		const name = "cam"
		const position = new Vector3(0, 5, 0)
		return new TargetCamera(name, position, scene)
	})()

	camera.minZ = 0.3
	camera.maxZ = 20_000
	camera.parent = camParent
	camera.ignoreParentScaling = true
	// camera.fov = 1

	const mouseSensitivity = 1 / 5_0
	let currentLook = v2.zero()

	function lookAdd(vector: V2) {
		const radian = Math.PI / 2
		currentLook = v2.add(currentLook, vector)
		currentLook[1] = cap(currentLook[1], -radian, radian)
	}

	function addMouseforce(mouseforce: V2) {
		lookAdd(v2.multiplyBy(mouseforce, mouseSensitivity))
	}

	return {
		camera,
		rotateCamera(vectors: V2) {
			addMouseforce(vectors)
			const [x, y] = currentLook
			camera.rotationQuaternion = Quaternion.RotationYawPitchRoll(
				0, -y, 0,
			)
			camParent.rotationQuaternion = Quaternion.RotationYawPitchRoll(
				x, 0, 0
			)
		}
	}
}
