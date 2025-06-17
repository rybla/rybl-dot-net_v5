import * as doc from "@/doc";
import * as mdast from "mdast";

export class ParsingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParsingError";
  }
}

// export function parseRoot(root: mdast.Root): doc.Root {
//   return {
//     type: "Root",
//     position: root.position,
//     kids: root.children.map(parseRootKid),
//   };
// }

// export function parseRootKid(x: mdast.RootContent): doc.RootKid {
//   switch (x.type) {
//     case "blockquote": return {type: "Blockquote", position: x.position, kids: x.children.map()}
//   }
// }

// export function parseFlowKid(x: mdast.RootContent): doc.FlowKid {
//   throw new Error("unimplemented");
// }

// export function parsePhrasingKid(x: mdast.RootContent): doc.PhrasingKid {
//   throw new Error("unimplemented");
// }

// export function parseListKid(x: mdast.RootContent): doc.ListKid {
//   throw new Error("unimplemented");
// }

// export function parseTableKid(x: mdast.RootContent): doc.TableKid {
//   throw new Error("unimplemented");
// }

// export function parseTableRowKid(x: mdast.RootContent): doc.TableRowKid {
//   throw new Error("unimplemented");
// }
