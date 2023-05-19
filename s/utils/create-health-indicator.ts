import {Scene} from "@babylonjs/core/scene.js"
import {AdvancedDynamicTexture, Rectangle} from "@babylonjs/gui"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {AbstractMesh, Mesh} from "@babylonjs/core/Meshes/index.js"

export function createHealthIndicator(capsule: AbstractMesh, scene: Scene) {
	const g = MeshBuilder.CreatePlane("plane", {width: 2.1, height: 0.3}, scene)
	const g1 = MeshBuilder.CreatePlane("plane", {width: 2, height: 0.2}, scene)
	g.billboardMode = Mesh.BILLBOARDMODE_ALL
	g.parent = capsule
	g.position.y = 2
	g.visibility = 0.45
	g1.parent = g
	g1.visibility = 1

	const rect = new Rectangle()
	rect.width = 1
	rect.thickness = 0
	rect.background = "white"
	rect.horizontalAlignment = 3
	rect.linkWithMesh(capsule)

	const healthBar = AdvancedDynamicTexture.CreateForMesh(g1)
	healthBar.addControl(rect)

	return {
		updateHealthIndicator(health: number) {
			rect.width = health / 100
		}
	}
}
