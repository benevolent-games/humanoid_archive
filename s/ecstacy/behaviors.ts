
export type Rec = Record<string, unknown>

export type Hub<C, L, S extends Rec, K extends keyof S> = {
	frequency: any
	user_id: any
	client: any
	host: any
	state: Pick<S, K>
	context: C
	local: L
	lifecycle: {
		created: boolean
		active: boolean
		deleted: boolean
	}
}

export type Behavior<
		C = any,
		L = any,
		S extends Rec = any,
		K extends keyof S = any
	> = {
	name: string
	selector: K[]
	activity: ({}: Hub<C, L, S, K>) => void
}

export type Activity<
	C = any,
	L = any,
	S extends Rec = Rec,
	K extends keyof S = keyof S
> = (hub: Hub<C, L, S, K>) => void

export type BehaviorMaker<C, S extends Rec> = {
	selector: <K extends keyof S>(...selector: K[]) => {
		activity: (a: Activity<C, unknown, S, K>) => Behavior<C, unknown, S, K>
		local: <L = any>(...selector_local: string[]) => {
			activity: (a: Activity<C, L, S, K>) => Behavior<C, L, S, K>
		}
	}
}

export const behavior = <C, S extends Rec>(
		name: string
	): BehaviorMaker<C, S> => ({
	selector: (...selector) => ({

		activity: activity => ({
			name,
			selector,
			activity,
		}),

		local: (...selector_local) => ({
			activity: activity => ({
				name,
				selector,
				activity,
			}),
		}),

	})
})

export function behaviors<C, S extends Rec>(
		make: (b: (name: string) => BehaviorMaker<C, S>) => Behavior[]
	) {
	return make(behavior)
}

type Context = {
	lol: any
	nub_context: any
}

type State = {
	count: number
	position: number
	robot: boolean
}

type Local = {
	root: any
	robot_puppet: any
}

const counting = behaviors<Context, State>(behavior => [
	behavior("test")
		.selector("count")
		.activity(({frequency, state}) => {
			if (frequency(1000))
				state.count += 1
		}),
])

let make_robot_puppet: any
let get_user_movement_trajectory: any

const behaviors_for_robot = behaviors<Context, State>(behavior => [

	behavior("spawn robot puppet")
		.selector("robot", "position")
		.local("root")
		.activity(({lifecycle, state, local}) => {
			if (lifecycle.created)
				local.robot_puppet = make_robot_puppet(state.position)
		}),

	behavior("robot is net synced")
		.selector("robot", "position")
		.local("robot_puppet")
		.activity(({frequency, state, local}) => {
			if (frequency(100))
				state.position = local.robot_puppet.get_position()
		}),

	behavior("user can move robot")
		.selector("robot", "position")
		.local("robot_puppet")
		.activity(({local, context: {nub_context}}) => {
			local.robot_puppet.apply_move_force(
				get_user_movement_trajectory(nub_context)
			)
		}),
])
