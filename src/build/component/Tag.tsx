import {
  at_id_of_Route,
  config,
  isoRoute,
  type PromiseElement,
} from "@/ontology";
import Icon from "./Icon";

export default async function Tag(props: {
  tag: string;
  onTagsPage?: boolean;
}): PromiseElement {
  return (
    <a
      class="Tag"
      href={
        props.onTagsPage === true
          ? `#${props.tag}`
          : isoRoute.unwrap(at_id_of_Route(config.route_of_TagsPage, props.tag))
      }
    >
      <Icon.Hash />
      <div class="name" safe>
        {props.tag}
      </div>
    </a>
  );
}
