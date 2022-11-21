
import {V2} from "./v2.js"
import * as v2 from "./v2.js"

export function walker({
		walk, sprint, isPressed, moveVector
	}: {
		walk: number
		sprint: number
		isPressed: {
			forward: boolean
			backward: boolean
			leftward: boolean
			rightward: boolean
		}
		moveVector: V2 | undefined
	}) {

	function cap(vector: V2) {
		const magnitude = v2.magnitude(vector)
		return (magnitude > 1)
			? v2.normalize(vector)
			: vector
	}

	function getKeyboardForce() {
		let stride = 0
		let strafe = 0
		if (isPressed.forward) stride += 1
		if (isPressed.backward) stride -= 1
		if (isPressed.leftward) strafe -= 1
		if (isPressed.rightward) strafe += 1
		const capped = cap([strafe, stride])
		return v2.multiplyBy(capped, walk)
	}

	function getThumbForce() {
		let stride = 0
		let strafe = 0
		if(moveVector){
			stride += moveVector[1]
			strafe += moveVector[0]
		}
		const capped = cap([strafe, stride])
		return v2.multiplyBy(capped, sprint)
	}

	function getForce() {
		const keyforce = getKeyboardForce()
		const thumbforce = getThumbForce()
		return v2.add(keyforce, thumbforce)
	}

	function capTopSpeed(force: V2) {
		const magnitude = v2.magnitude(force)
		return (magnitude > sprint)
			? v2.multiplyBy(v2.normalize(force), sprint)
			: force
	}

	return {
		getForce,
		capTopSpeed,
	}
}
