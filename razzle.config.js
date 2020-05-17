const path = require('path');
const autoprefixer = require('autoprefixer');
const jsConfig = require('./jsconfig').compilerOptions;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const CompressionPlugin = require('compression-webpack-plugin');

const pathsConfig = jsConfig.paths;
let voltoPath = './node_modules/@plone/volto';
Object.keys(pathsConfig).forEach((pkg) => {
  if (pkg === '@plone/volto') {
    voltoPath = `./${jsConfig.baseUrl}/${pathsConfig[pkg][0]}`;
  }
});

// module.exports = require(`${voltoPath}/razzle.config`);

const config = require(`${voltoPath}/razzle.config`);
const razzleModify = config.modify;

module.exports = {
  plugins: config.plugins,
  modify: (config, { target, dev }, webpack) => {
    const vc = razzleModify(config, { target, dev }, webpack);
    // const jsxRule = vc.module.rules.find(
    //     module => module.test && module.test.toString() == /\.(js|jsx|mjs)$/, // eslint-disable-line
    // );
    // jsxRule.exclude = [
    //   ...(jsxRule.exclude || []),
    //   /src\/addons\/.+\/node_modules/,
    // ];

    const BASE_CSS_LOADER = {
      loader: 'css-loader',
      options: {
        importLoaders: 2,
        sourceMap: true,
        // localIdentName: '[name]__[local]___[hash:base64:5]',
      },
    };
    const POST_CSS_LOADER = {
      loader: require.resolve('postcss-loader'),
      options: {
        sourceMap: true,
        // Necessary for external CSS imports to work
        // https://github.com/facebookincubator/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          autoprefixer({
            flexbox: 'no-2009',
          }),
        ],
      },
    };

    const LESSLOADER = {
      test: /\.less$/,
      include: [
        path.resolve('./theme'),
        /node_modules\/@plone\/volto\/theme/,
        /plone\.volto\/theme/,
        /node_modules\/semantic-ui-less/,
        // load .less files from addons
        /src\/addons/,
      ],
      use: dev
        ? target === 'node'
          ? [
              'isomorphic-style-loader',
              BASE_CSS_LOADER,
              POST_CSS_LOADER,
              {
                loader: 'less-loader',
                options: {
                  // outputStyle: 'expanded',
                  sourceMap: true,
                },
              },
            ]
          : [
              {
                loader: 'style-loader',
              },
              BASE_CSS_LOADER,
              POST_CSS_LOADER,
              {
                loader: 'less-loader',
                options: {
                  sourceMap: true,
                },
              },
            ]
        : [
            MiniCssExtractPlugin.loader,
            {
              ...BASE_CSS_LOADER,
              options: {
                ...BASE_CSS_LOADER.options,
                modules: true,
              },
            },
            POST_CSS_LOADER,
            {
              loader: 'less-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
    };
    // object { lessOptions?, prependData?, appendData?, sourceMap?, implementation? }

    // need to include /theme/ to less loader in order to have it working with volto as a submodule.
    const lessRule = vc.module.rules.find(
        module => module.test && module.test.toString() == /\.less$/, // eslint-disable-line
    );

    const index = vc.module.rules.indexOf(lessRule);
    vc.module.rules[index] = LESSLOADER;

    // Needed to allow server production build
    vc.plugins.push(
      new MiniCssExtractPlugin({
        filename: 'static/css/bundle.[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        // allChunks: true because we want all css to be included in the main
        // css bundle when doing code splitting to avoid FOUC:
        // https://github.com/facebook/create-react-app/issues/2415
        allChunks: true,
      }),
    );

    return vc;
  },
};
