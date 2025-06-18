import { config, isoRoute } from "@/ontology";
import Icon from "@/build/component/Icon";

export default function Header(props: { resource_shortname: string }) {
  return (
    <header>
      <div class="logo">
        <img src={isoRoute.unwrap(config.route_of_profileImage)} />
      </div>
      <div class="name">
        <div class="website_name">
          <a href="/" safe>
            {config.name_of_website}
          </a>
        </div>
        <div class="separator" />
        <div class="resource_shortname">
          <div safe>{props.resource_shortname}</div>
        </div>
      </div>
      <div class="menu">
        <a href={isoRoute.unwrap(config.route_of_IndexPage)} class="item">
          <Icon.Library />
        </a>
        <a href={isoRoute.unwrap(config.route_of_TagsPage)} class="item">
          <Icon.Tag />
        </a>
        <a href={isoRoute.unwrap(config.route_of_AboutPage)} class="item">
          <Icon.Info />
        </a>
        <a href={isoRoute.unwrap(config.route_of_ProfilesPage)} class="item">
          <Icon.Globe />
        </a>
      </div>
    </header>
  );
}
