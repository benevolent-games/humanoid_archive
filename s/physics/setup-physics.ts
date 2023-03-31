
import "@babylonjs/core/Physics/physicsEngineComponent.js"

import {Scene} from "@babylonjs/core/scene.js"
import {v3, V3} from "@benev/toolbox/x/utils/v3.js"
import {AmmoJSPlugin} from "@babylonjs/core/Physics/Plugins/ammoJSPlugin.js"

export async function setupPhysics(
		scene: Scene,
		gravity: V3,
	) {

	const ammo = await Ammo()
	const physics = new AmmoJSPlugin(true, ammo)

	scene.enablePhysics(v3.toBabylon(gravity), physics)
}
