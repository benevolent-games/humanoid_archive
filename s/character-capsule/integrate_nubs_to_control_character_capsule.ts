
import {NubContext, NubEffectEvent} from "@benev/nubs"
import {Speeds} from "@benev/toolbox/x/trajectory/types/speeds.js"
import {make_character_capsule} from "./make_character_capsule.js"
import {add_user_pointer_movements_to_look} from "@benev/toolbox/x/babylon/flycam/utils/add_user_pointer_movements_to_look.js"
import {get_user_look_trajectory_from_keys_and_stick} from "@benev/toolbox/x/babylon/flycam/utils/get_user_look_trajectory_from_keys_and_stick.js"
import {get_user_move_trajectory_from_keys_and_stick} from "@benev/toolbox/x/babylon/flycam/utils/get_user_move_trajectory_from_keys_and_stick.js"

export function integrate_nubs_to_control_character_capsule({
		capsuleTransformNode, look_sensitivity,
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
		capsuleTransformNode: ReturnType<typeof make_character_capsule>
	}) {

	NubEffectEvent
	.target(nub_context)
	.listen(

		add_user_pointer_movements_to_look({
			effect: "look",
			sensitivity: look_sensitivity.pointer,
			cause_to_use_when_pointer_not_locked: "Lookpad",
			add_look: capsuleTransformNode.add_look,
			is_pointer_locked: () => !!document.pointerLockElement,
		})
	)

	function simulate() {

		capsuleTransformNode.add_move(
			get_user_move_trajectory_from_keys_and_stick(
				nub_context,
				speeds_for_movement,
			)
		)

		capsuleTransformNode.add_look(
			get_user_look_trajectory_from_keys_and_stick(
				nub_context,
				speeds_for_looking_with_keys_and_stick,
				look_sensitivity.stick,
			)
		)
	}

	render_loop.add(simulate)

	return capsuleTransformNode

}
