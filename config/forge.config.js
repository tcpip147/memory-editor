const fs = require('fs');
const path = require('path');

module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  hooks: {
    postMake: () => {
      const src = path.join(__dirname, '../build');
      const dst = path.join(__dirname, '../out/Memory Editor-win32-x64/resources/app/build');
      fs.cpSync(src, dst, { recursive: true });
    }
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: path.resolve('config/webpack.main.config.js'),
        port: 3000,
        loggerPort: 9000,
        renderer: {
          config: path.resolve('config/webpack.renderer.config.js'),
          entryPoints: [{
            name: 'main_window',
            html: path.resolve('src/renderer/app.html'),
            js: path.resolve('src/renderer/app.jsx'),
            preload: {
              js: path.resolve('src/renderer/preload.jsx')
            }
          }],
        },
        devServer: {
          liveReload: true
        }
      }
    }
  ],
};
