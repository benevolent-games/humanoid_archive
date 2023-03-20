
import {Freq} from "../types.js"
import {obtool} from "@chasemoskal/magical"

export function make_frequency_checkers(frequencies: Freq<number>) {
	const lasts = obtool(frequencies).map(() => 0)

	return (game_time: number) => obtool(frequencies).map((frequency, key) => {
		const k = key as keyof typeof lasts
		const last = lasts[k]
		const go = (game_time - last) >= frequency
		lasts[k] = go ?game_time :last
		return go
	})
}
