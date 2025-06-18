import {
  config,
  isoRoute,
  joinRoutes,
  schemaRoute,
  type PromiseElement,
  type Route,
} from "@/ontology";

export default async function PostNameCard(props: {
  route: Route;
  name: string | undefined;
  nameImage: string | undefined;
}): PromiseElement {
  const content = (
    <h1>
      <a href={isoRoute.unwrap(props.route)} safe>
        {props.name ?? "Untitled"}
      </a>
    </h1>
  );

  if (props.nameImage === undefined) {
    return <div class="PostNameCard without_nameImage">{content}</div>;
  } else {
    const nameImage_src = joinRoutes(
      config.route_of_nameImages,
      schemaRoute.parse(`/${props.nameImage}`),
    );
    return (
      <div class="PostNameCard with_nameImage">
        <img src={isoRoute.unwrap(nameImage_src)} />
        {content}
      </div>
    );
  }
}
