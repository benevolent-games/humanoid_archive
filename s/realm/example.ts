
import {system} from "./internal/system.js"
import {makeRealmEcs, octo, uniformEcsContext} from "./ecs.js"

export interface Components {
	count: number
	position: [number, number, number]
}

// const netcode = await octo.host({
// 	label: "my game session",
// 	signalServerUrl: "wss://sparrow-rtc.benevolent.games/",
// })

const ecs = uniformEcsContext<Components>()

ecs.systems.add(
	system<Components>()
		.label("counter")
		.selector(({count}) => ({count}))
		.executor(({count}) => ({count: count + 1})),
)

ecs.entities.insert({count: 100})
