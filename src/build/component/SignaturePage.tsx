import type { Ctx } from "@/ef";
import { config, type PromiseElement, type Website } from "@/ontology";
import { parseMarkdown } from "@/build/parsing";
import Top from "./Top";
import Markdown from "./Markdown";

export default async function SignaturePage(props: {
  ctx: Ctx.T;
  website: Website;
}): PromiseElement {
  const root = await parseMarkdown({
    content: `
\`\`\`
${config.key_public}
\`\`\`
`,
  })(props.ctx);

  return (
    <Top
      resource_name="Signature"
      resource_shortname="Signature"
      content_head={
        <>
          <link rel="stylesheet" href="/asset/style/SignaturePage.css" />
          <link rel="stylesheet" href="/asset/style/PostPreview.css" />
          <link rel="stylesheet" href="/asset/style/PostNameCard.css" />
        </>
      }
    >
      <div class="content">
        <Markdown ctx={props.ctx} root={root} />
      </div>
    </Top>
  );
}
