import Icon from "@/build/component/Icon";
import { config, isoRoute } from "@/ontology";

export type Props = { resource_shortname: string };

export default function Header(props: Props) {
  return (
    <header>
      {logo(props)}
      {name(props)}
      {menu(props)}
    </header>
  );
}

export function logo(props: Props) {
  return (
    <div class="logo">
      <img src={isoRoute.unwrap(config.route_of_profileImage)} />
    </div>
  );
}

export function name(props: { resource_shortname: string }) {
  return (
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
  );
}

export function menu(props: Props) {
  return (
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
      <a
        href={isoRoute.unwrap(config.route_of_ReferencesGraphPage)}
        class="item"
      >
        <Icon.Orbit />
      </a>
      <a href={isoRoute.unwrap(config.route_of_SignaturePage)} class="item">
        <Icon.Fingerprint />
      </a>
    </div>
  );
}
