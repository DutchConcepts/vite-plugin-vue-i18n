import { type Plugin } from 'vite';
interface IOptions {
    resourcesPattern: string;
    outputPath: string;
}
/**
 * @param options
 * @returns Plugin
 */
declare function vueI18n({ resourcesPattern, outputPath }: IOptions): Plugin;
export { vueI18n };
