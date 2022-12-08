var fs = require('fs');
var globPromise = require('glob-promise');
var process = require('process');
var minimatch = require('minimatch');
var path = require('path');
var pc = require('picocolors');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var minimatch__default = /*#__PURE__*/_interopDefaultLegacy(minimatch);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var pc__default = /*#__PURE__*/_interopDefaultLegacy(pc);

function logSuccess(...args) {
  console.log(pc__default["default"].green(pc__default["default"].bold(`[vite-plugin-vue-i18n] `)), ...args);
}
function logError(...args) {
  console.error(pc__default["default"].red(pc__default["default"].bold(`[vite-plugin-vue-i18n] `)), ...args);
}

/**
 * @param options
 * @returns Plugin
 */
function vueI18n({
  resourcesPattern,
  outputPath
}) {
  return {
    name: 'vite-plugin-vue-i18n',
    buildStart: async () => {
      try {
        await compileLocaleFile({
          resourcesPattern,
          outputPath
        });
      } catch (e) {
        logError('Building resources on start went wrong...', e);
      }
    },
    handleHotUpdate: async ctx => {
      const localesPattern = path__default["default"].resolve(process.cwd(), resourcesPattern);
      const isMatch = minimatch__default["default"](ctx.file, localesPattern);
      if (isMatch) {
        try {
          await compileLocaleFile({
            resourcesPattern,
            outputPath
          });
        } catch (e) {
          logError('Building resources on hot reload went wrong...', e);
        }
      }
    }
  };
}
async function compileLocaleFile({
  resourcesPattern,
  outputPath
}) {
  const files = await globPromise.promise(`./src/${resourcesPattern}`);
  const messages = {
    'nl-NL': {},
    'en-GB': {}
  };
  for (const path of files) {
    const buffer = fs.readFileSync(path, {
      encoding: 'utf-8'
    });
    const json = JSON.parse(buffer);
    const parts = path.split('/');
    const lang = parts[4];
    const fileName = parts[parts.length - 1];
    const componentName = fileName.split('.')[0];
    if (lang === 'nl-NL' || lang === 'en-GB') {
      messages[lang][componentName] = json;
    }
  }
  const jsonData = JSON.stringify(messages);
  const codeStr = `// THIS FILE IS GENERATED, DO NOT EDIT!\nconst messages = ${jsonData};\ntype Messages = typeof messages;\n export { messages, type Messages };`;
  fs.writeFileSync(`./src/${outputPath}.ts`, codeStr);
  logSuccess('Generated vue-i18n locales!', pc__default["default"].green('✔'));
}

exports.vueI18n = vueI18n;
//# sourceMappingURL=index.cjs.map
