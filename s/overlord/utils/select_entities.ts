
import {Rec} from "../types.js"

export function select_entities<S extends Rec>(
		entities: Map<number, Partial<S>>,
		selector: (keyof S)[],
	) {

	const selected: [number, Partial<S>][] = []

	for (const entity of entities) {
		const matching = selector.every(s => entity.hasOwnProperty(s))

		if (matching)
			selected.push(entity)
	}

	return selected
}
