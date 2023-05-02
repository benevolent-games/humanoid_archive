import {Vector3} from "@babylonjs/core/Maths/math.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {Scene} from "@babylonjs/core/scene.js"
import {getSparkTexture} from "./get-spark-texture.js"

export function makeRayMesh(org: Vector3, dest: Vector3, sparkMesh: any, orbMesh: Mesh, scene: Scene) {
	var dist = Vector3.Distance(org, dest)
	var orb1 = orbMesh.clone('orb1')
	var orb2 = orbMesh.clone('orb2')

	orb1.isVisible = true
	orb2.isVisible = true

	var spark1 = sparkMesh.clone('spark')
	spark1.material!.emissiveTexture = getSparkTexture(512, 256, scene)
	spark1.material!.opacityTexture = spark1.material.emissiveTexture
	spark1.isVisible = true
	spark1.scaling.z = dist
	spark1.position = org.clone()
	spark1.lookAt(dest)

	spark1.registerBeforeRender(function () {
		orb1.visibility -= 0.015
		orb2.visibility -= 0.015
		spark1.visibility -= 0.030
		if (spark1.visibility <= 0) {
			orb1.dispose()
			orb2.dispose()
			spark1.dispose()
		}
	})

	orb1.position = org.clone()
	orb2.position = dest.clone()
}
