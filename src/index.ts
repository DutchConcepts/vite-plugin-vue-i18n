import { type HmrContext, type Plugin } from 'vite';
import { readFileSync, writeFileSync } from 'fs';
import { promise as glob } from 'glob-promise';
import { cwd } from 'process';
import minimatch from 'minimatch';
import path from 'path';
import pc from 'picocolors';

import { logError, logSuccess } from '@/utils';

/**
 * The options object of the plugin.
 * * `ResourcesPattern` should be an {@link https://github.com/isaacs/minimatch minimatch} pattern.
 * * `output` should be a path ending with a filename starting from the `src` folder of your project. The path of the example below would be `./src/i18n/locales/index.ts`. The generated file will always be an TypeScript file and thus ending with the `.ts` extension.
 * @example
 * {
 *  resourcesPattern: 'i18n/locales/**\/**.json',
 *  output: 'i18n/locales/index'
 * }
 */
interface IOptions {
  resourcesPattern: string;
  output: string;
}

/**
 * @param options
 * @returns Plugin
 */
function vueI18n({ resourcesPattern, output }: IOptions): Plugin {
  return {
    name: 'vite-plugin-vue-i18n',

    buildStart: async () => {
      try {
        await compileLocaleFile({ resourcesPattern, output });
      } catch (e) {
        logError('Building resources on start went wrong...', e);
      }
    },

    handleHotUpdate: async (ctx: HmrContext) => {
      const localesPattern = path.resolve(cwd(), resourcesPattern);
      const isMatch = minimatch(ctx.file, localesPattern);

      if (isMatch) {
        try {
          await compileLocaleFile({ resourcesPattern, output });
        } catch (e) {
          logError('Building resources on hot reload went wrong...', e);
        }
      }
    },
  };
}

async function compileLocaleFile({ resourcesPattern, output }: IOptions) {
  const files = await glob(`./src/${resourcesPattern}`);

  const messages: Record<'nl-NL' | 'en-GB', { [k: string]: unknown }> = {
    'nl-NL': {},
    'en-GB': {},
  };

  for (const path of files) {
    const buffer = readFileSync(path, { encoding: 'utf-8' });
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

  writeFileSync(`./src/${output}.ts`, codeStr);

  logSuccess('Generated vue-i18n locales!', pc.green('✔'));
}

export { vueI18n };
