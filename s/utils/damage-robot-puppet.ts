import {Robot_puppet} from "../robot_puppet/robot-puppet.js"
import {PickingInfo} from "@babylonjs/core/Collisions/pickingInfo.js"


export function damageRobotPuppet(pick: PickingInfo, damage: number, robotDummies?: Robot_puppet[]) {
	const pickedRobotDummy = pick.pickedMesh?.name.startsWith("dummy")
	if (pickedRobotDummy && robotDummies) {
		const index = Number(pick.pickedMesh?.name.split("-")[2])
		const robot_puppet_dummy = robotDummies[index]
		robot_puppet_dummy.setHealth = robot_puppet_dummy.health - damage
		if (robot_puppet_dummy.isDead) {
			robot_puppet_dummy.explode(
				robot_puppet_dummy.capsule.getAbsolutePosition()
			)
		}
	}
}
