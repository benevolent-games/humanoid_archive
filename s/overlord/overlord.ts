
import {Entities} from "./entities.js"
import {frequency_phases} from "./utils/frequency_phases.js"
import {Behavior, Freq, OverlordParams, Rec} from "./types.js"
import {behavior_is_ready_to_execute} from "./utils/behavior_is_ready_to_execute.js"

export class Overlord<S extends Rec> {
	#behaviors: Behavior[] = []
	#frequencies: Freq<number>
	#phases: () => Freq<boolean>

	readonly entities = new Entities()

	constructor({behaviors, frequencies}: OverlordParams<S>) {
		this.#behaviors = behaviors
		this.#frequencies = frequencies
		this.#phases = frequency_phases(this.#frequencies, () => Date.now())
	}

	tick() {
		const phases = this.#phases()
		const {entities} = this

		for (const behavior of this.#behaviors)
			if (behavior_is_ready_to_execute(phases, behavior.frequency))
				for (const [id, entity] of entities.select(behavior.selector))
					behavior.activity(entity, id)
	}
}
