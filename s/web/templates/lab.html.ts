
import {html} from "xiome/x/toolbox/hamster-html/html.js"
import {WebsiteContext} from "xiome/x/toolbox/hamster-html/website/build-website-types.js"

import pageHtml from "../partials/page.html.js"

export default (context: WebsiteContext) => pageHtml({
	...context,
	title: "lab",
	html_class: "lab",
	head: html`
		<script type=importmap-shim src="${context.v("/importmap.json")}"></script>
		<script type=module-shim defer src="/lab.js"></script>
		<script defer src="/node_modules/es-module-shims/dist/es-module-shims.wasm.js"></script>
	`,
	main: html`
		<h1 data-loading>lab.. open the console</h1>
	`,
})
