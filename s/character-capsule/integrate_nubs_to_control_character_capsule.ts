
import {NubContext} from "@benev/nubs"
import {Scene} from "@babylonjs/core/scene.js"
import {Speeds} from "@benev/toolbox/x/trajectory/types/speeds.js"
import {make_character_capsule} from "./make_character_capsule.js"
import {get_user_move_trajectory_from_keys_and_stick} from "@benev/toolbox/x/babylon/flycam/utils/get_user_move_trajectory_from_keys_and_stick.js"

export function integrate_nubs_to_control_character_capsule({
		scene, nub_context, render_loop,
		speeds_for_movement
	}: {
		scene: Scene
		nub_context: NubContext
		render_loop: Set<() => void>
		speeds_for_movement: Speeds
	}) {

	const capsule = make_character_capsule({
		scene,
		position: [0, 5, 8]
	})

	function simulate() {

		capsule.add_move(
			get_user_move_trajectory_from_keys_and_stick(
				nub_context,
				speeds_for_movement,
			)
		)

	}

	render_loop.add(simulate)

}
