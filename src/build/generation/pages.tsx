import * as ef from "@/ef";
import { config, type Website } from "@/ontology";
import { render_jsx } from "@/util";
import IndexPage from "../component/IndexPage";

export const generatePages: ef.T<{ website: Website }> = ef.run(
  { label: "generatePages" },
  (input) => async (ctx) => {
    await ef.all({
      opts: {},
      input: { website: input.website },
      ks: [generateIndexPage],
    })(ctx);
  },
);

const generateIndexPage: ef.T<{ website: Website }> = ef.run(
  { label: "generateIndexPage" },
  (input) => async (ctx) => {
    await ef.setRoute_textFile({
      route: config.route_of_IndexPage,
      content: await render_jsx(
        <IndexPage ctx={ctx} resources={input.website.resources} />,
      ),
    })(ctx);
  },
);
