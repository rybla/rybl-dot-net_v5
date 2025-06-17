import * as ef from "@/ef";
import {
  from_Href_to_Reference,
  from_Reference_to_Href,
  isoHref,
  schemaHref,
  schemaResourceMetadata,
  type Reference,
  type Website,
} from "@/ontology";
import { showNode } from "@/unified_util";
import { dedupInPlace } from "@/util";
import { visit } from "unist-util-visit";
import * as YAML from "yaml";

export const analyzeWebsite: ef.T<{
  website: Website;
}> = ef.run({ label: "analyzeWebsite" }, (input) => async (ctx) => {
  const references_global: Reference[] = [];

  await ef.run(
    { label: "populate metadata (sequential)" },
    () => async (ctx) => {
      for (const res of input.website.resources) {
        await ef.run({ label: `route: ${res.route}` }, () => async (ctx) => {
          switch (res.type) {
            case "post": {
              // populate metadata from frontmatter
              {
                const yaml = res.root.children.find(
                  (node) => node.type === "yaml",
                );
                if (yaml === undefined) {
                  await ef.tell(`no frontmatter`)(ctx);
                } else {
                  const metadata_raw = YAML.parse(yaml.value);
                  const metadata = await ef.safeParse(
                    schemaResourceMetadata,
                    metadata_raw,
                  )(ctx);
                  res.metadata = metadata;
                }
              }

              // populate metadata.name
              {
                const headings = res.root.children.filter(
                  (n) => n.type === "heading",
                );
                const headings_depth1 = headings.filter((h) => h.depth === 1);
                if (headings_depth1.length === 0) {
                  await ef.tell(`no heading at depth 1`)(ctx);
                } else if (headings_depth1.length === 1) {
                  res.metadata.name = showNode(headings_depth1[0]!);
                } else if (headings_depth1.length > 1) {
                  await ef.tell(
                    `too many headings (${headings_depth1.length}) at depth 1`,
                  )(ctx);
                }
              }
              break;
            }
            default: {
              break;
            }
          }
        })({})(ctx);
      }
    },
  )({})(ctx);

  await ef.run(
    { label: "collect references (parallel)" },
    () => async (ctx) => {
      const ks: ef.T[] = input.website.resources.map((res) =>
        ef.run({ label: `route: ${res.route}` }, () => async (ctx) => {
          const ks: ef.T[] = [];
          switch (res.type) {
            case "post": {
              visit(res.root, (node) =>
                ks.push(
                  ef.run({}, () => async () => {
                    switch (node.type) {
                      case "image": {
                        const href = await ef.safeParse(
                          schemaHref,
                          node.url,
                        )(ctx);
                        const ref = from_Href_to_Reference(href);
                        res.references.push(ref);
                        references_global.push(ref);
                        break;
                      }
                      case "link": {
                        // convert all fragment hrefs to full hrefs
                        if (node.url.startsWith("#")) {
                          node.url = `${res.route}/${node.url}`;
                        }

                        const href = await ef.safeParse(
                          schemaHref,
                          node.url,
                        )(ctx);
                        const ref = from_Href_to_Reference(href);
                        res.references.push(ref);
                        references_global.push(ref);
                        break;
                      }
                    }
                  }),
                ),
              );
              break;
            }
            default: {
              break;
            }
          }

          await ef.all({ opts: {}, input: {}, ks })(ctx);

          dedupInPlace(res.references, (x) =>
            isoHref.unwrap(from_Reference_to_Href(x)),
          );
        }),
      );

      await ef.all({ opts: {}, input: {}, ks })(ctx);

      dedupInPlace(references_global, (x) =>
        isoHref.unwrap(from_Reference_to_Href(x)),
      );
    },
  )({})(ctx);

  await ef.run({ label: "create reference graph" }, () => async (ctx) => {
    await ef.tell("TODO")(ctx);
  })({})(ctx);

  await ef.run({ label: "apply transformations" }, () => async (ctx) => {
    await ef.tell("TODO")(ctx);
  })({})(ctx);
});
