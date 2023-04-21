import {Scene} from "@babylonjs/core/scene.js"
import {Ray} from "@babylonjs/core/Culling/ray.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {Vector3} from "@babylonjs/core/Maths/math.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {AbstractMesh} from "@babylonjs/core/Meshes/abstractMesh.js"
import {PickingInfo} from "@babylonjs/core/Collisions/pickingInfo.js"
import {Texture} from "@babylonjs/core/Materials/Textures/texture.js"
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial.js"
import {SolidParticleSystem} from "@babylonjs/core/Particles/solidParticleSystem.js"

import {createBlastTexture} from "./create-blast-texture.js"
import {createBulletTexture} from "./create-bullet-texture.js"
import {createBlastDotTexture} from "./create-blastdot-texture.js"
import {createConeBlastTexture} from "./create-coneblast-texture.js"

export class BlasterVFX{
name: string
args: any
scene: Scene
delta = 0
time = 0
aimNode: null | AbstractMesh = null
sps: any
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

			//ReuseBlastCone
			this.sps.addShape(blastCone, args.cache)
			blastCone.dispose()

			let sparksMat = new StandardMaterial(this.name+':sparksMat', scene)
			sparksMat.diffuseTexture = new Texture("textures/flare.png", scene)
			sparksMat.emissiveTexture = sparksMat.diffuseTexture    
			sparksMat.opacityTexture = new Texture("textures/flare.png", scene)
			sparksMat.opacityTexture.getAlphaFromRGB = true

			
			
			let sparkPlane = Mesh.CreatePlane("sparkPlane", 1, scene)
			sparkPlane.material = sparksMat
			this.sps.addShape(sparkPlane, args.cache)
			sparkPlane.dispose()

			let splashDotMat = createBlastDotTexture(this.name+':standardDot', {res:256}, scene)
			let splashDotPlane = Mesh.CreatePlane("splashDotPlane", 1, scene)
			splashDotPlane.material = splashDotMat
			this.sps.addShape(splashDotPlane, args.cache)
			splashDotPlane.dispose()

			this.mesh = this.sps.buildMesh()
			
			this.sps.initParticles = function() {
					// just recycle everything
					for (var p = 0; p < this.nbParticles; p++) {
							this.recycleParticle(this.particles[p])
					}
			}

			// recycle
			this.sps.recycleParticle = (particle: any) => {
					particle.type = 0
					particle.position.x = 0
					particle.position.y = 0
					particle.position.z = 0
					particle.scale.x = 0
					particle.scale.y = 0
					particle.scale.z = 0
			}

