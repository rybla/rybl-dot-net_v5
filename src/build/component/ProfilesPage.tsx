import type { Ctx } from "@/ef";
import type { PromiseElement, Website } from "@/ontology";
import { parseMarkdown } from "@/build/parsing";
import Top from "./Top";
import Markdown from "./Markdown";
import { applyHomomorphisms, stylizeLink } from "../analysis/homomorphism";

export default async function ProfilesPage(props: {
  ctx: Ctx.T;
  website: Website;
}): PromiseElement {
  const root = await parseMarkdown({
    content: `
This is the __profiles__ page.

The following are my personal profiles on various websites.

- [GitHub](https://github.com/)
- [GitLab](https://gitlab.com/rybl)
- [X/Twitter](https://x.com/rybl4)
- [BlueSky](https://bsky.app/profile/rybl.net)
- [LinkedIn](https://www.linkedin.com/in/henry-blanchette-520542a1/)
- [YouTube](https://www.youtube.com/@SpiralSpawn52)
- [SoundCloud](https://soundcloud.com/spiralspawn52)
- [Programming Languages Lab (PLUM) at University of Maryland](https://plum-umd.github.io/people/#_people/henry_blanchette.md)
- [Project Project at Reed College](https://blogs.reed.edu/projectproject/author/blancheh/)
`,
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
      resource_name="Profiles"
      resource_shortname="Profiles"
      content_head={
        <>
          <link rel="stylesheet" href="/asset/style/ProfilesPage.css" />
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
