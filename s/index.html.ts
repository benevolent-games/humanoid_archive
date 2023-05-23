
import {html} from "@benev/turtle"
import basic_page from "./partials/basic_page.html.js"

export default basic_page({
	html_class: "humanoid",
	title: "humanoid - benevolent.games",

	head: ({v}) => html`
		<script defer src="/assets/ammo/ammo.wasm.js"></script>
		<script>
			const isDevMode = new URLSearchParams(window.location.search).has("dev")

			function loadModule(type, src) {
				const script = document.createElement("script")
				script.defer = true
				script.type = type
				script.src = src
				document.head.appendChild(script)
			}

			if (isDevMode) {
				loadModule("importmap-shim", "${v("/importmap.json")}")
				loadModule("module-shim", "/demo.js")
				loadModule("module", "/node_modules/es-module-shims/dist/es-module-shims.wasm.js")
			}
			else {
				loadModule("module", "/demo.bundle.min.js")
			}
		</script>
	`,

	main: () => html`
		<h1 data-loading>humanoid is loading...</h1>
		<benev-theater view-mode="cinema"></benev-theater>
	`,
})

