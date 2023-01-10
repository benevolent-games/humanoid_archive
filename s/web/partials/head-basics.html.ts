
import {html} from "xiome/x/toolbox/hamster-html/html.js"
import {WebsiteContext} from "xiome/x/toolbox/hamster-html/website/build-website-types.js"

export default ({title, v}: WebsiteContext & {title: string}) => html`

<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="darkreader" content="dark"/>
<title>${title}</title>

<link rel=stylesheet href="${v("/index.css")}"/>
`
