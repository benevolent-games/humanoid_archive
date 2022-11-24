
import {V2} from "../utils/v2.js"
import {walker} from "./walker.js"
import * as v2 from "../utils/v2.js"
import {cap} from "../utils/numpty.js"
import {Scene} from "@babylonjs/core/scene.js"
import {Nub, NubAction, NubContext} from "@benev/nubs"
import {Engine} from "@babylonjs/core/Engines/engine.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import { Quaternion } from "@babylonjs/core/Maths/math.vector.js"
import {TargetCamera} from "@babylonjs/core/Cameras/targetCamera.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

export function makeSpectatorCamera({
		scene, engine, renderLoop
	}: {
		scene: Scene
		engine: Engine
		renderLoop: Set<() => void>
	}) {

	const walk = 0.7
	const sprint = walk * 2
	const lookSensitivity = {
		stick: 1/50,
		mouse: 1/1_000,
	}

	const transformA = new TransformNode("camA", scene)
	const transformB = new TransformNode("camB", scene)
	const camera = (() => {
		const name = "cam"
		const position = new Vector3(0, 0, 0)
		return new TargetCamera(name, position, scene)
	})()

	camera.minZ = 0.3
	camera.maxZ = 20_000
	camera.ignoreParentScaling = true

	camera.parent = transformB
	transformB.parent = transformA

	let currentLook = v2.zero()

	function lookAdd(vector: V2) {
		const radian = Math.PI / 2
		currentLook = v2.add(currentLook, vector)
		currentLook[1] = cap(currentLook[1], -radian, radian)
	}

	function addMouseforce(mouseforce: V2, mouseSensitivity: number) {
		lookAdd(v2.multiplyBy(mouseforce, mouseSensitivity))
	}

	function rotateCamera(vectors: V2, mouseSensitivity: number) {
		addMouseforce(vectors, mouseSensitivity)
		const [x, y] = currentLook
		transformB.rotationQuaternion = Quaternion.RotationYawPitchRoll(
			0, -y, 0,
		)
		transformA.rotationQuaternion = Quaternion.RotationYawPitchRoll(
			x, 0, 0
		)
	}

	function moveCam(vector: V2) {
		const [x, z] = vector
		const translation = new Vector3(x, 0, z)
		const newPosition = translation.applyRotationQuaternion(
			transformB.absoluteRotationQuaternion
		)
		transformA.position.addInPlace(newPosition)
	}

	type NubContext = InstanceType <typeof NubContext>
	const nubContext: NubContext = document.querySelector("nub-context")!

	nubContext.addEventListener(NubAction.eventName, (e) => {
		const event = <NubAction>e
		if (event.detail.type === Nub.Type.Mouse) {
			const [x, y] = event.detail.movement
			const vector: V2 = [x, -y]
			if(document.pointerLockElement)
				rotateCamera(vector, lookSensitivity.mouse)
		}
	})

	renderLoop.add(() => {
		const leftCLick = !!nubContext.actions.key.primary?.pressed
		const rightClick = !!nubContext.actions.key.secondary?.pressed

		if(leftCLick && !document.pointerLockElement)
			engine.enterPointerlock()

		if(rightClick && document.pointerLockElement)
			engine.exitPointerlock()

		const lookVector = nubContext.actions.vector2.look?.vector
		if(lookVector) {
			rotateCamera(lookVector, lookSensitivity.stick)
		}

		const moveVector = nubContext.actions.vector2.move?.vector
		const isPressed = {
			forward: !!nubContext.actions.key.forward?.pressed,
			backward: !!nubContext.actions.key.backward?.pressed,
			leftward: !!nubContext.actions.key.leftward?.pressed,
			rightward: !!nubContext.actions.key.rightward?.pressed,
		}

		const walking = walker({
			walk,
			sprint,
			isPressed,
			moveVector
		})

		moveCam(walking.getForce())
	})
}
