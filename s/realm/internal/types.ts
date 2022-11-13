
import {prepareRealmState} from "./state.js"
import {system} from "./system.js"

export type EntityId = number

export type State = ReturnType<typeof prepareRealmState>

export interface System<xComponents extends {}, xSelectedComponents extends {}> {
	label: string
	selector: (c: xComponents) => xSelectedComponents
	executor: (s: xSelectedComponents) => xSelectedComponents
}

export type AnySystem = System<any, any>

export interface Setup<xComponents extends {}> {
	({}: {
		system: () => ReturnType<typeof system<xComponents>>
	}): {
		systems: System<xComponents, any>[]
	}
}
