
import {Rec} from "../types.js"

export function select_entities<S extends Rec>(
		entities: Map<number, Partial<S>>,
		selector: (keyof S)[],
	) {

	const selected: [number, Partial<S>][] = []

	for (const entry of entities) {
		const [, entity] = entry
		const matching = selector.every(s => entity.hasOwnProperty(s))

		if (matching)
			selected.push(entry)
	}

	return selected
}
