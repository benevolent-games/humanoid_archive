
import {system} from "./internal/system.js"
import {prepareRealmState} from "./internal/state.js"
import {AnySystem, EntityId, Setup} from "./internal/types.js"
import {interrogateSystemSelectorsToCacheRelevantComponentKeys} from "./internal/multitool.js"
import {proxyThatRemembersPropertyReads} from "./internal/handbag/proxy-that-remembers-property-reads.js"

export function makeRealmEcs<xComponents extends {}>(
		setup: Setup<xComponents>
	) {

	const {systems} = setup({system: () => (system<xComponents>())})

	// const getSystemComponentKeys = (
	// 	interrogateSystemSelectorsToCacheRelevantComponentKeys(systems)
	// )

	// const data = (() => {
	// 	const mapOfComponentData = new Map<string, Map<EntityId, any>>()
	// 	const mapOfEntities = new Map<EntityId, Set<string>>()

	// 	const pullNewId = (() => {
	// 		let count = 0
	// 		return () => count++
	// 	})()

	// 	function getComponentDataMap(componentKey: string) {
	// 		let dataMap = mapOfComponentData.get(componentKey)
	// 		if (!dataMap) {
	// 			dataMap = new Map<EntityId, any>()
	// 			mapOfComponentData.set(componentKey, dataMap)
	// 		}
	// 		return dataMap
	// 	}

	// 	return {
	// 		pullNewId,
	// 		getComponentDataMap,
	// 	}
	// })()

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
