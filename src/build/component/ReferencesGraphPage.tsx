import type { Ctx } from "@/ef";
import {
  config,
  from_Reference_to_Href,
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
import {
  applyHomomorphisms,
  classRawLink,
  stylizeLink,
} from "../analysis/homomorphism";
import { do_ } from "@/util";

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
      classRawLink,
    },
  })(props.ctx);

  let freshIdCounter = 0;
  function freshId() {
    return freshIdCounter++;
  }

  // indexed by url
  const nodes: Map<string, { id: number; label: string; url: string }> =
    new Map();
  const edges: { from: number; to: number }[] = [];

  for (const [source, refs] of props.website.referencesGraph) {
    const url = from_Route_to_Href(source);
    const id_source = freshId();
    nodes.set(isoHref.unwrap(url), {
      id: id_source,
      label: get_name_of_Route(props.website.resources, source),
      url: isoHref.unwrap(url),
    });

    for (const ref of refs.values()) {
      let node =
        nodes.get(isoHref.unwrap(from_Reference_to_Href(ref))) ||
        do_(() => {
          const node = {
            id: freshId(),
            label: get_name_of_Reference(props.website.resources, ref),
            url: isoHref.unwrap(from_Reference_to_Href(ref)),
          };
          nodes.set(isoHref.unwrap(from_Reference_to_Href(ref)), node);
          return node;
        });
      edges.push({
        from: id_source,
        to: node.id,
      });
    }
  }

  return (
    <Top
      resource_name="ReferencesGraph"
      resource_shortname="References Graph"
      content_head={
        <>
          <script
            type="text/javascript"
            src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"
          ></script>

          <link rel="stylesheet" href="/asset/style/ReferencesGraphPage.css" />
        </>
      }
    >
      <div class="content">
        <div id="graph-container"></div>
        <script
          type="text/javascript"
          src="asset/script/references_graph.js"
        ></script>
        <script>{`createGraph(${JSON.stringify(nodes.values().toArray())}, ${JSON.stringify(edges)})`}</script>
        <Markdown ctx={props.ctx} root={root} />
      </div>
    </Top>
  );
}
