
import {V3} from "@benev/toolbox/x/utils/v3.js"
import {Quat} from "@benev/toolbox/x/utils/quat.js"

import {World} from "./world.js"
import {systems} from "./system.js"

/*

type GameState = {
	count: number
	position: [number, number, number]
	velocity: [number, number, number]
	interpolate: number
}

const meta = make_babylonjs_meta()

simulator<GameState>("host counting")({
	frequency: 0,
	selector: ["count"],
	behaviors: [
		["count increases", ({state, net}) => {
			for (const message of net.messages_from_client) {
				if (message === "increment")
					state.count += 11
			}
		}],
	],
})

replicator<GameState>("client counting")({
	frequency: 1000,
	selector: ["count"],
	behaviors: [
		["count increases", ({state, net}) => {
			net.send_message_to_host("increment")
		}],
	],
})

simulator<GameState>("physics")({
	frequency: 0,
	selector: ["position", "veocity"],
	behaviors: [
		["velocity moves objects", ({state}) => {
			state.position = vector3.add(state.position, state.velocity)
		}],
	],
})

replicator<GameState>("client interpolation")({
	frequency: 0,
	selector: ["position", "interpolate"],
	behaviors: [
		["interpolate position", ({id, state, meta}) => {
			const current_rendered_position = meta.getPosition(id)
			const interpolated_position = vector3.interpolate(
				current_rendered_position,
				state.position,
			)
			meta.setPosition(interpolated_position)
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
