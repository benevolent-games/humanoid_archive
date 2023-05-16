import {Scene} from "@babylonjs/core/scene.js"
import {Ray} from "@babylonjs/core/Culling/ray.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {Sprite} from "@babylonjs/core/Sprites/sprite.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {AbstractMesh} from "@babylonjs/core/Meshes/abstractMesh.js"
import {PickingInfo} from "@babylonjs/core/Collisions/pickingInfo.js"
import {Texture} from "@babylonjs/core/Materials/Textures/texture.js"
import {Matrix, Quaternion, Vector3} from "@babylonjs/core/Maths/math.js"
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial.js"
import {SolidParticleSystem} from "@babylonjs/core/Particles/solidParticleSystem.js"

import {Sps} from "../types/Sps.js"
import {Particle} from "../types/Particle.js"
import {applyForceToMesh} from "./apply-force-to-mesh.js"
import {createBlastTexture} from "./create-blast-texture.js"
import {createBulletTexture} from "./create-bullet-texture.js"
import {createBlastDotTexture} from "./create-blastdot-texture.js"
import {createConeBlastTexture} from "./create-coneblast-texture.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {SpriteManager} from "@babylonjs/core/Sprites/spriteManager.js"

const sprite_url = "https://i.imgur.com/E5kbGTE.png"

