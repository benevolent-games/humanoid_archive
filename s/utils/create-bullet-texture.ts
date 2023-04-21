import {Scene} from "@babylonjs/core/scene.js"
import {Effect} from "@babylonjs/core/Materials/effect.js"
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial.js"
import {CustomProceduralTexture} from "@babylonjs/core/Materials/Textures/Procedurals/index.js"

import bulletTextureShader from "../shaders-store/bullet-texture-shader.js"

export function createBulletTexture(
	name: string, args: any, scene: Scene
) {

	let uID = Date.now()
	args.res = args.res || 256

	Effect.ShadersStore[name+'DiffusePixelShader'] = bulletTextureShader
	let diffuse = new CustomProceduralTexture(name+'Diffuse', name+'Diffuse', args.res, scene, undefined, false, false)
	diffuse.wrapU = diffuse.wrapV = 1
	diffuse.refreshRate = 0
	diffuse.setFloat('ratio', 1)

	var mat = new StandardMaterial(name+'Mat', scene)
	mat.backFaceCulling = false
	mat.diffuseTexture = diffuse
	mat.emissiveTexture = diffuse
	mat.opacityTexture = diffuse
	mat.disableLighting = true
	mat.diffuseTexture.hasAlpha = true
	return mat
}