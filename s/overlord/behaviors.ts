
import {Rec, BehaviorMaker, BehaviorArrayMaker} from "./types.js"

export const behavior = <S extends Rec>(name: string): BehaviorMaker<S> => ({
	selector: (...selector) => ({
		activity: (frequency, activity) => ({
			name,
			selector,
			frequency,
			activity,
		}),
	})
})

export const behaviors = <S extends Rec>(make: BehaviorArrayMaker<S>) => (
	make(behavior)
)

export const contextual_behaviors_function = (
	<C, S extends Rec>(context: C) => (
		(m: (context: C) => BehaviorArrayMaker<S>) => (
			m(context)(behavior)
		)
	)
)
