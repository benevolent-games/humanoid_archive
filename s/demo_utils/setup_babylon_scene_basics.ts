
import {V3} from "@benev/toolbox/x/utils/v3.js"
import {Scene} from "@babylonjs/core/scene.js"
import {SceneLoader} from "@babylonjs/core/Loading/sceneLoader.js"
import {Color3, Color4} from "@babylonjs/core/Maths/math.color.js"

export function setup_babylon_scene_basics({scene, colors}: {
		scene: Scene
		colors: {
			background: [number, number, number, number]
			ambient: V3
		}
	}) {

	SceneLoader.ShowLoadingScreen = false
	scene.clearColor = new Color4(...colors.background)
	scene.ambientColor = new Color3(...colors.ambient)
}
