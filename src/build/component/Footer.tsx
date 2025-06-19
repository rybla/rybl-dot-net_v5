import { config, isoRoute } from "@/ontology";
import Icon from "@/build/component/Icon";
import * as Header from "./Header";

export default function Footer(props: { resource_shortname: string }) {
  return (
    <header>
      {Header.menu(props)}
      {Header.name(props)}
      {Header.logo(props)}
    </header>
  );
}
