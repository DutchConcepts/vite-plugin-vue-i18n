import { type HmrContext, type Plugin } from 'vite';
import { readFileSync, writeFileSync } from 'fs';
import { promise as glob } from 'glob-promise';
import { cwd } from 'process';
import minimatch from 'minimatch';
import path from 'path';
import pc from 'picocolors';

import { logError, logSuccess } from '@/utils';

interface IOptions {
  // @example 'i18n/locales/**/*.json'
  resourcesPattern: string;
  // @example 'i18n/locales/index.ts'
  outputPath: string;
}

/**
 * @param options
 * @returns Plugin
 */
function vueI18n({ resourcesPattern, outputPath }: IOptions): Plugin {
  return {
    name: 'vite-plugin-vue-i18n',

    buildStart: async () => {
      try {
        await compileLocaleFile({ resourcesPattern, outputPath });
      } catch (e) {
        logError('Building resources on start went wrong...', e);
      }
    },

    handleHotUpdate: async (ctx: HmrContext) => {
      const localesPattern = path.resolve(cwd(), resourcesPattern);
      const isMatch = minimatch(ctx.file, localesPattern);

      if (isMatch) {
        try {
          await compileLocaleFile({ resourcesPattern, outputPath });
        } catch (e) {
          logError('Building resources on hot reload went wrong...', e);
        }
      }
    },
  };
}

async function compileLocaleFile({ resourcesPattern, outputPath }: IOptions) {
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

  writeFileSync(`./src/${outputPath}.ts`, codeStr);

  logSuccess('Generated vue-i18n locales!', pc.green('✔'));
}

export { vueI18n };
