
import {Rec, System, Systematizer, System_Spec} from "./types.js"

export function system<State extends Rec>(name: string) {
	return <Keys extends keyof State>(
		s: System_Spec<State, Keys>,
	): System<State, Keys> => ({
		name,
		...s,
	})
}

export const systems = <State extends Rec>(
	make_systems: Systematizer<State>,
) => make_systems(name => system(name))
