import {Scene} from "@babylonjs/core/scene.js"
import {Effect} from "@babylonjs/core/Materials/effect.js"
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial.js"
import {CustomProceduralTexture} from "@babylonjs/core/Materials/Textures/Procedurals/index.js"

import blastTextureShader from "../shaders-store/blast-texture-shader.js"

export function createBlastTexture(
	name: string, args: any, scene: Scene
) {

	let uID = Date.now()
	args.res = args.res || 256

	Effect.ShadersStore[name+':'+uID+'DiffusePixelShader'] = blastTextureShader
	let diffuse = new CustomProceduralTexture(name+'Diffuse', name+':'+uID+"Diffuse", args.res, scene, undefined, false, false)
	diffuse.wrapU = diffuse.wrapV = 1
	diffuse.refreshRate = 1
	diffuse.setFloat('ratio', 1)

	let mat = new StandardMaterial(name+'Mat', scene)
	mat.backFaceCulling = false
	mat.diffuseTexture = diffuse
	mat.emissiveTexture = diffuse
	mat.opacityTexture = diffuse
	mat.disableLighting = true
	mat.diffuseTexture.hasAlpha = true
	return mat
}
