import {Scene} from "@babylonjs/core/scene.js"
import {Effect} from "@babylonjs/core/Materials/effect.js"
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial.js"
import {CustomProceduralTexture} from "@babylonjs/core/Materials/Textures/Procedurals/customProceduralTexture.js"

import coneBlastTextureShader from "../shaders-store/cone-blast-texture-shader.js"

export function createConeBlastTexture(
	name: string, args: any, scene: Scene
) {

	let uID = Date.now()
	args.res = args.res || 256

	Effect.ShadersStore[name+'DiffusePixelShader'] = coneBlastTextureShader
	let diffuse = new CustomProceduralTexture(name+'Diffuse', name+'Diffuse', args.res, scene, undefined, false, false)
	diffuse.wrapU = diffuse.wrapV = 1
	diffuse.refreshRate = 1
	diffuse.setFloat('ratio', 1)

	var mat = new StandardMaterial(name+'Mat', scene)
	mat.backFaceCulling = false
	mat.diffuseTexture = diffuse
	mat.emissiveTexture = diffuse
	mat.opacityTexture = diffuse
	mat.disableLighting = true
	mat.diffuseTexture!.hasAlpha = true
	return mat
}
