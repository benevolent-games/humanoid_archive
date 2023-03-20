
import {Frequency} from "./types.js"
import {contextual_behaviors_function} from "./behaviors.js"

let get_user_movement_trajectory: any

type Context = {
	lol: any
	nub: any
}

type State = {
	count: number
	position: number
	robot: any
}

const cbehaviors = contextual_behaviors_function<Context, State>({
	lol: {},
	nub: {},
})

export const behaviors_for_examples = cbehaviors(context => behavior => [

	behavior("test")
		.selector("count")
		.activity(Frequency.Low, state => {
			state.count += 1
		}),

	behavior("user can move robot")
		.selector("robot", "position")
		.activity(Frequency.High, state => {
			state.robot.apply_move_force(
				get_user_movement_trajectory(context.nub)
			)
		}),
])
