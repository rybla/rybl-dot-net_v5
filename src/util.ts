export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type Record = { [key: string]: any };

export const do_ = <A>(k: () => A) => k();

export const indentation = (level: number) => "│   ".repeat(level);

export const indentString = (level: number, s: string) => {
  const i = indentation(level);
  return s
    .split("\n")
    .map((s) => `${i}${s}`)
    .join("\n");
};

export const render_jsx = async (jsx: JSX.Element) =>
  jsx instanceof Promise ? await jsx : jsx;

export const sleep = async (duration_ms: number) =>
  new Promise((res) => setTimeout(res, duration_ms));

export type Tree<A> = { value: A; kids: Tree<A>[] };

export type OptionalizeRecord<R extends Record> = {
  [K in keyof R]: R[K] | undefined;
};

export const encodeURIComponent_better = (s: string) =>
  encodeURIComponent(s.replaceAll(/(\.|:|_|\/)/g, "_")).slice(0, 225);

export type Ref<A> = { value: A };
export const Ref = <A>(value: A): Ref<A> => ({ value });

export const intercalate = <A>(xss: A[][], sep: A[]): A[] => {
  const ys: A[] = [];
  for (const xs of xss.slice(0, -1)) ys.push(...xs, ...sep);
  for (const xs of xss.slice(-1)) ys.push(...xs);
  return ys;
};

export const ifDefined = <A, B>(
  a: A | undefined | null,
  b: B | (() => B),
  k: (a: A) => B,
): B => {
  // @ts-ignore
  if (a === undefined || a === null) return typeof b === "function" ? b() : b;
  return k(a);
};

export const dedup = <A>(
  xs: Iterable<A>,
  getId: (x: A) => string,
): Iterable<A> => {
  const map_of_ys: Map<string, A> = new Map();
  for (const x of xs) map_of_ys.set(getId(x), x);
  return map_of_ys.values();
};

/**
 * Removes all duplicates from {@link xs} in place, which are elements with
 * equal {@link getId} values.
 * @param xs
 */
export const dedupInPlace = <A>(xs: A[], getId: (x: A) => string): void => {
  if (!xs || xs.length === 0) {
    return;
  }

  const seen = new Set<string>();
  let writeIndex = 0;

  for (let readIndex = 0; readIndex < xs.length; readIndex++) {
    const currentElement = xs[readIndex]!;
    if (!seen.has(getId(currentElement))) {
      seen.add(getId(currentElement));
      if (readIndex !== writeIndex) {
        xs[writeIndex] = currentElement;
      }
      writeIndex++;
    }
  }
  xs.length = writeIndex;
};

declare global {
  interface Array<T> {
    filterMap<B>(this: Array<T>, f: (x: T) => B | undefined): Array<B>;
  }
}

Array.prototype.filterMap = function <T, B>(
  this: T[],
  f: (x: T) => B | undefined,
) {
  const ys: B[] = [];
  for (const x of this) {
    const y = f(x);
    if (y !== undefined) ys.push(y);
  }
  return ys;
};

/**
 * This file contains a single function, extractFileExtensionFromURL, designed to
 * extract the file extension from a given URL object.
 *
 * The function operates by first accessing the `pathname` property of the URL.
 * The pathname provides the path portion of the URL, correctly excluding any
 * query parameters (e.g., `?foo=bar`) or hash fragments (e.g., `#section`).
 *
 * Once the pathname string is obtained, the function searches for the last
 * occurrence of a period ('.') character, which typically separates the file
 * name from its extension.
 *
 * If a period is found (i.e., its index is not -1) and it is not the very last
 * character in the pathname (to handle cases like "path/to/directory."),
 * the function extracts and returns the substring that follows this last period.
 *
 * If no period is found, or if it's the last character, the function concludes
 * that no valid extension is present in the URL's path and returns `undefined`.
 *
 * This approach ensures a robust extraction that correctly handles various
 * complex URL formats.
 */
export function extractFileExtensionFromURL(url: URL): string | undefined {
  const pathname = url.pathname;
  if (pathname === undefined) return undefined;
  const lastDotIndex = pathname.lastIndexOf(".");

  if (lastDotIndex === -1 || lastDotIndex === pathname.length - 1)
    return undefined;

  return pathname.substring(lastDotIndex + 1);
}

/**
 * This file contains a TypeScript function, extractFileExtensionFromHref, designed
 * to robustly extract the file extension from a given URL or href string.
 *
 * The function operates by first parsing the input string into a URL object.
 * This approach correctly handles various URL complexities, such as query
 * parameters (`?key=value`) and hash fragments (`#section`), by isolating
 * the pathname, which is the only part of the URL relevant for determining
 * the file extension.
 *
 * The logic proceeds as follows:
 * 1.  The `URL` constructor is used within a try-catch block to handle
 * potentially malformed input strings gracefully. If the input is not a
 * valid URL, the function returns `undefined`.
 * 2.  From the parsed URL object, the `pathname` property is retrieved.
 * 3.  The `lastIndexOf('.')` method is used on the pathname to find the
 * position of the last dot, which typically precedes the file extension.
 * 4.  Several checks are performed:
 * - If no dot is found (`lastDotIndex === -1`), it means there's no extension,
 * and the function returns `undefined`.
 * - To handle hidden files on Unix-like systems (e.g., `.htaccess`), the
 * code checks if the dot is the very first character of the pathname and
 * if there are no other dots. In such cases, it's not considered a file
 * extension.
 * - A check is also made to ensure the dot is not the last character in the
 * pathname (e.g., `path/to/file.`), which would not be a valid extension.
 * 5.  If all checks pass, the substring following the last dot is extracted
 * using `slice(lastDotIndex + 1)` and returned as the file extension.
 */
export function extractFileExtensionFromHref(href: string): string | undefined {
  try {
    const url = new URL(href, "http://dummybase.com");
    const pathname = url.pathname;

    const lastDotIndex = pathname.lastIndexOf(".");

    if (
      lastDotIndex === -1 ||
      lastDotIndex === pathname.length - 1 ||
      (pathname.startsWith(".") && !pathname.substring(1).includes("."))
    ) {
      return undefined;
    }

    const lastSegment = pathname.substring(pathname.lastIndexOf("/") + 1);
    if (lastSegment.startsWith(".")) {
      const potentialExtension = pathname.substring(lastDotIndex + 1);
      if (potentialExtension.length > 0) {
        return potentialExtension;
      }
      return undefined;
    }

    return pathname.substring(lastDotIndex + 1);
  } catch (e) {
    try {
      const parts = href.split(/[?#]/)[0]!.split("/");
      const filename = parts[parts.length - 1]!;
      if (filename.includes(".")) {
        const extension = filename.split(".").pop();
        if (
          extension &&
          extension.length > 0 &&
          extension !== filename &&
          !filename.startsWith(".")
        ) {
          return extension;
        }
      }
    } catch (e) {
      return undefined;
    }
    return undefined;
  }
}
