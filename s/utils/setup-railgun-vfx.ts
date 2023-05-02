import {Scene} from "@babylonjs/core/scene.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {Vector3} from "@babylonjs/core/Maths/math.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {VertexData} from "@babylonjs/core/Meshes/mesh.vertexData.js"
import {Texture} from "@babylonjs/core/Materials/Textures/texture.js"
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial.js"

import {makeRayMesh} from "./make-ray-mesh.js"

export function setupRaligunVFX(scene: Scene) {
	var orbTexture = new Texture('https://i.imgur.com/MiISieq.png', scene)
	var orbMesh = MeshBuilder.CreatePlane('orb', {size: 1}, scene)
	var orbMat = new StandardMaterial('orbMat', scene)
	orbMat.disableLighting = true
	orbMat.emissiveTexture = orbTexture
	orbMat.opacityTexture = orbTexture
	orbMesh.material = orbMat
	orbMesh.scaling.scaleInPlace(1.2)

	var sparkMesh = MeshBuilder.CreatePlane('orb', {size: 1, sideOrientation: VertexData.DOUBLESIDE}, scene)
	var sparkMat = new StandardMaterial("sparkMat", scene)
	sparkMat.disableLighting = true
	sparkMesh.material = sparkMat

	sparkMesh.position.x = -0.5
	sparkMesh.bakeCurrentTransformIntoVertices()
	sparkMesh.rotation.y = Math.PI / 2
	sparkMesh.bakeCurrentTransformIntoVertices()

	sparkMesh.lookAt(Vector3.UpReadOnly)

	sparkMesh.isVisible = false
	orbMesh.isVisible = false

	orbMesh.billboardMode = Mesh.BILLBOARDMODE_ALL
	
	return {
		shootRailgun(robotRightGunPosition: Vector3, pickedPoint: Vector3) {
			makeRayMesh(robotRightGunPosition, pickedPoint, sparkMesh, orbMesh, scene)
		}
	}
}
