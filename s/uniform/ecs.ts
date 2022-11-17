
import {objectMap} from "../utils/object-map.js"
import {System, EntityId} from "../realm/internal/types.js"

export function uniformEcsContext<xComponents extends {}>() {

	const entities = new Map<EntityId, Partial<xComponents>>()
	const components = new Map<EntityId, any>()
	const systems = new Set<System<xComponents, any>>()

	return {

		executeAllSystems() {
			// return context
		},

		systems,

		entities: {
			insert<xInsertedComponents extends Partial<xComponents>>(components: xInsertedComponents) {
				// const id = pullNextId()
			},
		},
	}
}
