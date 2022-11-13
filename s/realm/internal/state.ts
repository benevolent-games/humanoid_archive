
import {EntityId, System} from "./types.js"
import {proxyThatRemembersPropertyReads} from "./handbag/proxy-that-remembers-property-reads.js"

export function prepareRealmState<xComponents extends {}>(
		systems: System<xComponents, Partial<xComponents>>[]
	) {

	const mapOfComponentData = new Map<string, Map<EntityId, any>>()
	const mapOfEntities = new Map<EntityId, Set<string>>()

	const pullNewId = (() => {
		let count = 0
		return () => count++
	})()

	function getComponentDataMap(componentKey: string) {
		let dataMap = mapOfComponentData.get(componentKey)
		if (!dataMap) {
			dataMap = new Map<EntityId, any>()
			mapOfComponentData.set(componentKey, dataMap)
		}
		return dataMap
	}

	const getSystemInfo = (() => {
		type SystemInfo = {
			selectedComponentKeys: Set<string>
		}
	
		const infos = new Map<System<xComponents, any>, SystemInfo>()

		for (const system of systems) {
			const [proxy, selectedComponentKeys] = proxyThatRemembersPropertyReads(<xComponents>{})
			void system.selector(proxy)
			infos.set(system, {selectedComponentKeys})
		}

		return (system: System<xComponents, any>) => {
			const result = infos.get(system)
			if (result)
				return result
			else
				throw new Error(`unknown system, ${system.label}`)
		}
	})()

	function getEntitiesThatMatch(systemComponentKeys: Set<string>): EntityId[] {
		const sKeys = [...systemComponentKeys]
		const entities = [...mapOfEntities.entries()]

		function filterEntityHasAllComponentsSystemNeeds(
				[, eKeys]: [EntityId, Set<string>]
			) {
			return sKeys.every(k => eKeys.has(k))
		}

		return entities
			.filter(filterEntityHasAllComponentsSystemNeeds)
			.map(([id]) => id)
	}

	function setEntityComponentKeys(entityId: EntityId, set: Set<string>) {
		mapOfEntities.set(entityId, set)
	}

	function addEntity(components: Partial<xComponents>) {
		const entityId = pullNewId()
		const componentKeys = new Set<string>()

		for (const [key, data] of Object.entries(components)) {
			componentKeys.add(key)
			const dataMap = getComponentDataMap(key)
			dataMap.set(entityId, data)
		}

		setEntityComponentKeys(entityId, componentKeys)
		return entityId
	}

	function compareEntitiesAndSystem(system: System<xComponents, any>) {
		const {selectedComponentKeys} = getSystemInfo(system)
		return {
			relevantEntityIds: getEntitiesThatMatch(selectedComponentKeys),
			componentDataMaps: new Map<string, Map<EntityId, any>>(
				[...selectedComponentKeys]
					.map(key => [key, getComponentDataMap(key)])
			),
		}
	}

	return {
		pullNewId,
		getComponentDataMap,
		getSystemInfo,
		getEntitiesThatMatch,
		setEntityComponentKeys,
		addEntity,
		compareEntitiesAndSystem,
	}
}
