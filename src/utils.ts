import pc from 'picocolors';

export function logSuccess(...args: unknown[]) {
  console.log(pc.green(pc.bold(`[vite-plugin-vue-i18n] `)), ...args);
}

export function logError(...args: unknown[]) {
  console.error(pc.red(pc.bold(`[vite-plugin-vue-i18n] `)), ...args);
}
