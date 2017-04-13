## Features

- [x] Server-side rendering (default, but optional)
  - [x] remove `html-webpack-plugin`
  - [x] provide a revision manifest for server template consumption
  - [x] pass options to `DevServer.proxy`
- [x] Imagemin all svg/images
- [x] JS: Min/Uglify/Babili
- [x] eslint
- [x] Postcss
  - [x] ExtractText
  - [x] Stylelint
  - [x] Minify/CSS Nano
- [x] SVG Sprites
- [x] Favicon generation
- [x] DevServer/HMR
- [x] Auto Modernizr/Customizr
- [ ] Nunjucks
- [x] Favicons
- [ ] Lint config (not just source)
- [ ] Browsersync + DevServer (https://github.com/Va1/browser-sync-webpack-plugin)
- [x] babel-polyfill
- [ ] dotenv webpack
- [x] default paths (app/assets/js, etc)
- [ ] source maps (for all entry points)
- [ ] babelrc
- [ ] drop_console

## Options

* `neutrino.options.fusionary.source`: (default:`./app/assets`)
* `neutrino.options.fusionary.output`: (default:`./public/assets`)
* `neutrino.options.fusionary.entry`: (default:`./js/index.js`)
* `neutrino.options.fusionary.spa`: (default:`false`)

Options can be overridden in `package.json`.

## Environment Variables
* `DEV_PROXY`: When running `start`, requests will be proxied though this url.

## `package.json`:

```json
{
  "devDependencies": {
    "neutrino": "^5.3.0",
    "neutrino-preset-fusionary": "^1.0.0"
  },
  "scripts": {
    "start": "neutrino start",
    "build": "neutrino build",
    "test": "neutrino test"
  },
  "neutrino": {
    "use": [
      "neutrino-preset-fusionary-web"
    ],
    "options": {
      "fusionary": {
        "source": "./app/foo",
        "output": "./public/foo"
      }
    },
  }
}

```
