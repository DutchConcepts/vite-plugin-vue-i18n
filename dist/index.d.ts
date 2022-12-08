import { type Plugin } from 'vite';
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
declare function vueI18n({ resourcesPattern, output }: IOptions): Plugin;
export { vueI18n };
