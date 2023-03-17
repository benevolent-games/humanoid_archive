
// todo: add an example that uses 'local', which
// is non-networked entity-specific state.
// like babylon meshes and stuff.

behaviors(behavior => [

	behavior("counter increments each second")
		.selector(["count"])
		.lifecycle({
			created: () => {
				// entity is created
			},
			components_changed: ({added, deleted}) => {
				// handle components that have been added or deleted
			},
			activity: ({host, frequency, state}) => {
				if (host && frequency(1000))
					state.count += 1
			},
			deleted: () => {
				// entity is deleted
			},
		}),

	behavior("users can move objects")
		.selector(["position", "movable", "owner"])
		.activity(({frequency, user_id, client, host, state, context}) => {
			if (frequency(50) && state.owner === user_id) {
				const vector = move_vector_from_user_input(context.nub_context)
				client.send_to_host(vector)
			}
			if (host)
				for (const vector of host.inbox)
					state.position = v3.add(state.position, vector)
		}),
])
