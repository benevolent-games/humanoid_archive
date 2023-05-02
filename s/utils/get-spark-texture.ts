import {DynamicTexture} from "@babylonjs/core/Materials/Textures/dynamicTexture.js"
import {Scene} from "@babylonjs/core/scene.js"

export function getSparkTexture(width: number, height: number, scene: Scene) {
		var texture = new DynamicTexture("spark", {width: width, height: height}, scene)
		var ctx = texture.getContext()
		ctx.shadowBlur = 10
		ctx.shadowColor = "#5767AF"
		ctx.strokeStyle = 'white'
		ctx.beginPath()
		ctx.lineWidth = 5
		ctx.moveTo(0, height / 2)
		var s = 25
		for (var i = 0; i < 1000; i++) {
			ctx.lineTo(i / 99 * width, height / 2 + Math.random() * s - Math.random() * s)
		}
		ctx.stroke()
		
		//ctx.beginPath();
		ctx.stroke()
		ctx.lineWidth = 2
		ctx.moveTo(0, height / 2)
		for (var i = 0; i < 1000; i++) {
			ctx.lineTo(i / 99 * width, height / 2 + Math.random() * 4 - Math.random() * 4)
		}
		ctx.stroke();
		texture.update();
		return texture;
}
