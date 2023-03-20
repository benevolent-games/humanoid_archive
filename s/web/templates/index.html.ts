
import {html} from "xiome/x/toolbox/hamster-html/html.js"
import {WebsiteContext} from "xiome/x/toolbox/hamster-html/website/build-website-types.js"

import pageHtml from "../partials/page.html.js"

export default (context: WebsiteContext) => pageHtml({
	...context,
	title: "humanoid",
	html_class: "humanoid",
	head: html`
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
				loadModule("importmap-shim", "${context.v("/importmap.json")}")
				loadModule("module-shim", "/demo.js")
				loadModule("module", "/node_modules/es-module-shims/dist/es-module-shims.wasm.js")
			}
			else {
				loadModule("module", "/demo.bundle.min.js")
			}
		</script>
	`,
	main: html`
		<h1 data-loading>humanoid is loading...</h1>
		<benev-theater view-mode="cinema"></benev-theater>
	`,
})
