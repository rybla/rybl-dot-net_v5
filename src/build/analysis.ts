import * as ef from "@/ef";
import * as mdast from "mdast";
import {
  config,
  from_Href_to_Reference,
  from_Reference_to_Href,
  from_Reference_to_IconRoute,
  from_Route_to_Href,
  from_URL_to_iconHref,
  from_URL_to_iconRoute,
  get_name_of_Resource,
  get_name_of_Route,
  isoHref,
  isoRoute,
  joinRoutes,
  schemaHref,
  schemaResourceMetadata,
  schemaRoute,
  type Backlink,
  type ExternalReference,
  type Href,
  type Reference,
  type Route,
  type Website,
} from "@/ontology";
import { showNode } from "@/unified_util";
import { dedup, dedupInPlace, do_ } from "@/util";
import { visit, type BuildVisitor, type Test } from "unist-util-visit";
import * as YAML from "yaml";
import { applyHomomorphisms, stylizeLink } from "@/build/analysis/homomorphism";
import {
  addBacklinksSection,
  addReferencesSection,
  addTableOfContents,
  removeNameHeadingWrapper,
  setNameHeadingWrapperBackgroundToNameImage,
  wrapHeadings,
} from "./analysis/heteromorphism";
import { parseMarkdown } from "./parsing";

export const analyzeWebsite: ef.T<{
  website: Website;
}> = ef.run({ label: "analyzeWebsite" }, (input) => async (ctx) => {
  const references_global: Map<Href, Reference> = new Map();

  const registerReference_global = (src: Route, ref: Reference) => {
    // references_global
    references_global.set(from_Reference_to_Href(ref), ref);
    // referencesGraph
    const refs =
      input.website.referencesGraph.get(src) ??
      do_(() => {
        const refs: Map<Href, Reference> = new Map();
        input.website.referencesGraph.set(src, refs);
        return refs;
      });
    refs.set(from_Reference_to_Href(ref), ref);
    // backlinksGraph
    if (ref.type === "internal") {
      const refs =
        input.website.backlinksGraph.get(ref.value) ??
        do_(() => {
          const refs: Map<Href, Backlink> = new Map();
          input.website.backlinksGraph.set(ref.value, refs);
          return refs;
        });
      refs.set(from_Route_to_Href(src), {
        route: src,
        name: get_name_of_Route(input.website.resources, src),
      });
    }
  };

  await ef.run(
    { label: "populate metadata (sequential)" },
    () => async (ctx) => {
      for (const res of input.website.resources.values()) {
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

                  if (res.metadata.abstract !== undefined) {
                    res.metadata.abstract_markdown = await parseMarkdown({
                      content: res.metadata.abstract,
                    })(ctx);
                  }
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
      const efs_website: ef.T[] = input.website.resources
        .values()
        .map((res) =>
          ef.run({ label: `route: ${res.route}` }, () => async (ctx) => {
            const references_local: Map<Href, Reference> = new Map();

            const registerReference_local = (ref: Reference) => {
              registerReference_global(res.route, ref);
              res.references.push(ref);
              references_local.set(from_Reference_to_Href(ref), ref);
            };

            const efs_res: ef.T[] = [];
            switch (res.type) {
              case "post": {
                const visitor: BuildVisitor<mdast.Root> = (node) => {
                  efs_res.push(
                    ef.run({}, () => async () => {
                      switch (node.type) {
                        case "image": {
                          const href = await ef.safeParse(
                            schemaHref,
                            node.url,
                          )(ctx);
                          const ref = from_Href_to_Reference(href);
                          registerReference_local(ref);
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
                          registerReference_local(ref);

                          break;
                        }
                      }
                    }),
                  );
                };
                visit(res.root, visitor);

                if (res.metadata.abstract_markdown !== undefined) {
                  visit(res.metadata.abstract_markdown, visitor);
                }

                break;
              }
              default: {
                break;
              }
            }

            await ef.all({ efs: efs_res, input: {} })(ctx);

            res.references =
              input.website.referencesGraph
                .get(res.route)
                ?.values()
                .toArray() ?? [];
          }),
        )
        .toArray();

      await ef.all({ efs: efs_website, input: {} })(ctx);
    },
  )({})(ctx);

  await ef.run(
    { label: "populate metadata of references" },
    () => async (ctx) => {
      for (const ref of references_global.values()) {
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
    const refs = dedup(references_global.values(), (x) =>
      isoRoute.unwrap(from_Reference_to_IconRoute(x)),
    );

    const references_external: ExternalReference[] = [];
    for (const ref of refs) {
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
      efs: input.website.resources
        .values()
        .map((res) =>
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
                    `backlinksGraph.get("${res.route}")`,
                    input.website.backlinksGraph.get(res.route),
                    new Map<Href, Backlink>(),
                  )(ctx);
                  await addBacklinksSection({
                    root: res.root,
                    backlinks: backlinks.values().toArray(),
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

                  if (res.metadata.abstract !== undefined) {
                    await applyHomomorphisms({
                      root: res.metadata.abstract_markdown!,
                      params: {},
                      homomorphisms: {
                        stylizeLink,
                      },
                    })(ctx);
                  }

                  break;
                }
                default:
                  break;
              }
            },
          ),
        )
        .toArray(),
      input: undefined,
    })(ctx);
  })({})(ctx);
});
