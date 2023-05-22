import {Scene} from "@babylonjs/core/scene.js"
import {V3} from "@benev/toolbox/x/utils/v3.js"
import {Robot_puppet} from "../robot_puppet/robot-puppet.js"

export function spawnRobotDummies(amount: number, startPos: V3, scene: Scene) {
	const robotDummies = []
	for (let i = 0; i < amount; i++) {
		robotDummies.push(
			new Robot_puppet(scene, [startPos[0], startPos[1], startPos[2]], `dummy-capsule-${i.toString()}`)
		)
	}
	return robotDummies
}