export class RocketLauncherVFX{
name: string
args: any
scene: Scene
delta = 0
time = 0
aimNode: null | TransformNode = null
sps: Sps
blastMat: StandardMaterial
blastConeMat: StandardMaterial
bulletMat: StandardMaterial
spawnIDs: any[]
mesh: Mesh
	constructor(name: string, args: any, scene: Scene){
			this.name = name
			args.cache = args.cache || 300
			this.args = args
			this.scene = scene
			//this.mesh.billboardMode = Mesh.BILLBOARDMODE_ALL
			this.sps = new SolidParticleSystem('SPS', scene, {useModelMaterial: true})
			this.spawnIDs = [0, args.cache, args.cache*2, args.cache*3, args.cache*4, args.cache*5]
			//BlastOut
			let blastFlash = Mesh.CreatePlane("BlastOut", 1, scene)
			this.blastMat = createBlastTexture('standard:blastFlash', {res:512}, scene)
			blastFlash.material = this.blastMat
			this.sps.addShape(blastFlash, args.cache)
			blastFlash.dispose()

			//BlastCone
			let blastCone = MeshBuilder.CreateCylinder('blastCone', {height:0.3, diameterTop:1, diameterBottom:0.1, cap:0}, scene)
			blastCone.rotation.x = Math.PI*0.5
			blastCone.bakeCurrentTransformIntoVertices()
			this.blastConeMat = createConeBlastTexture('standard:blastCone', {res:512}, scene)
			blastCone.material = this.blastConeMat
			this.sps.addShape(blastCone, args.cache)
		
			let bulletShape = MeshBuilder.CreateRibbon('bullet', {
					pathArray:[
							[
							new Vector3(0, 0, 0.35),
							new Vector3(0, 0, 0.35),
							new Vector3(0, 0, 0.35),
							new Vector3(0, 0, 0.35),
							new Vector3(0, 0, 0.35)
							],
							[
							new Vector3(-0.2, -0.2, 0),
							new Vector3( 0.2, -0.2, 0),
							new Vector3( 0.2,  0.2, 0),
							new Vector3(-0.2,  0.2, 0),
							new Vector3(-0.2, -0.2, 0)
							].reverse(),
							[
							new Vector3(0, 0, -1.35),
							new Vector3(0, 0, -1.35),
							new Vector3(0, 0, -1.35),
							new Vector3(0, 0, -1.35),
							new Vector3(0, 0, -1.35)
							],
					]
			}, scene)
			bulletShape.scaling = new Vector3(0.4, 0.4, 0.8)
			bulletShape.bakeCurrentTransformIntoVertices()

			this.bulletMat = createBulletTexture('bullet:standard', {res:512}, scene)
			bulletShape.material = this.bulletMat
			this.sps.addShape(bulletShape, args.cache)
			bulletShape.dispose()

			let sparksMat = new StandardMaterial(this.name+':sparksMat', scene)
			sparksMat.diffuseTexture = new Texture("", scene)
			sparksMat.emissiveTexture = sparksMat.diffuseTexture
			sparksMat.opacityTexture = new Texture("", scene)
			sparksMat.opacityTexture.getAlphaFromRGB = true

			let sparkPlane = Mesh.CreatePlane("sparkPlane", 1, scene)
			sparkPlane.material = sparksMat
			this.sps.addShape(sparkPlane, args.cache)
			sparkPlane.dispose()

			this.mesh = this.sps.buildMesh()
			
			this.sps.initParticles = function() {
					// just recycle everything
					for (let p = 0; p < this.nbParticles; p++) {
							this.recycleParticle(this.particles[p])
					}
			}

			// recycle
			this.sps.recycleParticle = (particle) => {
					particle.type = 0
					particle.position.x = 0
					particle.position.y = 0
					particle.position.z = 0
					particle.scale.x = 0
					particle.scale.y = 0
					particle.scale.z = 0
			}

			this.sps.updateParticle = (p)=>{
					switch(p.type){
						case 0:
							if(this.aimNode)
								p.position = this.aimNode.getAbsolutePosition()
							break;
							case 2 :
									if(p.scale.z < p.scaleMax){
											p.scale.z*=p.scaleUp
									}
									p.position.addInPlace(p.direction.scale(p.speed))
									p.distance+=p.speed
									p.speed *= p.drag
									const yawAngle = -Math.atan2(p.direction.z, p.direction.x) + Math.PI / 2
									const pitchAngle = Math.atan2(-p.direction.y, Math.sqrt(p.direction.x * p.direction.x + p.direction.z * p.direction.z))
									const rollAngle = Math.atan2(p.direction.y, p.direction.x)
									let matrix = Matrix.RotationYawPitchRoll(
										yawAngle,
										pitchAngle,
										0
									)
									p.rotationQuaternion = Quaternion.FromRotationMatrix(matrix)
									let d = 1.0-(p.distance/p.range)
									if(d<0){
											return this.sps.recycleParticle(p)
									}
									p.distanceDelta = d
									p.uvs.x = p.uvs.z = 0.001+(0.999*(1.0-d))
									let d2 = (d*0.6)+0.01
									let d3 = (d*0.8)+0.02
									p.scale = new Vector3(d2,d2,d3)
									
									if(!this.testCollisions(p, Quaternion.FromRotationMatrix(matrix))){
											p.subEmitTick++
											if(p.subEmitRate < p.subEmitTick ){
													p.subEmitTick = 0
													this.subEmit(3, {
															parentId : p.idx,
															distance : d,
															position : p.position.clone()
													})
											}
									}
							break
							case 4:
									p.scale.scaleInPlace(p.scaleDown)
									if(p.scale.x<=0.01){
											return this.sps.recycleParticle(p)
									}
									p.speed *= p.drag
									p.position.addInPlace(p.direction.scale(p.speed))
									p.direction.subtractInPlace(Vector3.Up().scale(p.drop))
							break;
					}
			}

			this.sps.initParticles()
			this.sps.setParticles()

			this.sps.isAlwaysVisible = true
			this.sps.computeParticleTexture = true
			this.sps.computeParticleColor = false
			this.sps.computeParticleVertex = true

	}

	testCollisions(p: Particle, rotation: any){
			let ray = new Ray(p.position, p.direction, p.speed)
			let pick = this.scene.pickWithRay(ray, (m)=>{
					if((m as AbstractMesh & {shootable: boolean}).shootable){
							return true
					}
					return false
			})
			if(pick?.hit){
					this.hit(p, pick, rotation)
					return true
			}
			return false
	}

