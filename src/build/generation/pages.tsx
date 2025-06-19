import * as ef from "@/ef";
import { config, type Website } from "@/ontology";
import { render_jsx } from "@/util";
import IndexPage from "../component/IndexPage";
import TagsPage from "../component/TagsPage";
import AboutPage from "../component/AboutPage";
import ProfilesPage from "../component/ProfilesPage";

export const generatePages: ef.T<{ website: Website }> = ef.run(
  { label: "generatePages" },
  (input) => async (ctx) => {
    await ef.all({
      input: {},
      efs: [
        ef.run({ label: "generateIndexPage" }, () => async (ctx) => {
          await ef.setRoute_textFile({
            route: config.route_of_IndexPage,
            content: await render_jsx(
              <IndexPage ctx={ctx} resources={input.website.resources} />,
            ),
          })(ctx);
        }),
        ef.run({ label: "generateTagsPage" }, () => async (ctx) => {
          await ef.setRoute_textFile({
            route: config.route_of_TagsPage,
            content: await render_jsx(
              <TagsPage ctx={ctx} resources={input.website.resources} />,
            ),
          })(ctx);
        }),
        ef.run({ label: "generateAboutPage" }, () => async (ctx) => {
          await ef.setRoute_textFile({
            route: config.route_of_AboutPage,
            content: await render_jsx(
              <AboutPage ctx={ctx} website={input.website} />,
            ),
          })(ctx);
        }),
        ef.run({ label: "generateProfilesPage" }, () => async (ctx) => {
          await ef.setRoute_textFile({
            route: config.route_of_ProfilesPage,
            content: await render_jsx(
              <ProfilesPage ctx={ctx} website={input.website} />,
            ),
          })(ctx);
        }),
      ],
    })(ctx);
  },
);
