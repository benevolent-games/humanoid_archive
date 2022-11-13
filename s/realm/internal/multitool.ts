
import {AnySystem} from "./types.js"
import {proxyThatRemembersPropertyReads} from "./handbag/proxy-that-remembers-property-reads.js"

export function interrogateSystemSelectorsToCacheRelevantComponentKeys(
		systems: AnySystem[]
	) {

	const cachedComponentKeysBySystem = new Map<AnySystem, Set<string>>()

	for (const system of systems) {
		const [proxy, selectedComponentKeys] = proxyThatRemembersPropertyReads({})
		void system.selector(proxy)
		cachedComponentKeysBySystem.set(system, selectedComponentKeys)
	}

	return {
		getSystemComponentKeys(system: AnySystem) {
			const result = cachedComponentKeysBySystem.get(system)
			if (result)
				return result
			else
				throw new Error(`unknown system, ${system.label}`)
		},
	}
}