			this.sps.updateParticle = (p: any)=>{
					let aTime, xOff, yOff
					switch(p.type){
							case 0 :
							return
							break;
							case 1 :
									p.timer += this.delta
									aTime = Math.min(p.timer/p.animationSpeed, 1)
									xOff = Math.floor(aTime/p.animationStep)
									if(xOff==p.lastFrame){
											this.sps.recycleParticle(p)
									}
									yOff = Math.floor(xOff/p.pow2Count)
									xOff -= (yOff*p.pow2Count)

									xOff *= p.textureCellSize
									yOff *= p.textureCellSize

									p.uvs.x = xOff
									p.uvs.y = yOff
									p.uvs.z = xOff + p.textureCellSize
									p.uvs.w = yOff + p.textureCellSize

									p.scale.scaleInPlace(p.scaleUp)
									if(p.scale.x>=p.scaleMax){
											return this.sps.recycleParticle(p)
									}
							break
							case 2 :
									if(p.scale.z < p.scaleMax){
											p.scale.z*=p.scaleUp
									}
									p.position.addInPlace(p.direction.scale(p.speed))
									p.distance+=p.speed
									p.speed *= p.drag
									p.direction.subtractInPlace(Vector3.Up().scale(p.drop))
									p.rotation.x = -p.direction.y
									p.rotation.y =  p.direction.x
									
									let d = 1.0-(p.distance/p.range)
									if(d<0){
											return this.sps.recycleParticle(p)
									}
									p.distanceDelta = d
									p.uvs.x = p.uvs.z = 0.001+(0.999*(1.0-d))
									let d2 = (d*0.6)+0.01
									let d3 = (d*0.8)+0.02
									p.scale = new Vector3(d2,d2,d3)
									
									if(!this.testCollisions(p)){
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
							case 3 :
									p.timer += this.delta
									aTime = Math.min(p.timer/p.animationSpeed, 1)
									xOff = Math.floor(aTime/p.animationStep)
									if(xOff==p.lastFrame){
											this.sps.recycleParticle(p)
									}
									yOff = Math.floor(xOff/p.pow2Count)
									xOff -= (yOff*p.pow2Count)

									xOff *= p.textureCellSize
									yOff *= p.textureCellSize

									p.uvs.x = xOff
									p.uvs.y = yOff
									p.uvs.z = xOff + p.textureCellSize
									p.uvs.w = yOff + p.textureCellSize

									let pp = this.sps.particles[p.parent]
									if(pp.distanceDelta <= 0){
											return this.sps.recycleParticle(p)
									}
									p.scale.scaleInPlace(p.scaleUp*pp.distanceDelta)
									if(p.scale.x>=p.scaleMax*pp.distanceDelta){
											return this.sps.recycleParticle(p)
									}
									
									p.position = pp.position.clone()
									p.rotation = pp.rotation.clone()

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
							case 5:
									p.timer += this.delta
									aTime = Math.min(p.timer/p.animationSpeed, 1)
									xOff = Math.floor(aTime/p.animationStep)
									if(xOff==p.lastFrame){
											this.sps.recycleParticle(p)
									}
									yOff = Math.floor(xOff/p.pow2Count)
									xOff -= (yOff*p.pow2Count)

									xOff *= p.textureCellSize
									yOff *= p.textureCellSize

									p.uvs.x = xOff
									p.uvs.y = yOff
									p.uvs.z = xOff + p.textureCellSize
									p.uvs.w = yOff + p.textureCellSize                    
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

	testCollisions(p: any){
			let ray = new Ray(p.position, p.direction, p.speed)
			let pick = this.scene.pickWithRay(ray, (m)=>{
					if(m.shootable){
							return true
					}
					return false
			})
			if(pick?.hit){
					this.hit(p, pick)
					return true
			}
			return false
	}

	hit(p, pick: PickingInfo){
			let normal = p.direction.scale(-1)
			let point = pick.pickedPoint
			this.subEmit(4, {
					parentId : p.idx,
					position : point,
					speed : p.speed,
					direction : normal
			}, (Math.random()*3)+6)
			this.subEmit(1, {
					position:p.position
			})
			this.subEmit(5, {
					position:p.position,
					distance:p.distanceDelta
			})
			this.sps.recycleParticle(p)
	}

	run(delta: number){
			this.delta = delta
			this.time += delta
			this.sps.setParticles()
			if(this.blastMat){
				this.blastMat!.diffuseTexture!._time += this.delta*0.001
				this.blastMat.diffuseTexture!.setFloat('time',this.blastMat.diffuseTexture._time)
				this.blastConeMat.diffuseTexture!.setFloat('time',this.blastMat.diffuseTexture._time)
			}
	}

	fire(pos){
			//MuzzleFlash        
			let p = this.sps.particles[this.getCurrentSpawn(0)]
			p.type = 1
			p.scale = new Vector3(0.2,0.2,0.2)
			p.rotation = this.aimNode!.rotation.clone()
			p.position = this.aimNode!.forward.clone().multiply(new Vector3(0,0,0.05))
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

			p = this.sps.particles[this.getCurrentSpawn(0)]
			p.type = 1
			p.scale = new Vector3(0.1,0.1,0.1)
			p.rotation = this.aimNode!.rotation.clone()
			p.position =  this.aimNode!.forward.clone().multiply(new Vector3(0,0,0.1))
			p.scaleUp = 1.1
			p.scaleMax = 0.5
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
			
			//ConeBlast
			p = this.sps.particles[this.getCurrentSpawn(1)]
			p.type = 1
			p.scale = new Vector3(0.2,0.2,0.2)
			p.rotation = this.aimNode!.rotation.clone()
			p.position = new Vector3(0,0,0)
			p.scaleUp = 1.08
			p.scaleMax = 0.8
			p.timer = 0
			p.pow2Count = 3
			p.textureCellSize = 1/p.pow2Count 
			p.frameID = 0
			p.uvs.x = 0.0
			p.uvs.y = 0.0
			p.uvs.z = p.textureCellSize
			p.uvs.w = p.textureCellSize
			p.animationSpeed = 400
			p.lastFrame = p.pow2Count*p.pow2Count
			p.animationStep = 1/(p.lastFrame+1)

			//Bullet
			p = this.sps.particles[this.getCurrentSpawn(2)]
			p.type = 2
			p.scale = new Vector3(0.5,0.5,0.2)
			p.position = pos
			p.direction = this.aimNode!.forward.clone()
			p.speed = 0.5
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

	subEmit(type: number, data: any, count = 1){
			let p
			switch(type){
					case 1:
							p = this.sps.particles[this.getCurrentSpawn(0)]  
							p.type = 1
							p.scale = new Vector3(0.5,0.5,0.5)
							p.position = data.position.clone()
							p.scaleUp = 1.1
							p.scaleMax = 2.
							p.timer = 0
							p.pow2Count = 3
							p.textureCellSize = 1/p.pow2Count 
							p.frameID = 0
							p.uvs.x = 0.0
							p.uvs.y = 0.0
							p.uvs.z = p.textureCellSize
							p.uvs.w = p.textureCellSize
							p.animationSpeed = 400
							p.lastFrame = p.pow2Count*p.pow2Count
							p.animationStep = 1/(p.lastFrame+1)
					break;
					//Frontal Cone
					case 3:            
							p = this.sps.particles[this.getCurrentSpawn(3)]               
							p.type = 3            
							p.scale = new Vector3(0.3,0.3,0.3)
							p.position = data.position
							p.scaleUp = 1.12
							p.scaleMax = 0.8
							p.timer = 0
							p.pow2Count = 3
							p.textureCellSize = 1/p.pow2Count 
							p.frameID = 0
							p.uvs.x = 0.0
							p.uvs.y = 0.0
							p.uvs.z = p.textureCellSize
							p.uvs.w = p.textureCellSize
							p.animationSpeed = 50
							p.lastFrame = p.pow2Count*p.pow2Count
							p.animationStep = 1/(p.lastFrame+1)
							p.parent = data.parentId
					break;
					case 4:
							for(let i=0; i<count; i++){
									p = this.sps.particles[this.getCurrentSpawn(4)]               
									p.type = 4            
									p.scale = (new Vector3(0.5,0.5,0.5)).scale(((Math.random()*0.5)+0.5))
									p.position = data.position.clone()
									p.scaleDown = 0.98-(Math.random()*0.2)
									p.drop = (Math.random()*0.05)+0.02
									p.drag = 0.86
									p.speed = data.speed * ((Math.random()*0.25)+0.2)
									p.direction = data.direction.clone()
									let mr = Math.random()*10.
									p.direction.x += (Math.sin(this.time*mr))
									p.direction.y += (Math.cos(this.time*mr))
									p.direction.z += (Math.sin(this.time*mr))
									p.direction = p.direction.normalize()
							}
					break;
					case 5:
									p = this.sps.particles[this.getCurrentSpawn(5)]
									p.type = 5
									p.scale = new Vector3(0.3,0.3,0.3).scale(data.distance)
									p.position = data.position.clone()
									p.timer = 0
									p.pow2Count = 3
									p.textureCellSize = 1/p.pow2Count 
									p.frameID = 0
									p.uvs.x = 0.0
									p.uvs.y = 0.0
									p.uvs.z = p.textureCellSize
									p.uvs.w = p.textureCellSize
									p.animationSpeed = 3000
									p.lastFrame = p.pow2Count*p.pow2Count
									p.animationStep = 1/(p.lastFrame+1)
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

}