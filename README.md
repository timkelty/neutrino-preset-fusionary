## Features

- [x] Imagemin all the things
- [x] JS: Min/Uglify/Babili
- [ ] CSS: Minify/Nano
- [x] DevServer/HMR
- [x] Auto Modernizr/Customizr
- [ ] Nunjucks
- [x] Favicons
- [ ] Self-linting (config)
- [ ] Browsersync (https://github.com/Va1/browser-sync-webpack-plugin)
- [x] babel-polyfill
- [ ] dotenv webpack
- [x] default paths (app/assets/js, etc)
- [ ] source maps (for all entry points)
- [ ] babelrc
- [ ] drop_console

## Options

Options can be overridden in `package.json`.

### `neutrino.options.fusionary` defaults:

```json
{
  "spa": false,
  "source": "./app/assets",
  "output": "./public/assets",
  "entry": "./js/index.js"
}
```

## Example `package.json`:

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
      "neutrino-preset-fusionary"
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
