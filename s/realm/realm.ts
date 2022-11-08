
export function makeSystem<xComponent>(
		process: (component: Readonly<xComponent>) => xComponent,
	) {

	let count = 0
	const components = new Map<number, xComponent>()

	return {
		add(component: xComponent) {
			const id = count++
			components.set(id, component)
			return {
				id,
				get exists() {
					return components.has(id)
				},
				dispose() {
					components.delete(id)
				},
			}
		},

		process() {
			for (const [id, component] of components.entries())
				components.set(id, process(component))
		},
	}
}

//
// make the "systems" which centralize all logical processing
//

const systems = {
	mesh: makeSystem(
		(component: {
				name: string
				position: [number, number, number]
			}) => {
			console.log("process mesh", component.name)
			return component
		}
	),
}

//
// make an "entity", not sure what to do with this
//

export class CubeEntity {
	mesh1 = systems.mesh.add({
		name: "mesh1",
		position: [0, 1, 0],
	})
}
