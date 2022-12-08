'use strict';

const fs = require('fs');
const globPromise = require('glob-promise');
const process = require('process');
const minimatch = require('minimatch');
const path = require('path');
const pc = require('picocolors');

function logSuccess(...args) {
  console.log(pc.green(pc.bold(`[vite-plugin-vue-i18n] `)), ...args);
}
function logError(...args) {
  console.error(pc.red(pc.bold(`[vite-plugin-vue-i18n] `)), ...args);
}

function vueI18n({ resourcesPattern, output }) {
  return {
    name: "vite-plugin-vue-i18n",
    buildStart: async () => {
      try {
        await compileLocaleFile({ resourcesPattern, output });
      } catch (e) {
        logError("Building resources on start went wrong...", e);
      }
    },
    handleHotUpdate: async (ctx) => {
      const localesPattern = path.resolve(process.cwd(), `./src/${resourcesPattern}`);
      const isMatch = minimatch(ctx.file, localesPattern);
      if (isMatch) {
        try {
          await compileLocaleFile({ resourcesPattern, output });
        } catch (e) {
          logError("Building resources on hot reload went wrong...", e);
        }
      }
    }
  };
}
async function compileLocaleFile({ resourcesPattern, output }) {
  const files = await globPromise.promise(`./src/${resourcesPattern}`);
  const messages = {
    "nl-NL": {},
    "en-GB": {}
  };
  for (const path2 of files) {
    const buffer = fs.readFileSync(path2, { encoding: "utf-8" });
    const json = JSON.parse(buffer);
    const parts = path2.split("/");
    const lang = parts[4];
    const fileName = parts[parts.length - 1];
    const componentName = fileName.split(".")[0];
    if (lang === "nl-NL" || lang === "en-GB") {
      messages[lang][componentName] = json;
    }
  }
  const jsonData = JSON.stringify(messages);
  const codeStr = `// THIS FILE IS GENERATED, DO NOT EDIT!
const messages = ${jsonData};
type Messages = typeof messages;
 export { messages, type Messages };`;
  fs.writeFileSync(`./src/${output}.ts`, codeStr);
  logSuccess("Generated vue-i18n locales!", pc.green("\u2714"));
}

exports.vueI18n = vueI18n;
