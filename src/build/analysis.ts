import * as ef from "@/ef";
import {
  config,
  from_Href_to_Reference,
  from_Reference_to_Href,
  from_Reference_to_IconRoute,
  from_URL_to_iconHref,
  from_URL_to_iconRoute,
  isoHref,
  isoRoute,
  joinRoutes,
  schemaHref,
  schemaResourceMetadata,
  schemaRoute,
  type ExternalReference,
  type Reference,
  type Route,
  type Website,
} from "@/ontology";
import { showNode } from "@/unified_util";
import { dedup, dedupInPlace } from "@/util";
import { visit } from "unist-util-visit";
import * as YAML from "yaml";
import { applyHomomorphisms, stylizeLink } from "@/build/analysis/homomorphism";
import {
  addBacklinksSection,
  addReferencesSection,
  addTableOfContents,
  removeNameHeadingWrapper,
  setNameHeadingWrapperBackgroundToNameImage,
  wrapHeadings,
  type Backlink,
} from "./analysis/heteromorphism";

export const analyzeWebsite: ef.T<{
  website: Website;
}> = ef.run({ label: "analyzeWebsite" }, (input) => async (ctx) => {
  const references_global: Reference[] = [];
  const map_Route_to_Backlinks: Map<Route, Backlink[]> = new Map();

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
      const efs_website: ef.T[] = input.website.resources.map((res) =>
        ef.run({ label: `route: ${res.route}` }, () => async (ctx) => {
          const efs_res: ef.T[] = [];
          switch (res.type) {
            case "post": {
              visit(res.root, (node) => {
                efs_res.push(
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
                );
              });
              break;
            }
            default: {
              break;
            }
          }

          await ef.all({ efs: efs_res, input: {} })(ctx);

          dedupInPlace(res.references, (x) =>
            isoHref.unwrap(from_Reference_to_Href(x)),
          );
        }),
      );

      await ef.all({ efs: efs_website, input: {} })(ctx);

      dedupInPlace(references_global, (x) =>
        isoHref.unwrap(from_Reference_to_Href(x)),
      );
    },
  )({})(ctx);

  await ef.run(
    { label: "populate metadata of references" },
    () => async (ctx) => {
      for (const ref of references_global) {
        switch (ref.type) {
          case "external": {
            ref.metadata = await ef.fetchExternalReferenceMetadata({
              url: ref.value,
            })(ctx);
            break;
          }
          default: {
            break;
          }
        }
      }
    },
  )({})(ctx);

  await ef.run({ label: "use icons of references" }, () => async (ctx) => {
    await ef.tell(
      `references_global = ${references_global.map((ref) => ref.value)}`,
    )(ctx);

    const references = dedup(references_global, (x) =>
      isoRoute.unwrap(from_Reference_to_IconRoute(x)),
    );

    const references_external: ExternalReference[] = [];
    for (const ref of references) {
      switch (ref.type) {
        case "external": {
          references_external.push(ref);
          break;
        }
        default: {
          break;
        }
      }
    }

    await ef.all({
      efs: references_external.map((ref) =>
        ef.run({}, () => async (ctx) => {
          await ef.useRemoteFile({
            href: from_URL_to_iconHref(ref.value),
            output: from_URL_to_iconRoute(ref.value),
            input_default: config.iconRoute_placeholder,
          })(ctx);
        }),
      ),
      input: {},
    })(ctx);
  })({})(ctx);

  await ef.run({ label: "create reference graph" }, () => async (ctx) => {
    await ef.tell("TODO")(ctx);
  })({})(ctx);

  await ef.run({ label: "apply transformations" }, () => async (ctx) => {
    await ef.all({
      efs: input.website.resources.map((res) =>
        ef.run(
          {
            label: `route: ${res.route}`,
            catch: (err) => ef.tell(err.toString()),
          },
          () => async (ctx) => {
            switch (res.type) {
              case "post": {
                await addReferencesSection({
                  root: res.root,
                  resources: input.website.resources,
                  references: res.references,
                })(ctx);

                const backlinks = await ef.defined(
                  `map_Route_to_Backlinks.get("${res.route}")`,
                  map_Route_to_Backlinks.get(res.route),
                  [],
                )(ctx);
                await addBacklinksSection({
                  root: res.root,
                  backlinks,
                })(ctx);

                await applyHomomorphisms({
                  root: res.root,
                  params: {},
                  homomorphisms: {
                    stylizeLink,
                  },
                })(ctx);

                await addTableOfContents({
                  route: res.route,
                  root: res.root,
                })(ctx);

                await wrapHeadings({ root: res.root })(ctx);

                // if (res.metadata.nameImage !== undefined) {
                //   const nameImage = joinRoutes(
                //     config.route_of_nameImages,
                //     schemaRoute.parse(`/${res.metadata.nameImage}`),
                //   );
                //   await setNameHeadingWrapperBackgroundToNameImage({
                //     root: res.root,
                //     name: res.metadata.name ?? "Untitled",
                //     nameImage,
                //   })(ctx);
                // }

                await removeNameHeadingWrapper({ root: res.root })(ctx);

                break;
              }
              default:
                break;
            }
          },
        ),
      ),
      input: undefined,
    })(ctx);
  })({})(ctx);
});
