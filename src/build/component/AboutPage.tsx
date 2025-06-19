import type { Ctx } from "@/ef";
import type { PromiseElement, Website } from "@/ontology";
import Top from "./Top";
import Markdown from "./Markdown";
import { parseMarkdown } from "@/build/parsing";

export default async function AboutPage(props: {
  ctx: Ctx.T;
  website: Website;
}): PromiseElement {
  const root = await parseMarkdown({
    content: `
I'm Henry Blanchette.

I spend most of my time programming.

Here are few programs I especially like using for development:
- [Haskell](https://www.haskell.org/): a general-purpose programming language with the most advanced type system.
- [PureScript](https://www.purescript.org/): a general-purpose programming language inspired by Haskell that compiles to Javascript.
- [Zig](https://ziglang.org/): a systems programming language with a minimalist design and advanced metaprogramming capabilities.
- [Bun](https://bun.sh/): a fast Typescript/Javascript runtime implemented in Zig.
- [Zed](https://zed.dev/): a fast editor implemented in Rust.
`,
  })(props.ctx);

  return (
    <Top
      resource_name="About"
      resource_shortname="About"
      content_head={
        <>
          <link rel="stylesheet" href="/asset/style/AboutPage.css" />
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
