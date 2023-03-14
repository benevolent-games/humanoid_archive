
import {html, HtmlTemplate} from "xiome/x/toolbox/hamster-html/html.js"
import {WebsiteContext} from "xiome/x/toolbox/hamster-html/website/build-website-types.js"

import headBasicsHtml from "./head-basics.html.js"

export default ({
	v, mainContent,
	headContent,
	htmlClass = "",
	...options
}: WebsiteContext & {
	htmlClass?: string
	headContent?: HtmlTemplate
	mainContent?: HtmlTemplate
}) => html`

<!doctype html>
<html class="${htmlClass}">
<head>
	${headBasicsHtml({...options, v, title: "humanoid"})}
	${html`
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
		`}
	${headContent}
</head>
<body>
	${mainContent}
</body>
`
