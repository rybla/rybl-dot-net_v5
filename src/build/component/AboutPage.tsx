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
I'm Henry Blanchette, and this is my personal website.
The program that generates this website is available at [rybla/rybl-dot-net_v5](https://github.com/rybla/rybl-dot-net_v5).

## Overview

I am a programmer and researcher focused on:
- [programming language theory](https://en.wikipedia.org/wiki/Programming_language_theory)
- [formal specification and verification](https://en.wikipedia.org/wiki/Formal_verification.)
- [mathematical modeling and simulation](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)
- [user interface design](https://en.wikipedia.org/wiki/User_interface_design)
- [game design](https://en.wikipedia.org/wiki/Game_design)
- [economics and game theory](https://en.wikipedia.org/wiki/Game_theory)

## Cool Stuff

- [PureScript](https://www.purescript.org/): a general-purpose programming language inspired by Haskell that compiles to Javascript
- [Haskell](https://www.haskell.org/): a general-purpose programming language with the most advanced type system
- [Bun](https://bun.sh/): a fast Typescript/Javascript runtime implemented in Zig
- [Zed](https://zed.dev/): a fast editor implemented in Rust
- [Zig](https://ziglang.org/): a systems programming language with a minimalist design and advanced metaprogramming capabilities
- [Marginal Revolution](https://marginalrevolution.com/): an economics blog by [Tyler Cowen](https://x.com/tylercowen) and [Alex Tabarrok](https://x.com/ATabarrok)
- [Overcast](https://overcast.fm/): a simple podcast player app for iOS
- [Obsidian](https://obsidian.md/): a markdown-based notetaking app

## Research

My research interests have centered around programming languages, simulation, mathematical modeling, and data analysis.

| time | topic | association |
| --- | --- | --- |
| **2022-2024** | [Pantograph](https://pantographeditor.github.io/Pantograph/) ([acm](https://dl.acm.org/doi/10.1145/3704864)) -- a fluid and well-typed structure editor | with [Jacob Prinz](https://github.com/jeprinz); at [University of Maryland](https://www.umd.edu) |
| **2022-2023** | Liquid Flex -- extension of the [Flex](https://tangramflex.com/flex) language with refinement types | with [Tangram](https://www.tangramflex.com) |
| **2022** | [Zypr](https://github.com/rybla/zypr) -- a zipper-interfaced structure editor | with [Jacob Prinz](https://github.com/jeprinz); at [University of Maryland](https://www.umd.edu) |
| **2022** | [Liquid Proof Macros](https://github.com/rybla/lh-tactics-test) ([acm](https://dl.acm.org/doi/abs/10.1145/3546189.3549921)) -- tactical metaprogramming for Liquid Haskell proofs | with [Leonidas Lampropoulos](https://github.com/lemonidas) and [Niki Vazou](https://github.com/nikivazou); at [University of Maryland](https://www.umd.edu) |
| **2021** | [Extensional Equality in Liquid Haskell](https://github.com/rybla/liquid-monadic-selectionsort) | with [Leo Lampropolous](https://github.com/lemonidas), [Niki Vazou](https://github.com/nikivazou), and [Michael Greenberg](https://mgree.github.io); at [University of Maryland](https://www.umd.edu) |
| **2020** | Generalized Price Equation | with [Mark Bedau](http://people.reed.edu/~mab/); for the Artificial Life Lab at Reed College |
| **2020** | Separation Logic in Agda | with [Jim Fix](https://jimfix.github.io); at [Reed College](https://www.reed.edu) |
| **2019** | Gradual Verification | with [Jonathan Aldrich](http://www.cs.cmu.edu/~aldrich/); for REUSE at [CMU](https://www.cs.cmu.edu) |
| **2018** | [Reputation in Academic Citation Networks](https://arxiv.org/abs/2001.02293) | with Eitan Frachtenburg; at [Reed College](https://www.reed.edu) |
| **2018** | [Vector Calculus Vizualizations](http://people.reed.edu/~ormsbyk/projectproject/posts/milnor-fibrations.html) | with Kyle Ormsby for [Project Project](http://people.reed.edu/~ormsbyk/projectproject/posts/milnor-fibrations.html); at [Reed College](https://www.reed.edu) |
| **2017** | [Milnor Fibration Vizualizations](http://people.reed.edu/~ormsbyk/projectproject/posts/vector-calculus-demos.html) | with Kyle Ormsby; for [Project Project](https://people.reed.edu/~ormsbyk/projectproject/) at [Reed College](https://www.reed.edu) |

## Education and Employment

My education has centered around mathematics, computer science, and philosophy.
My employment has been in software engineering, theoretical computer science research, and software verification.

| time | event                                                                                                                                           |
| --- | --- |
| **2024** | worked as intern at [Oracle Labs](https://labs.oracle.com/pls/apex/r/labs/labs/intro) with [Harold Carr](https://labs.oracle.com/pls/apex/f?p=94065:11:23393226324575:2619) and [Mark Moir](https://labs.oracle.com/pls/apex/f?p=labs:bio:0:86) |
| **2022-2023** | worked as independent contractor at [Galois](https://galois.com/) with [Tangram](https://www.tangramflex.com) |
| **2022** | worked as summer intern at [Galois](https://galois.com/), developing the [Cryptol langauge](https://cryptol.net/) and verifying cyber-physical systems using [Coq](https://coq.inria.fr/) |
| **2021** | worked as summer intern at [Runtime Verification](https://runtimeverification.com/), verifying [Ethereum smart contracts](https://ethereum.org/en/developers/docs/smart-contracts/) using the [K Framework](https://kframework.org/) |
| **2020** | began PhD program in computer science at [University of Maryland](https://umd.edu) |
| **2020** | graduated undergraduate program at [Reed College](https://www.reed.edu) with BA in computer science. Thesis: [Thesis: Purity and Effect](https://github.com/rybla/Thesis-Purity-and-Effect) |
| **2016** | began undergraduate program at [Reed College](https://www.reed.edu) |
`);

export const proxy: PageProxyResource = {
  type: "PageProxy",
  metadata: {},
  references: [],
  root,
  route: config.route_of_AboutPage,
};

export default async function AboutPage(props: {
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
