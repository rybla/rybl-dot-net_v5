import HTML from "@kitajs/html";
import Header from "./Header";
import Footer from "./Footer";
import { config } from "@/ontology";

export default function Top(props: {
  resource_name: string;
  resource_shortname: string;
  content_head?: JSX.Element;
  children: HTML.Children;
}): JSX.Element {
  return (
    <>
      {"<!doctype html>"}
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title safe>
            {config.name_of_website} | {props.resource_name}
          </title>
          <link rel="stylesheet" href="/asset/style/common.css" />
          <link rel="stylesheet" href="/asset/style/util.css" />
          <link rel="stylesheet" href="/asset/style/Top.css" />
          <link rel="stylesheet" href="/asset/style/Tag.css" />
          <link rel="stylesheet" href="/asset/style/ParsedDate.css" />
          <link rel="stylesheet" href="/asset/style/Header.css" />
          <link rel="stylesheet" href="/asset/style/Footer.css" />
          <link rel="stylesheet" href="/asset/style/Raindrops.css" />
          <link rel="stylesheet" href="/asset/style/Markdown.css" />
          <script src="/asset/script/Top.js" />
          <script src="/asset/script/parallax_on_scroll.js" />
          {props.content_head as "safe"}
        </head>
        <body>
          <svg style={{ width: 0, height: 0, position: "absolute" }}>
            <filter id="nightsky">
              <feTurbulence
                id="nightsky-turbulence"
                type="fractalNoise"
                baseFrequency="0.1"
                numOctaves="1"
                stitchTiles="stitch"
                result="noise"
              />

              <feTile in="noise" result="tiled_noise" />

              <feOffset
                id="nightsky-turbulenceOffset"
                in="tiled_noise"
                dx="0"
                dy="0"
                result="offset_noise"
              />

              <feComponentTransfer in="offset_noise" result="stars_pattern">
                <feFuncA type="discrete" tableValues="0 0 0 1" />
              </feComponentTransfer>

              <feColorMatrix
                in="stars_pattern"
                type="matrix"
                values="1 0 0 0 0
                          0 1 0 0 0
                          0 0 1 0 0
                          0.333 0.333 0.333 0 0"
              />
            </filter>

            <filter id="warp">
              <feTurbulence
                id="turbulence-generator"
                type="fractalNoise"
                baseFrequency="0.01 0.04"
                numOctaves="1"
                seed="2"
                result="turbulence"
              />

              <feDisplacementMap
                in="SourceGraphic"
                in2="turbulence"
                scale="100"
                xChannelSelector="R"
                yChannelSelector="G"
                result="displacement"
              />
            </filter>

            <filter id="gooey">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="15"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                result="goo"
              />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </svg>
          <div id="background" />
          <Header resource_shortname={props.resource_shortname} />
          <main>{props.children}</main>
          <Footer />
        </body>
      </html>
    </>
  );
}
