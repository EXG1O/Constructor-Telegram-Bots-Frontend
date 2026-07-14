import CopyPlugin from 'copy-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import dotenv from 'dotenv';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import JsonMinimizerPlugin from 'json-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
import { type Configuration as WebpackConfiguration, EnvironmentPlugin } from 'webpack';
import type { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const config = (env: any, argv: any): Configuration => {
  const isProduction: boolean = argv.mode === 'production';
  const publicPath: string = isProduction ? '/static/frontend/' : '/';
  const parsedEnv: dotenv.DotenvParseOutput | undefined = dotenv.config().parsed;

  process.env.DEBUG = JSON.stringify(!isProduction);
  process.env.WEBPACK_SERVE ??= 'false';
  process.env.PUBLIC_PATH = publicPath;
  process.env.TELEGRAM_LOGIN_CLIENT_ID ||= parsedEnv?.TELEGRAM_LOGIN_CLIENT_ID;

  return {
    entry: './src/index.tsx',
    output: {
      clean: true,
      path: `${__dirname}/dist/frontend`,
      filename: '[name].[contenthash].bundle.js',
      chunkFilename: '[name].[contenthash].chunk.js',
    },
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    devServer: env.WEBPACK_SERVE
      ? {
          hot: true,
          allowedHosts: 'all',
          historyApiFallback: true,
          proxy: [
            {
              context: (pathname) => /^\/(api|media|[a-z]{2}\/admin)\//.test(pathname),
              target: 'http://localhost:8000/',
            },
          ],
          static: `${__dirname}/dist/frontend`,
        }
      : undefined,
    module: {
      rules: [
        {
          test: /\.html$/,
          use: 'html-loader',
        },
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader',
          ],
        },
        {
          test: /\.(png|jpg)$/,
          type: 'asset/resource',
        },
        {
          test: /\.svg$/,
          resourceQuery: /url/,
          type: 'asset',
        },
        {
          test: /\.svg$/,
          issuer: /\.[jt]sx?$/,
          resourceQuery: { not: [/url/] },
          use: [
            'babel-loader',
            {
              loader: '@svgr/webpack',
              options: {
                babel: false,
                namedExport: 'SVG',
                svgoConfig: {
                  plugins: [
                    {
                      name: 'preset-default',
                      params: {
                        overrides: {
                          removeViewBox: false,
                        },
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.css'],
      alias: {
        assets: `${__dirname}/src/assets/`,
        settings: `${__dirname}/src/settings`,
        i18n: `${__dirname}/src/i18n/`,
        components: `${__dirname}/src/components/`,
        routes: `${__dirname}/src/routes/`,
        api: `${__dirname}/src/api/`,
        hooks: `${__dirname}/src/hooks/`,
        utils: `${__dirname}/src/utils/`,
        tokens: `${__dirname}/src/tokens/`,
        constants: `${__dirname}/src/constants/`,
        enums: `${__dirname}/src/enums/`,
      },
    },
    optimization: {
      minimizer: ['...', new JsonMinimizerPlugin(), new CssMinimizerPlugin()],
    },
    plugins: [
      new EnvironmentPlugin([
        'DEBUG',
        'WEBPACK_SERVE',
        'PUBLIC_PATH',
        'TELEGRAM_LOGIN_CLIENT_ID',
      ]),
      new CopyPlugin({
        patterns: [{ from: './src/locale', to: 'locale' }],
      }),
      new ForkTsCheckerWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: `./src/${isProduction ? 'prod' : 'dev'}.html`,
        publicPath,
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      }),
      new MonacoWebpackPlugin({
        filename: 'monaco_[name].[contenthash].worker.js',
        publicPath,
        languages: ['json'],
        features: [
          '!anchorSelect',
          '!bracketMatching',
          '!browser',
          '!caretOperations',
          '!clipboard',
          '!codeAction',
          '!codelens',
          '!colorPicker',
          '!comment',
          '!contextmenu',
          '!cursorUndo',
          '!diffEditor',
          '!dnd',
          '!documentSymbols',
          '!dropOrPasteInto',
          '!find',
          '!folding',
          '!fontZoom',
          '!format',
          '!gotoError',
          '!gotoLine',
          '!gotoSymbol',
          '!hover',
          '!iPadShowKeyboard',
          '!inPlaceReplace',
          '!indentation',
          '!inlayHints',
          '!inlineCompletions',
          '!inlineProgress',
          '!inspectTokens',
          '!lineSelection',
          '!linesOperations',
          '!linkedEditing',
          '!links',
          '!longLinesHelper',
          '!multicursor',
          '!parameterHints',
          '!quickCommand',
          '!quickHelp',
          '!quickOutline',
          '!readOnlyMessage',
          '!referenceSearch',
          '!rename',
          '!semanticTokens',
          '!smartSelect',
          '!snippet',
          '!stickyScroll',
          '!suggest',
          '!toggleHighContrast',
          '!toggleTabFocusMode',
          '!tokenization',
          '!unicodeHighlighter',
          '!unusualLineTerminators',
          '!wordHighlighter',
          '!wordOperations',
          '!wordPartOperations',
        ],
      }),
    ],
  };
};

export default config;
