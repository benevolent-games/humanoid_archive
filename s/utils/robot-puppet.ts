import {loadGlb} from "./babylon/load-glb.js"
import {Scene} from "@babylonjs/core/scene.js"
import {Vector3} from "@babylonjs/core/Maths/math.js"
import {V3} from "@benev/toolbox/x/utils/v3.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

export class RobotPuppet {
	#scene: Scene;
	#position: V3 = [0,0,0]

	constructor({scene, position}: {scene: Scene, position: V3}) {
		this.#scene = scene
		this.#position = position
		this.#loadGlb()
	}

	async #loadGlb() {
		await loadGlb(this.#scene, `../../assets/temp/spherebot3.glb`)
	}

	setVerticalAim(y: number) {}

	setHorizontalAim(x: number) {}

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
