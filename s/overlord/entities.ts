
import {Rec} from "./types.js"
import {make_id_getter} from "./utils/make_id_getter.js"

export class Entities<S extends Rec> {
	#get_new_id = make_id_getter()
	#entities = new Map<number, Partial<S>>()
	#disposers = new Map<number, (es: Partial<S>) => void>()

	add<ES extends Partial<S>>(
			entity_state: ES,
			dispose: (e: ES) => void = () => {},
		) {
		const id = this.#get_new_id()
		this.#entities.set(id, entity_state)
		this.#disposers.set(id, dispose as any)
	}

	delete(id: number) {
		const entity = this.#entities.get(id)!
		const dispose = this.#disposers.get(id)!

		if (!entity || !dispose)
			throw new Error(`unknown entity "${id}"`)

		this.#entities.delete(id)
		dispose(entity)
	}

	*select(selector: (keyof S)[]) {
		for (const entry of this.#entities) {
			const [, entity] = entry
			const matching = selector.every(s => entity.hasOwnProperty(s))

			if (matching)
				yield entry
		}
	}
}
