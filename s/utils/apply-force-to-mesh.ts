import {Vector3} from "@babylonjs/core/Maths/math.js"
import {PickingInfo} from "@babylonjs/core/Collisions/pickingInfo.js"

export function applyForceToMesh(pick: PickingInfo) {
	if (pick.pickedMesh?.name === "box") {
		const impulseForceDirection = new Vector3(
			pick.ray!.direction!.x * 5,
			pick.ray!.direction!.y * 5,
			pick.ray!.direction!.z * 5,
		)
		pick.pickedMesh.applyImpulse(
			impulseForceDirection,
			pick.pickedPoint!
		)
	}
}
