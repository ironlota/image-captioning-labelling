const { PHASE_PRODUCTION_SERVER } =
  process.env.NODE_ENV === 'development'
    ? {} // We're never in "production server" phase when in development mode
    : !process.env.NOW_REGION
    ? require('next/constants') // Get values from `next` package when building locally
    : require('next-server/constants'); // Get values from `next-server` package when building on now v2

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_PRODUCTION_SERVER) {
    return {};
  }

  require('dotenv').config();

  const withCSS = require('@zeit/next-css');
  const withTM = require('next-plugin-transpile-modules');

  return withTM({
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
};
