import * as ef from "@/ef";
import { type PromiseElement } from "@/ontology";
import * as mdast from "mdast";

import * as hast from "hast";
import rehypeFormat from "rehype-format";
import rehypeMathJaxSvg from "rehype-mathjax/svg";
import rehypeMathJax from "rehype-mathjax";
import rehypeStringify from "rehype-stringify";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

/*
TODO:
- move stylizeLink here
- move stylizeHeading here
*/

export default async function Markdown(props: {
  ctx: ef.Ctx.T;
  root: mdast.Root;
}): PromiseElement {
  const root_hast: hast.Root = await unified()
    .use(remarkRehype)
    .use(rehypeMathJax)
    .use(rehypeFormat)
    .run(props.root);
  const content = unified().use(rehypeStringify).stringify(root_hast);

  return content;
}
