const env = require('./env-config.js');

module.exports = {
  presets: ['next/babel'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@shared': './src/shared',
          '@store': './src/store',
          '@utils': './src/utils',
        },
      },
    ],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['transform-define', env],
  ],
  env: {},
};
