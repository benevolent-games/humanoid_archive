
import {QualityOptions} from "./types.js"
import {quality_low} from "./quality_low.js"
import {quality_high} from "./quality_high.js"
import {quality_medium} from "./quality_medium.js"

export async function apply_quality_setting(options: QualityOptions) {

	switch (options.quality) {
		case "low":
			return quality_low(options)

		case "medium":
			return quality_medium(options)

		case "high":
			return quality_high(options)

		default:
			throw new Error(`unknown quality "${options.quality}"`)
	}
}
