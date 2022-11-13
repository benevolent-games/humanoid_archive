
import {makeRealmEcs} from "./ecs.js"

export interface Components {
	count: number
	position: [number, number, number]
}

const realm = makeRealmEcs<Components>(({system}) => ({
	systems: [
		system()
			.label("counter")
			.selector(c => ({count: c.count}))
			.executor(s => ({count: s.count + 1})),
	],
}))

realm.addEntity({count: 0})
