import * as ef from "@/ef";
import {
  config,
  schemaRoute,
  type PostResource,
  type Resource,
  type Route,
  type Website,
} from "@/ontology";
import { render_jsx } from "@/util";
import Post from "@/build/component/Post";
import { generatePages } from "./generation/pages";

export const generateWebsite: ef.T<{
  website: Website;
}> = ef.run({ label: "generateWebsite" }, (input) => async (ctx) => {
  await useAssets(undefined)(ctx);
  await generatePages({ website: input.website })(ctx);
  await generateResources({ resources: input.website.resources })(ctx);
});

export const useAssets: ef.T = ef.run(
  { label: "useAssets" },
  () => async (ctx) => {
    const useLocalFilesUnderRoute = ef.run<
      { label: string; route: Route },
      void
    >({ label: (input) => input.label }, (input) => async (ctx) => {
      await ef.all({
        efs: (
          await ef.getSubRoutes({
            route: input.route,
          })(ctx)
        ).map((route) => ef.run({}, () => ef.useLocalFile({ input: route }))),
        input: {},
      })(ctx);
    });

    await ef.useLocalFile({
      input: config.route_of_favicon,
      output: schemaRoute.parse("/favicon.ico"),
    })(ctx);

    await useLocalFilesUnderRoute({
      label: "useStyles",
      route: config.route_of_styles,
    })(ctx);

    await useLocalFilesUnderRoute({
      label: "useIcons",
      route: config.route_of_icons,
    })(ctx);

    await useLocalFilesUnderRoute({
      label: "useNameImages",
      route: config.route_of_nameImages,
    })(ctx);

    await useLocalFilesUnderRoute({
      label: "useImages",
      route: config.route_of_images,
    })(ctx);

    await useLocalFilesUnderRoute({
      label: "useFonts",
      route: config.route_of_fonts,
    })(ctx);

    await useLocalFilesUnderRoute({
      label: "useScripts",
      route: config.route_of_scripts,
    })(ctx);
  },
);

const generateResources: ef.T<{ resources: Resource[] }> = ef.run(
  { label: "generateResources" },
  (input) => async (ctx) => {
    await ef.all({
      efs: input.resources.flatMap((resource) => {
        switch (resource.type) {
          case "post": {
            return [ef.run({}, () => generatePost({ resource }))];
          }
          default:
            return [];
        }
      }),
      input: {},
    })(ctx);
  },
);

const generatePost: ef.T<{ resource: PostResource }> = ef.run(
  {
    label: (input) => ef.label("generatePost", input.resource.route),
  },
  (input) => async (ctx) => {
    await ef.setRoute_textFile({
      route: input.resource.route,
      content: await render_jsx(<Post ctx={ctx} resource={input.resource} />),
    })(ctx);
  },
);
