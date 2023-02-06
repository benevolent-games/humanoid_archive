
import {html} from "xiome/x/toolbox/hamster-html/html.js"
import {WebsiteContext} from "xiome/x/toolbox/hamster-html/website/build-website-types.js"

import pageHtml from "../partials/page.html.js"

export default (context: WebsiteContext) => pageHtml({
	...context,
	mainContent: html`
		<h1 data-loading>humanoid is loading...</h1>
		<nub-context
			bindings="
			👼 Cool Default Bindings
			🖱️ look :: lookmouse
			🕹️ look :: lookstick
			🕹️ move :: movestick
			*️⃣ forward :: KeyW ArrowUp
			*️⃣ backward :: KeyS ArrowDown
			*️⃣ leftward :: KeyA ArrowLeft
			*️⃣ rightward :: KeyD ArrowRight
			*️⃣ jump :: Space
			*️⃣ use :: KeyF Mouse3
			*️⃣ primary :: Mouse1
			*️⃣ secondary :: Mouse2
			">
			<nub-real-keyboard></nub-real-keyboard>
			<nub-real-mouse name=lookmouse></nub-real-mouse>
			<div class="wrap-sticks">
				<nub-stick name=movestick></nub-stick>
				<nub-stick name=lookstick></nub-stick>
			</div>
		</nub-context>
		<benev-theater></benev-theater>
	`,
})
