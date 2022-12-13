# vite-plugin-vue-i18n

This plugin finds all files with usage of a [minimatch](https://github.com/isaacs/minimatch) pattern and merges all locale message files into one single file that is being created on a specified location.

> ⚠️ This plugin can only be used for a specific use-case and currently only supports JSON files.

## Usage

Below example will search for all JSON files inside the folder `./src/i18n/locales` and creates an `index.ts` file inside the same folder.

```
// vite.config.ts

import { vueI18n } from 'vite-plugin-vue-i18n';

export default defineConfig(() => {
  return {
    ...,
    plugins: [
      vue(),
      vueI18n({
        resourcesPattern: 'i18n/locales/**/*.json',
        output: 'i18n/locales/index',
      }),
      ...
    ]
  }
});
```

After generation you'll be able to import 2 properties from this file.

```
import { messages, type Messages } from '...'
```

## Notes

- The locale message file will be regenerated when a file triggered by the hot reloading API gets reloaded matching the same `resourcesPattern`.
- Do not forget to add the src of the generated file to `.prettierignore` or related files.
- The generated file should **NOT** be added to `.gitignore`.

## Motivation

Plugins like [vite-plugin-vue-i18n](https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n) or [unplugin-vue-i18n](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n) are leaking a few things.

- Impossible to get type safety. Therefor, you won't be able to use any of vue-i18n's [typescript features](https://vue-i18n.intlify.dev/guide/advanced/typescript.html).
- Automagically locale message file bundling without the need of an (index) file which imports ALL of your files (for each language).

## License

MIT
