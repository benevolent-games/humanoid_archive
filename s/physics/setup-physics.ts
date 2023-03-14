
import "@babylonjs/core/Physics/physicsEngineComponent.js"

import {Scene} from "@babylonjs/core/scene.js"
import {Vector3} from "@babylonjs/core/Maths/math.js"
import {AmmoJSPlugin} from "@babylonjs/core/Physics/Plugins/ammoJSPlugin.js"

export async function setupPhysics(
		scene: Scene
	) {
	
	const ammo = await Ammo()
	const physics = new AmmoJSPlugin(true, ammo)
	const gravity = new Vector3(0, -9.81, 0)
	scene.enablePhysics(gravity, physics)

}
