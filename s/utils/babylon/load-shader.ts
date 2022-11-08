
import "@babylonjs/core/Materials/Node/Blocks/index.js"

import {Scene} from "@babylonjs/core/scene.js"
import {Texture} from "@babylonjs/core/Materials/Textures/texture.js"
import {InputBlock} from "@babylonjs/core/Materials/Node/Blocks/index.js"
import {NodeMaterial} from "@babylonjs/core/Materials/Node/nodeMaterial.js"
import {TextureBlock} from "@babylonjs/core/Materials/Node/Blocks/Dual/textureBlock.js"

export async function loadShader({url, scene, label}: {
		url: string
		scene: Scene
		label: string
	}) {

	const material = new NodeMaterial(label, scene, {emitComments: false})
	material.setToDefault()

	await NodeMaterial.ParseFromFileAsync("", url, scene, undefined, true, material)
	material.build(false)

	const shader = {
		material,
		assignTextures(textures: {[blockName: string]: string}) {
			const blocks = material.getTextureBlocks()
			for (const [blockName, texturePath] of Object.entries(textures)) {
				const block = <TextureBlock>blocks.find(b => b.name === blockName)
				if (!block)
					console.error(`cannot find texture block "${blockName}" for node material "${material.name}"`)
				block.texture = new Texture(texturePath, scene, {
					invertY: false,
				})
			}
			return shader
		},
		assignInputs(inputs: {[blockName: string]: any}) {
			const blocks = material.getInputBlocks()
			for (const [name, value] of Object.entries(inputs)) {
				const block = <InputBlock>blocks.find(b => b.name === name)
				if (block)
					block.value = value
				else
					console.error(`cannot find input block "${name}" for shader (node material) "${material.name}"`)
			}
			return shader
		},
	}

	return shader
}
