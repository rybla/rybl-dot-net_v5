import type { Ctx } from "@/ef";
import {
  config,
  from_Route_to_Href,
  get_name_of_Reference,
  get_name_of_Resource,
  get_name_of_Route,
  isoHref,
  isoRoute,
  type PromiseElement,
  type Website,
} from "@/ontology";
import { parseMarkdown } from "@/build/parsing";
import Top from "./Top";
import Markdown from "./Markdown";
import { applyHomomorphisms, stylizeLink } from "../analysis/homomorphism";

export default async function ReferencesGraphPage(props: {
  ctx: Ctx.T;
  website: Website;
}): PromiseElement {
  const root = await parseMarkdown({
    content: `${props.website.referencesGraph
      .entries()
      .map(
        ([src, refs]) =>
          `- [${get_name_of_Route(props.website.resources, src)}](${isoHref.unwrap(from_Route_to_Href(src))})\n${refs
            .entries()
            .map(
              ([href, ref]) =>
                `  - [${get_name_of_Reference(props.website.resources, ref)}](${isoHref.unwrap(href)})`,
            )
            .toArray()
            .join("\n")}`,
      )
      .toArray()
      .join("\n")}`,
  })(props.ctx);

  await applyHomomorphisms({
    root,
    params: {},
    homomorphisms: {
      stylizeLink,
    },
  })(props.ctx);

  return (
    <Top
      resource_name="ReferencesGraph"
      resource_shortname="References Graph"
      content_head={
        <>
          <link rel="stylesheet" href="/asset/style/ReferencesGraphPage.css" />
        </>
      }
    >
      <div class="content">
        <Markdown ctx={props.ctx} root={root} />
      </div>
    </Top>
  );
}
