
// let v3: any
// let move_vector_from_user_input: any
// function behaviors(b: any) {}

// behaviors(behavior => [

// 	behavior("example counter increment each second")
// 		.selector(["count"])
// 		.activity(({meta, state}) => {
// 			if (meta.host && meta.frequency(1000))
// 				state.count += 1
// 		}),

// 	behavior("player can move")
// 		.selector(["character", "position", "owner"])
// 		.activity(({id, meta, state, local}) => {

// 			if (meta.host)
// 				for (const vector of meta.messages_from_client)
// 					state.position = v3.add(state.position, vector)

// 			else if (meta.frequency(50) && state.owner === id) {
// 				const vector = move_vector_from_user_input(local.nub_context)
// 				meta.send_message_to_host(vector)
// 			}
// 		}),
// ])
