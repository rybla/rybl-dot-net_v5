import type { Ctx } from "@/ef";
import {
  config,
  type PageProxyResource,
  type PromiseElement,
  type Website,
} from "@/ontology";
import {
  applyHomomorphisms,
  classRawLink,
  stylizeLink,
} from "../analysis/homomorphism";
import { parseMarkdown_static } from "../parsing/common";
import Markdown from "./Markdown";
import Top from "./Top";

const root = parseMarkdown_static(`
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
`);

export const proxy: PageProxyResource = {
  type: "PageProxy",
  metadata: {},
  references: [],
  root,
  route: config.route_of_ProfilesPage,
};

export default async function ProfilesPage(props: {
  ctx: Ctx.T;
  website: Website;
}): PromiseElement {
  await applyHomomorphisms({
    root,
    params: {},
    homomorphisms: {
      stylizeLink,
      classRawLink,
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
