
import "@babylonjs/core/Physics/physicsEngineComponent.js"

import {Scene} from "@babylonjs/core/scene.js"
import {Vector3} from "@babylonjs/core/Maths/math.js"
import {AmmoJSPlugin} from "@babylonjs/core/Physics/Plugins/ammoJSPlugin.js"

export async function setupPhysics(
		scene: Scene,
		gravity: Vector3
	) {
	
	const ammo = await Ammo()
	const physics = new AmmoJSPlugin(false, ammo)
	physics.setTimeStep(16)

	scene.enablePhysics(gravity, physics)

}
