
import {html, HtmlTemplate} from "xiome/x/toolbox/hamster-html/html.js"
import {WebsiteContext} from "xiome/x/toolbox/hamster-html/website/build-website-types.js"

import headBasicsHtml from "./head-basics.html.js"

export default ({
	v,
	main,
	head,
	title,
	html_class,
	...options
}: WebsiteContext & {
	title: string
	html_class: string
	head?: HtmlTemplate
	main?: HtmlTemplate
}) => html`

<!doctype html>
<html class="${html_class}">
	<head>
		${headBasicsHtml({...options, v, title})}
		${head}
	</head>
	<body>
		${main}
	</body>
</html>

`
