require('dotenv').config();

const withCSS = require('@zeit/next-css');
const withTM = require('next-plugin-transpile-modules');

module.exports = withTM({
  transpileModules: [],
  ...withCSS({
    // cssModules: true,
    publicRuntimeConfig: {
      // Will be available on both server and client
      'process.env.NODE_ENV': process.env.NODE_ENV,
      'process.env.PORT': process.env.PORT,
      'process.env.GRAPH_URL': process.env.GRAPH_URL,
      'process.env.IMAGE_DOCUMENTS': process.env.IMAGE_DOCUMENTS,
    },
  }),
});
