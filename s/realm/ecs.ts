
import {system} from "./internal/system.js"
import {prepareRealmState} from "./internal/state.js"
import {EntityId, ComponentId, System, Setup} from "./internal/types.js"

export function uniformEcsContext<xComponents extends {}>() {
	const entities = new Map<EntityId, string[]>()
	const components = new Map<EntityId, any>()
	const systems = new Set<System<xComponents, any>>()

	const pullNextId = (() => {
		let count = 0
		return () => count++
	})()

	return {
		systems,
		entities: {
			insert<xInsertedComponents extends Partial<xComponents>>(components: xInsertedComponents) {
				const id = pullNextId()
			},
		},
		executeAllSystems() {
			for (const system of systems) {
				
			}
		},
	}
}

export module octo {

	export async function host({}: {
			label: string
			signalServerUrl: string
		}) {
		console.warn("TODO")
		const connected: any = undefined


	}

	export async function client({}: {
		sessionId: string
		signalServerUrl: string
		}) {
		console.warn("TODO")
	}
}

export function makeRealmEcs<xComponents extends {}>(
		setup: Setup<xComponents>
	) {

	const {systems} = setup({system: () => (system<xComponents>())})

	const state = prepareRealmState(systems)

	return {
		addEntity: state.addEntity,
		executeSystems() {
			console.log(`executing systems`)

			for (const system of systems) {
				console.log(` - executing system "${system.label}"`)

				// const {relevantEntityIds, componentDataMaps} = state.compareEntitiesAndSystem(system)

				const systemInfo = state.getSystemInfo(system)
				const dataMaps = new Map<string, Map<EntityId, any>>(
					[...systemInfo.selectedComponentKeys]
						.map(key => [key, state.getComponentDataMap(key)])
				)

				for (const entityId of state.getEntitiesThatMatch(systemInfo.selectedComponentKeys)) {
					console.log(` - executing entity "${entityId}"`)
					const components: any = {}

					for (const [key, dataMap] of dataMaps.entries()) {
						components[key] = dataMap.get(entityId)
					}

					const newComponents = system.executor(system.selector(components))

					for (const [key, dataMap] of dataMaps.entries()) {
						dataMap.set(entityId, newComponents[key])
					}
				}
			}
		},
	}
}
