
import {make_id_getter} from "./utils/make_id_getter.js"
import {select_entities} from "./utils/select_entities.js"
import {frequency_phases} from "./utils/frequency_phases.js"
import {Behavior, Freq, OverlordParams, Rec} from "./types.js"
import {behavior_is_ready_to_execute} from "./utils/behavior_is_ready_to_execute.js"

export class Overlord<S extends Rec> {
	#get_new_id = make_id_getter()
	#behaviors: Behavior[] = []
	#frequencies: Freq<number>
	#entities: Map<number, Partial<S>> = new Map()
	#entity_disposers = new Map<number, ((es: Partial<S>) => void)>()
	#phases: () => Freq<boolean>

	constructor({behaviors, frequencies}: OverlordParams<S>) {
		this.#behaviors = behaviors
		this.#frequencies = frequencies
		this.#phases = frequency_phases(this.#frequencies, () => Date.now())
	}

	add_entity<ES extends Partial<S>>(
			entity_state: ES,
			dispose: ((e: ES) => void) = () => {},
		) {
		const id = this.#get_new_id()
		this.#entities.set(id, entity_state)
		this.#entity_disposers.set(id, dispose as any)
		return id
	}

	delete_entity(id: number) {
		const entity = this.#entities.get(id)!
		const dispose = this.#entity_disposers.get(id)!

		if (!entity || !dispose)
			throw new Error(`unknown entity "${id}"`)

		this.#entities.delete(id)
		dispose(entity)
	}

	tick() {
		const phases = this.#phases()

		for (const behavior of this.#behaviors) {
			if (behavior_is_ready_to_execute(phases, behavior.frequency)) {
				const selected = select_entities(this.#entities, behavior.selector)

				for (const [id, entity] of selected)
					behavior.activity(entity, id)
			}
		}
	}
}
