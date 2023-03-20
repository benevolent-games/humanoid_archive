
import {make_id_getter} from "./utils/make_id_getter.js"
import {select_entities} from "./utils/select_entities.js"
import {Behavior, Freq, OverlordParams, Rec} from "./types.js"
import {make_frequency_checkers} from "./utils/make_frequency_checkers.js"
import {behavior_is_ready_to_execute} from "./utils/behavior_is_ready_to_execute.js"

export class Overlord<S extends Rec> {
	#get_new_id = make_id_getter()
	#behaviors: Behavior[] = []
	#entities: Map<number, Partial<S>> = new Map()
	#entity_disposers = new Map<number, ((es: Partial<S>) => void)>()

	#last_tick = 0
	#game_time = 0
	#check_frequency_phases: (game_time: number) => Freq<boolean>

	constructor({behaviors, frequencies}: OverlordParams<S>) {
		this.#behaviors = behaviors
		this.#check_frequency_phases = make_frequency_checkers(frequencies)
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
		this.#game_time += Date.now() - this.#last_tick
		const phases = this.#check_frequency_phases(this.#game_time)

		for (const behavior of this.#behaviors) {
			if (behavior_is_ready_to_execute(phases, behavior.frequency)) {
				const selected = select_entities(this.#entities, behavior.selector)

				for (const [id, entity] of selected)
					behavior.activity(entity, id)
			}
		}
	}
}
