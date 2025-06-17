import * as unist from "unist";

// -----------------------------------------------------------------------------
// abstract
// -----------------------------------------------------------------------------

export type Node<Type extends string> = {
  type: Type;
  position?: unist.Position;
};

export type Literal = { value: string };

export type Resource = { url: string; title?: string };

export type Alternative = { alt?: string };

export type Directive = { name: string; attributes: DirectiveAttributes };

// -----------------------------------------------------------------------------
// groups
// -----------------------------------------------------------------------------

export type RootKid = FlowKid | YamlFrontmatter;

export type FlowKid =
  | Blockquote
  | Code
  | Heading
  | Html
  | List
  | ThematicBreak
  | Math;

export type PhrasingKid =
  | Break
  | Emphasis
  | Html
  | Image
  | InlineCode
  | Link
  | Strong
  | Text
  | InlineMath;

export type ListKid = ListItem | TaskListItem;

export type TableKid = TableRow;

export type TableRowKid = TableCell;

// -----------------------------------------------------------------------------
// concrete
// -----------------------------------------------------------------------------

// core
export type Root = Node<"Root"> & { kids: RootKid[] };
export type Blockquote = Node<"Blockquote"> & { kids: FlowKid[] };
export type Break = Node<"Break">;
export type Code = Node<"Code"> & Literal & { lang?: string; meta?: string };
export type Emphasis = Node<"Emphasis"> & { kids: PhrasingKid[] };
export type Heading = Node<"Heading"> & {
  depth: 1 | 2 | 3 | 4 | 5 | 6;
  kids: PhrasingKid[];
};
export type Html = Node<"Html"> & Literal;
export type Image = Node<"Image"> & Resource & Alternative;
export type InlineCode = Node<"InlineCode"> & Literal;
export type Link = Node<"Link"> & Resource & { kids: PhrasingKid[] };
export type List = Node<"List"> & {
  kids: ListKid[];
  ordered?: boolean;
  start?: number;
  spread?: number;
};
export type ListItem = Node<"ListItem"> & { kids: FlowKid[] };
export type Paragraph = Node<"Paragraph"> & { kids: PhrasingKid[] };
export type Strong = Node<"Strong"> & { kids: PhrasingKid[] };
export type Text = Node<"Text"> & Literal;
export type ThematicBreak = Node<"ThematicBreak">;

// directive
export type TextDirective = Node<"TextDirective"> &
  Directive & { kids: PhrasingKid[] };
export type LeafDirective = Node<"LeafDirective"> &
  Directive & { kids: PhrasingKid[] };
export type ContainerDirective = Node<"ContainerDirective"> &
  Directive & { kids: FlowKid[] };

// gfm
export type Delete = Node<"Delete"> & { kids: PhrasingKid[] };
export type Table = Node<"Table"> & {
  alignment: TableAlignment[];
  kids: TableKid[];
};
export type TableRow = Node<"TableRow"> & { kids: TableRowKid[] };
export type TableCell = Node<"TableCell"> & { kids: PhrasingKid[] };
export type TaskListItem = Node<"TaskListItem"> & { checked?: boolean };

// math
export type Math = Node<"Math"> & Literal & { meta?: string };
export type InlineMath = Node<"InlineMath"> & Literal;

// frontmatter
export type YamlFrontmatter = Node<"yaml"> & Literal;

// -----------------------------------------------------------------------------
// miscellaneous
// -----------------------------------------------------------------------------

export type TableAlignment = "center" | "left" | "right" | null;

export type DirectiveAttributes =
  | Record<string, string | null | undefined>
  | null
  | undefined;
