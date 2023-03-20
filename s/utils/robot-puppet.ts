import {V3, v3} from "@benev/toolbox/x/utils/v3.js"

import {loadGlb} from "./babylon/load-glb.js"
import {Scene} from "@babylonjs/core/scene.js"
import {Quaternion, Vector3} from "@babylonjs/core/Maths/math.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

export class RobotPuppet {
	#scene: Scene;
	position: V3 = v3.zero()
	isLoaded = this.#loadGlb()

	constructor({scene, position}: {scene: Scene, position: V3}) {
		this.#scene = scene
		this.position = position
		this.isLoaded.then(() => {
			// it centers robot inside capsule
			const root = this.root as TransformNode
			root.position = new Vector3(0,-1,0)
		})
	}

	async #loadGlb() {
		return await loadGlb(this.#scene, `https://dl.dropbox.com/s/ka0uunak8h9fts5/spherebot3_1.glb`)
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
		const parent = this.root?.parent as TransformNode
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
