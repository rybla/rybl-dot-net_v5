import * as ef from "@/ef";
import {
  addResource,
  config,
  isoRoute,
  schemaRoute,
  type PostResource,
  type Resource,
  type Route,
  type Website,
} from "@/ontology";
import remarkDirective from "remark-directive";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import { unified } from "unified";
import * as mdast from "mdast";

export const parseWebsite: ef.T<unknown, Website> = ef.run(
  { label: "parseWebsite" },
  () => async (ctx) => {
    const website: Website = {
      name: config.name_of_website,
      url: config.url_of_website,
      resources: [],
    };

    const posts = await parsePosts({})(ctx);
    for (const post of posts)
      await addResource({ resource: post, website: website })(ctx);

    return website;
  },
);

const parsePosts: ef.T<unknown, Resource[]> = ef.run(
  { label: "parsePosts" },
  () => async (ctx) => {
    const resources: Resource[] = (
      await ef.all<{}, Resource[]>({
        opts: { batch_size: config.batchSize_of_postAnalysis },
        efs: (
          await ef.getSubRoutes({
            route: schemaRoute.parse("/post"),
          })(ctx)
        ).map((route) =>
          ef.run(
            {
              catch: (e) => async (ctx) => {
                await ef.tell(`${e}`)(ctx);
                return [
                  {
                    route: isoRoute.modify((r) => r.replace(".md", ".html"))(
                      route,
                    ),
                    references: [],
                    metadata: {},
                    type: "post",
                    root: {
                      type: "root",
                      children: [
                        {
                          type: "code",
                          value: e.toString(),
                        },
                      ],
                    },
                  } as PostResource,
                ];
              },
            },
            () => async (ctx) => [await parsePost({ route: route })(ctx)],
          ),
        ),
        input: {},
      })(ctx)
    ).flat();
    return resources;
  },
);

const parsePost: ef.T<{ route: Route }, Resource> = ef.run(
  { label: (input) => ef.label("parsePost", input.route) },
  (input) => async (ctx) => {
    const content = await ef.getRoute_textFile({ route: input.route })(ctx);
    const root = await parseMarkdown({ content })(ctx);
    return {
      route: isoRoute.modify((r) => r.replace(".md", ".html"))(input.route),
      references: [],
      metadata: {},
      type: "post",
      root,
    };
  },
);

export const parseMarkdown: ef.T<{ content: string }, mdast.Root> = ef.run(
  {},
  (input) => async (ctx) => {
    try {
      return unified()
        .use(remarkParse)
        .use(remarkFrontmatter, ["yaml"])
        .use(remarkGfm)
        .use(remarkDirective)
        .use(remarkMath, { singleDollarTextMath: false })
        .parse(input.content);
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new ef.EfError(e.toString());
      } else {
        throw e;
      }
    }
  },
);
