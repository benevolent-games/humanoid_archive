
import {NubContext, NubEffectEvent} from "@benev/nubs"
import {Speeds} from "@benev/toolbox/x/trajectory/types/speeds.js"
import {make_character_capsule} from "./make_character_capsule.js"
import {add_user_pointer_movements_to_look} from "@benev/toolbox/x/babylon/flycam/utils/add_user_pointer_movements_to_look.js"
import {get_user_look_trajectory_from_keys_and_stick} from "@benev/toolbox/x/babylon/flycam/utils/get_user_look_trajectory_from_keys_and_stick.js"
import {get_user_move_trajectory_from_keys_and_stick} from "@benev/toolbox/x/babylon/flycam/utils/get_user_move_trajectory_from_keys_and_stick.js"
import {Robot_puppet} from "../utils/robot-puppet2.js"
import {V2} from "@benev/nubs/x/tools/v2.js"

export function integrate_nubs_to_control_character_capsule({
		robot_puppet, look_sensitivity,
		nub_context, render_loop,
		speeds_for_movement,
		speeds_for_looking_with_keys_and_stick,
	}: {
		nub_context: NubContext
		look_sensitivity: {
			stick: number
			pointer: number
		}
		speeds_for_movement: Speeds
		render_loop: Set<() => void>
		speeds_for_looking_with_keys_and_stick: Speeds
		robot_puppet: Robot_puppet
	}) {

	NubEffectEvent
	.target(nub_context)
	.listen(

		add_user_pointer_movements_to_look({
			effect: "look",
			sensitivity: look_sensitivity.pointer,
			cause_to_use_when_pointer_not_locked: "Lookpad",
			add_look: (vector: V2) => robot_puppet.look(vector),
			is_pointer_locked: () => !!document.pointerLockElement,
		})
	)

	function simulate() {

		robot_puppet.move(
			get_user_move_trajectory_from_keys_and_stick(
				nub_context,
				speeds_for_movement,
			)
		)

		robot_puppet.look(
			get_user_look_trajectory_from_keys_and_stick(
				nub_context,
				speeds_for_looking_with_keys_and_stick,
				look_sensitivity.stick,
			)
		)
	}

	render_loop.add(simulate)

	return robot_puppet

}
