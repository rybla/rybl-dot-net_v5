import * as ef from "@/ef";
import Top from "@/build/component/Top";
import type { PromiseElement, Resource, Route } from "@/ontology";
import PostPreview from "./PostPreview";

type Preview = { resource: Resource; element: JSX.Element };

export default async function IndexPage(props: {
  ctx: ef.Ctx.T;
  resources: Map<Route, Resource>;
}): PromiseElement {
  const previews: Preview[] = await ef.all<{}, Preview>({
    efs: props.resources
      .values()
      .toArray()
      .filterMap<ef.T<{}, Preview>>((res) => {
        switch (res.type) {
          case "post": {
            return ef.run({}, () => async (ctx) => ({
              resource: res,
              element: <PostPreview ctx={ctx} resource={res} />,
            }));
          }
        }
      }),
    input: {},
  })(props.ctx);

  previews.sort((p1, p2) => {
    if (
      p1.resource.metadata.publishDate?.type === "ok" &&
      p2.resource.metadata.publishDate?.type === "ok"
    ) {
      const date1 = p1.resource.metadata.publishDate.value;
      const date2 = p2.resource.metadata.publishDate.value;
      return date2.getDate() - date1.getDate();
    }
    return 0;
  });

  return (
    <Top
      resource_name="Index"
      resource_shortname="Index"
      content_head={
        <>
          <link rel="stylesheet" href="/asset/style/IndexPage.css" />
          <link rel="stylesheet" href="/asset/style/PostPreview.css" />
          <link rel="stylesheet" href="/asset/style/PostNameCard.css" />
        </>
      }
    >
      <div class="previews">
        {previews.map((preview) => (
          <div class="preview">{preview.element}</div>
        ))}
      </div>
    </Top>
  );
}
