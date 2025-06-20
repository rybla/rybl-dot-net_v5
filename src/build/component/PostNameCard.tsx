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
  if (props.nameImage === undefined) {
    return (
      <div class="PostNameCard without_nameImage">
        {
          <>
            {/* <h1 class="layer1" safe>
              {props.name ?? "Untitled"}
            </h1> */}
            <h1 class="layer2">
              <a href={isoRoute.unwrap(props.route)} safe>
                {props.name ?? "Untitled"}
              </a>
            </h1>
          </>
        }
      </div>
    );
  } else {
    const nameImage_src = joinRoutes(
      config.route_of_nameImages,
      schemaRoute.parse(`/${props.nameImage}`),
    );
    return (
      <div class="PostNameCard with_nameImage">
        <img src={isoRoute.unwrap(nameImage_src)} />
        {
          <>
            <h1 class="layer1" safe>
              {props.name ?? "Untitled"}
            </h1>
            <h1 class="layer2">
              <a href={isoRoute.unwrap(props.route)} safe>
                {props.name ?? "Untitled"}
              </a>
            </h1>
          </>
        }
      </div>
    );
  }
}
