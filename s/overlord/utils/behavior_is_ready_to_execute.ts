
import {Freq, Frequency} from "../types.js"

export function behavior_is_ready_to_execute(
		phases: Freq<boolean>,
		frequency: Frequency,
	) {

	return (
		(frequency === Frequency.High && phases.high) ||
		(frequency === Frequency.Medium && phases.medium) ||
		(frequency === Frequency.Low && phases.low)
	)
}
