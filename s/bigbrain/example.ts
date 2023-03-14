
import {V3} from "@benev/toolbox/x/utils/v3.js"
import {Quat} from "@benev/toolbox/x/utils/quat.js"

import {World} from "./world.js"
import {systems} from "./system.js"

/*

type GameState = {
	count: number
	networked: boolean
}

const meta = make_babylonjs_meta()

system<GameState>("counting")({
	selector: ["count", "networked"],
	frequency: 1000,
	behaviors: [

		["the client increases the count", ({state, net}) => {
			for (const message of net.messages_from_client)
				if (message === "increment")
					state.count += 1

			if (net.client)
				net.send_message_to_host("increment")

			meta.render_count(state.count)
		}],
	],
})

*/

export type Game_State = {

	transform: {
		position: V3
		orientation: Quat
	}

	health: {
		value: number
	}

	controllable: {
		client_id: number
	}
}

export type Game_Meta = {
	scene: any
	engine: any
}

export function make_game() {

	const meta: Game_Meta = {
		scene: {},
		engine: {},
	}

const world = new World<Game_State>(system => [
	system("walking around")({
		selector: ["transform", "health"],
		frequency: 1000,
		behaviors: [
			["being out-of-bounds causes damage", ({transform, health}) => {
				if (transform.position[0] > 10)
					health.value -= 5
			}],
		],
	}),
])
}

export class Game {

	#meta: Game_Meta = {
		scene: {},
		engine: {},
	}

	#world = new World<Game_State>(system => [

	])
}

export const s2 = systems<Game_State>(sys => [

	sys("walking around")({
		selector: ["transform"],
		frequency: 1000,
		behaviors: [

			["being out-of-bounds causes damage", state => {
				state.transform
			}],

		],
	}),
])
