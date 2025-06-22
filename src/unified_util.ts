import * as mdast from "mdast";
import * as unist from "unist";

export function showNode(node: mdast.Node): string {
  if ("value" in node) {
    return node.value as string;
  } else if ("children" in node) {
    return (node as unist.Parent).children.map((kid) => showNode(kid)).join("");
  } else {
    return "";
  }
}