	hit(p: Particle, pick: PickingInfo, rotation: any){
			let normal = p.direction.scale(-1)
			let point = pick.pickedPoint
			let normalP = pick!.pickedMesh!.rotation.y
			applyForceToMesh(pick)

			this.subEmit(4, {
					parentId: p.idx,
					position: p.position,
					speed: p.speed,
					direction: normal,
					rotation,
					normal: normalP
			}, (Math.random()*3)+6)
			this.sps.recycleParticle(p)
	}

	run(delta: number){
			this.delta = delta
			this.time += delta
			this.sps.setParticles()
	}

	fire(robotRightGun: AbstractMesh, normal: Vector3) {
			const gunPosition = robotRightGun.getAbsolutePosition()
			const gunForward = robotRightGun.forward
			//MuzzleFlash
			let p = this.sps.particles[this.getCurrentSpawn(0)]
			p.type = 1
			p.scale = new Vector3(0.2,0.2,0.2)
			p.rotation = this.aimNode!.rotation.clone()
			p.position = new Vector3(gunPosition.x, gunPosition.y, gunPosition.z)
			p.scaleUp = 1.1
			p.scaleMax = 0.6
			p.timer = 0
			p.pow2Count = 3
			p.textureCellSize = 1/p.pow2Count 
			p.frameID = 0
			p.uvs.x = 0.0
			p.uvs.y = 0.0
			p.uvs.z = p.textureCellSize
			p.uvs.w = p.textureCellSize
			p.animationSpeed = 200
			p.lastFrame = p.pow2Count*p.pow2Count
			p.animationStep = 1/(p.lastFrame+1)

		// 	//Bullet
			p = this.sps.particles[this.getCurrentSpawn(2)]
			p.type = 2
			p.scale = new Vector3(0.5,0.5,0.2)
			p.position = new Vector3(gunPosition.x, gunPosition.y, gunPosition.z)
			p.direction = gunForward.clone()
			p.speed = 2
			p.range = 600
			p.scaleUp = 1.2
			p.scaleMax = 1.2
			p.distance = 0
			p.drop = 0.0001
			p.drag = 0.999
			p.uvs.x = 0.001
			p.uvs.y = 0.0
			p.uvs.z = 0.001
			p.uvs.w = 1.0
			p.subEmitRate = 2
			p.subEmitTick = 0
	}

	subEmit(type: number, data: any, count = 3){
			switch(type){
					case 4:
							const position = data.position.clone()
							const spriteManager = new SpriteManager("explosionManager", sprite_url, 16, 48, this.scene);
							const explosionSprite = new Sprite("explosion", spriteManager)
							explosionSprite.position = position
							explosionSprite.size = 3
							explosionSprite.angle = data.normal * 180 / Math.PI
							explosionSprite.playAnimation(0, 8, false, 50)
					break;
			}
	}

	getCurrentSpawn(q: number, increment = true){
			let s = this.spawnIDs[q]
			if(increment){
					this.spawnIDs[q]++
			}
			if(s>=this.args.cache*(q+1)){
					this.spawnIDs[q] = this.args.cache * q
					s = this.args.cache * q
			}
			return s
	}
	shootRocketLauncher(
		blast: RocketLauncherVFX,
		scene: Scene,
		robotRightGun: AbstractMesh,
		normal: Vector3) {
		let timer = 300
		let last = Date.now()
		let time = 0
		const e = scene.onBeforeRenderObservable.add(() => {
			blast.aimNode = new TransformNode(this.name+":an", scene)
			blast.aimNode!.position = robotRightGun.getAbsolutePosition()
			let delta = scene.getEngine().getDeltaTime()
			time+=delta*0.001
			blast.run(delta)
			let n = Date.now()
			if(n-last>timer){
				last = n
			}
		})
		blast.fire(robotRightGun, normal)
		e!.unregisterOnNextCall = true
	}
}
