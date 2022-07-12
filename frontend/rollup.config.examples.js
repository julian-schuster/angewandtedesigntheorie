/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import html, {
  makeHtmlAttributes
} from "@rollup/plugin-html";

import commonjs from "@rollup/plugin-commonjs";
import fs from "fs";
import jsonNodeResolve from "@rollup/plugin-json";
import {
  nodeResolve
} from "@rollup/plugin-node-resolve";
import path from "path";
import typescript from "@rollup/plugin-typescript";

const template = ({
  attributes,
  files,
  meta,
  publicPath,
  title
}) => {
  const scripts = (files.js || [])
    .map(({
      fileName
    }) => {
      const attrs = makeHtmlAttributes(attributes.script);
      return `<script src="${publicPath}${fileName}"${attrs}></script>`;
    })
    .join("\n");

  const links = (files.css || [])
    .map(({
      fileName
    }) => {
      const attrs = makeHtmlAttributes(attributes.link);
      return `<link href="${publicPath}${fileName}" rel="stylesheet"${attrs}>`;
    })
    .join("\n");

  const metas = meta
    .map((input) => {
      const attrs = makeHtmlAttributes(input);
      return `<meta${attrs}>`;
    })
    .join("\n");

  return `
<!doctype html>
<html${makeHtmlAttributes(attributes.html)}>
  <head>
    ${metas}
    <title>${title}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
    <style>
      html, body {
        height: 100%;
        width: 100%;
        margin: 0;
      }
      table.maintable{
   height:100vh;
}
div.scrollable {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: auto;
}
    </style>
    ${links}
  </head>
  <body style="background-color:lightgray">
  <table class="maintable table table-striped">
  <colgroup>
      <col class="col-md-10">
      <col class="col-md-2">
  </colgroup>
  <tbody>
  <tr>
      <td><div style="width:100%;height:100%;" id="map"></div></td>
      <td class="text-center"><h3>Einstellungen</h3>
                              <div class="scrollable">
                              <table>
                              <h5>Air Quality Index (AQI)-Skala und Farbzuordnung</h5>
                              <tr style="background-color:#009966"><th>0 - 50</th><td>Gut</td><tr>
                              <tr style="background-color:#ffde33"><th>51 -100</th><td>Mäßig</td><tr>
                              <tr style="background-color:#ff9933"><th>101-150</th><td>Bedingt Ungesund</td><tr>
                              <tr style="background-color:#cc0033"><th>151-200</th><td>Ungesund</td><tr>
                              <tr style="background-color:#660099"><th>201-300</th><td>Sehr ungesund</td><tr>
                              <tr style="background-color:#7e0023"><th>300+</th><td>Gesundheitsgefährdend</td><tr>
                              <tr><th>Selektionsradius</th><td><input id="inputSearchRadius" type="range" min="1" max="5" value="1" class="form-range"></td></tr>
                              <tr><th>Selektion: ⌀-AQI</th><td id="aqiLabel"><label>/</label></td>
                              <tr><td colspan="2" style="padding:0"><table id="selectedStationsTbl" width="100%"><thead><th id="stationsname-header">Stationsname</th><th id="aqi-header">AQI</th></thead><tbody></tbody></table></td></td>
                              <tr><td colspan="2" class="text-center"><button id="showAllCountriesBtn" class="btn btn-info">Alle Länder an </button></td></tr> 
                              </table>
                              <table id="countryTbl" width="100%">
                              </table>
                              </div>
                              </td>
  </tr>
  </tbody>
    ${scripts}
  </body>
</html>`;
};

const typescriptOptions = {
  tsconfig: "tsconfig.examples.json",
};

const examples = fs
  .readdirSync(path.join(__dirname, "examples"))
  .filter((f) => f !== "config.ts")
  .map((f) => f.slice(0, f.length - 3));

export default examples.map((name) => ({
  input: `examples/${name}.ts`,
  plugins: [
    typescript(typescriptOptions),
    commonjs(),
    nodeResolve(),
    jsonNodeResolve(),
  ],
  output: {
    dir: `public/${name}`,
    sourcemap: false,
    plugins: [
      html({
        fileName: `index.html`,
        title: `Angewandte Designtheorie`,
        template,
      }),
    ],
    manualChunks: (id) => {
      if (id.includes("node_modules")) {
        return "vendor";
      }
    },
  },
}));