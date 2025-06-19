import type { Ctx } from "@/ef";
import { config, type PromiseElement, type Website } from "@/ontology";
import { parseMarkdown } from "@/build/parsing";
import Top from "./Top";
import Markdown from "./Markdown";

export default async function ReferencesGraphPage(props: {
  ctx: Ctx.T;
  website: Website;
}): PromiseElement {
  return (
    <Top
      resource_name="ReferencesGraph"
      resource_shortname="ReferencesGraph"
      content_head={
        <>
          <link rel="stylesheet" href="/asset/style/ReferencesGraphPage.css" />
        </>
      }
    >
      <div class="content">TODO: ReferencesGraph</div>
    </Top>
  );
}
