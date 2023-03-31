
import {Frequency} from "./overlord/types.js"
import {Overlord} from "./overlord/overlord.js"
import {behaviors} from "./overlord/behaviors.js"

export type State = {
	count: number
}

const behaviors_for_counting = behaviors<State>(behavior => [

	behavior("count increases")
		.selector("count")
		.activity(Frequency.Low, state => {
			state.count += 1
			console.log(state.count)
		}),
])

const overlord = new Overlord({
	behaviors: behaviors_for_counting,
	frequencies: {
		high: 0,
		medium: 100,
		low: 1000,
	},
})

overlord.entities.add({count: 0})

setInterval(() => overlord.tick(), 10)
