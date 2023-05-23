
import {html} from "@benev/turtle"
import basic_page from "./partials/basic_page.html.js"

export default basic_page({
	html_class: "lab",
	title: "humanoid lab - benevolent.games",

	head: ({v}) => html`
		<script type=importmap-shim src="${v("/importmap.json")}"></script>
		<script type=module-shim defer src="/lab.js"></script>
		<script defer src="/node_modules/es-module-shims/dist/es-module-shims.wasm.js"></script>
	`,

	main: () => html`
		<h1 data-loading>lab.. open the console</h1>
	`,
})

