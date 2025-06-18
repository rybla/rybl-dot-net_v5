import * as ef from "@/ef";
import {
  from_Href_to_iconRoute,
  from_Route_to_Href,
  isoHref,
  schemaHref,
} from "@/ontology";
import { type UnionToIntersection } from "@/util";
import * as mdast from "mdast";
import { visit } from "unist-util-visit";

/**
 * A {@link mdast.Node} transformaton that only effects a single node.
 */
export type Homomorphism<Params = {}> = ef.T<{
  params: Params;
  node: mdast.Node;
}>;

export type GetParams<H extends Homomorphism<any>> =
  H extends Homomorphism<infer P> ? P : never;

export const applyHomomorphisms =
  <HomomorphismsMap extends { [key: string]: Homomorphism<any> }>(input: {
    root: mdast.Root;
    params: UnionToIntersection<
      {
        [K in keyof HomomorphismsMap]: GetParams<HomomorphismsMap[K]>;
      }[keyof HomomorphismsMap]
    >;
    homomorphisms: {
      [K in keyof HomomorphismsMap]: HomomorphismsMap[K];
    };
  }) =>
  async (ctx: ef.Ctx.T) => {
    const efs: ef.T[] = [];
    visit(input.root, (node) => {
      efs.push(
        ef.run({}, () => async (ctx) => {
          for (const h of Object.values(input.homomorphisms))
            await h({ params: input.params, node })(ctx);
        }),
      );
    });
    await ef.all({ efs, input: {} })(ctx);
  };

export const stylizeLink: Homomorphism<{}> = ef.run(
  {},
  (input) => async (ctx) => {
    if (input.node.type === "link") {
      const link = input.node as mdast.Link;
      await ef.run(
        { label: ef.label("stylizeLink", { href: link.url }) },
        () => async (ctx) => {
          const href = await ef.safeParse(schemaHref, link.url)(ctx);

          link.data = link.data ?? {};
          link.data.hProperties = link.data.hProperties ?? {};
          link.data.hProperties.class = "LinkWithIcon";
          link.children = [
            {
              type: "image",
              data: {
                hProperties: {
                  class: "icon",
                },
              },
              url: isoHref.unwrap(
                from_Route_to_Href(from_Href_to_iconRoute(href)),
              ),
            },
            {
              type: "textDirective",
              name: "span",
              data: {
                hName: "span",
                hProperties: {
                  class: "label",
                },
              },
              children: link.children,
            },
          ];
        },
      )({})(ctx);
    }
  },
);
