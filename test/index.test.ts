import { assertType, test, describe } from 'vitest';
import { vueI18n } from '../src';

describe('vite-plugin-vue-i18n', () => {
  const tests = [
    {
      name: 'init',
      input: {
        resourcesPattern: 'i18n/locales/**/*.json',
        output: 'i18n/locales/index',
      },
    },
  ];

  for (const { name, input } of tests) {
    test(name, () => {
      vueI18n(input);
    });
  }
});
