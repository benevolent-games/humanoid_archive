
import {Freq} from "../types.js"

export function frequency_phases(
		frequencies: Freq<number>,
		get_time: () => number,
	) {

	let last_high = get_time()
	let last_medium = get_time()
	let last_low = get_time()

	return () => {
		const now = get_time()

		const since_high = now - last_high
		const since_medium = now - last_medium
		const since_low = now - last_low

		let result_high = false
		let result_medium = false
		let result_low = false

		if (since_high >= frequencies.high) {
			last_high = now
			result_high = true
		}

		if (since_medium >= frequencies.medium) {
			last_medium = now
			result_medium = true
		}

		if (since_low >= frequencies.low) {
			last_low = now
			result_low = true
		}

		return {
			high: result_high,
			medium: result_medium,
			low: result_low,
		}
	}
}
