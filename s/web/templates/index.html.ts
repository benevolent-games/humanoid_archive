
import {html} from "xiome/x/toolbox/hamster-html/html.js"
import {WebsiteContext} from "xiome/x/toolbox/hamster-html/website/build-website-types.js"

import pageHtml from "../partials/page.html.js"

export default (context: WebsiteContext) => pageHtml({
	...context,
	mainContent: html`
		<h1 data-loading>humanoid is loading...</h1>
		<benev-theater view-mode="cinema"></benev-theater>
	`,
})
