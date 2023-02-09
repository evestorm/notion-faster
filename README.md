# notion-faster

# Install CRXJS

crxjs site: https://crxjs.dev/vite-plugin/getting-started/vue/create-project

```shell
npm init vite@latest
# select Vue and TS
npm i @crxjs/vite-plugin@beta -D
```

## Change the viteConfig

> vite.config.ts

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { crx } from '@crxjs/vite-plugin';
// @ts-ignore
import manifest from './manifest.json' assert { type: 'json' }; // Node >=17

export default defineConfig({
  plugins: [
    vue(),
    crx({ manifest }),
  ],
});
```

## Add a manifest.json

```json
{
  "manifest_version": 3,
  "name": "notion faster",
  "version": "1.0.0",
  "action": { "default_popup": "index.html" }
}
```

# Install Tailwind CSS width Vite

```shell
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## Change the tailwind.config.cjs

```ts
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## Add the Tailwind directives to style.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

# Install the prettier

```shell
npm install --save-dev --save-exact prettier
npm install -g prettier
```

## Add the .prettierrc.cjs

```js
module.exports = {
  printWidth: 180, // 一行的字符数，如果超过会进行换行，默认为80
  tabWidth: 2, // 一个tab代表几个空格数，默认为2
  useTabs: false, // 是否使用tab进行缩进，默认为false，表示用空格进行缩减
  semi: true, // 行尾是否使用分号，默认为true
  singleQuote: false, // 字符串是否使用单引号，默认为false，使用双引号
  quoteProps: "as-needed", // 对象属性的引号使用 as-needed:仅在需要的时候使用 | consistent:有一个属性需要引号，就都需要引号 | preserve:保留用户输入的情况 默认 as-needed
  jsxSingleQuote: false, // 在JSX中使用单引号而不是双引号。默认 false
  trailingComma: "all", // 是否使用尾逗号，有三个可选值 'none':末尾没有逗号 | 'es5':es5有效的地方保留 | 'all':在可能的地方都加上逗号 默认为es5
  bracketSpacing: true, // 字面量对象括号中的空格，默认true
  jsxBracketSameLine: false, // 将多行JSX元素的>放在最后一行的末尾，而不是单独放在下一行(这不适用于自闭元素)。默认false
  arrowParens: "avoid", // 箭头函数中的括号 'avoid': 在有需要的时候使用. Example: x => x | 'always' - 一直使用. Example: (x) => x
  vueIndentScriptAndStyle: false, // 缩进vue文件中的script和style标签 false:不缩进Vue文件中的脚本和样式标签 | true - 缩进Vue文件中的脚本和样式标签 默认false
  endOfLine: "lf", // 设置统一的行结尾样式 "lf": 仅换行（\ n），在Linux和macOS以及git repos内部通用 | "crlf": 回车符+换行符（\ r \ n），在Windows上很常见 | "cr" - 仅回车符（\ r），很少使用 | "auto" - 保持现有的行尾（通过查看第一行后的内容对一个文件中的混合值进行归一化）
};
```

# 静态文件位置

资源文件都放进 web_accessible_resources 中，在 js 中直接 import 导入即可。
