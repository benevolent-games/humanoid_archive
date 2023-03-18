import {V3, v3} from "@benev/toolbox/x/utils/v3.js"

import {loadGlb} from "./babylon/load-glb.js"
import {Scene} from "@babylonjs/core/scene.js"
import {Quaternion, Vector3} from "@babylonjs/core/Maths/math.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

export class RobotPuppet {
	#scene: Scene;
	position: V3 = v3.zero()
	isLoaded: Promise<void>

	constructor({scene, position}: {scene: Scene, position: V3}) {
		this.#scene = scene
		this.position = position
		this.isLoaded = this.#loadGlb().then(() => {
			this.setPosition(position)
		})
	}

	async #loadGlb() {
		await loadGlb(this.#scene, `../../assets/temp/spherebot3.glb`)
	}

	setVerticalAim(y: number) {
		if (this.upper) {
			this.upper.rotationQuaternion = Quaternion.RotationYawPitchRoll(
				0, -y, 0,
			)
		}
	}

	setHorizontalAim(x: number) {
		if (this.upper) {
			this.upper.rotationQuaternion = Quaternion.RotationYawPitchRoll(
				x, 0, 0,
			)
		}
	}

	setPosition(vector: V3) {
		const parent = this.root as TransformNode
		if(parent)
			parent.position = new Vector3(...vector)
	}

	get upper() {
		return this.#scene.getTransformNodeByName("upper")
	}

	get coaster() {
		return this.#scene.getTransformNodeByName("coaster")
	}

	get root() {
		return this.#scene.getTransformNodeByName("coaster")?.parent
	}
}
