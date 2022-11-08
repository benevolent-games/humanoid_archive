
import {Scene} from "@babylonjs/core/scene.js"
import {ISceneLoaderProgressEvent, SceneLoader} from "@babylonjs/core/Loading/sceneLoader.js"

export async function loadGlb(scene: Scene, link: string) {
	const subpath = undefined
	console.log(`📩 load ${link}`)

	const assetContainer = await SceneLoader.LoadAssetContainerAsync(
		link,
		subpath,
		scene,
		function onProgress({
				loaded, total, lengthComputable,
			}: ISceneLoaderProgressEvent) {
			if (lengthComputable) {
				const percent = (loaded / total) * 100
				if (percent >= 0 && percent <= 100) {
					const progress = percent == 100
						? "99"
						: percent.toFixed(0).padStart(2, "0")
					console.log(`⏳  ${progress}% ${link}`)
				}
			}
		},
	)

	assetContainer.removeAllFromScene()
	assetContainer.addAllToScene()

	console.log(`🎉 done ${link}`)
	return assetContainer
}
