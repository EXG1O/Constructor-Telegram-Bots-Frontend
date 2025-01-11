import { DefinePlugin, Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import JsonMinimizerPlugin from 'json-minimizer-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import dotenv from 'dotenv';

interface Configuration extends WebpackConfiguration {
	devServer?: WebpackDevServerConfiguration;
}

const config = (env: any, argv: any): Configuration => {
	const isProduction: boolean = argv.mode === 'production';
	const publicPath: string = isProduction ? '/static/frontend/' : '/';
	const envVars: Record<string, string> = Object.assign(
		dotenv.config().parsed || {},
		{
			DEBUG: (!isProduction).toString(),
			WEBPACK_SERVE: Boolean(env.WEBPACK_SERVE).toString(),
			PUBLIC_PATH: publicPath,
		},
	);

	return {
		entry: './src/index.tsx',
		output: {
			clean: true,
			path: `${__dirname}/dist/frontend`,
			filename: '[name].[contenthash].bundle.js',
			chunkFilename: '[name].[contenthash].chunk.js',
		},
		devServer: env.WEBPACK_SERVE
			? {
					hot: true,
					allowedHosts: 'all',
					historyApiFallback: true,
					proxy: {
						context: ['/api/', '/media/', '/admin/'],
						target: 'http://localhost:8000/',
					},
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
					test: /\.s?css$/,
					use: [
						isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
						'css-loader',
						'sass-loader',
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
				styles: `${__dirname}/src/styles/`,
			},
		},
		optimization: {
			minimizer: ['...', new JsonMinimizerPlugin(), new CssMinimizerPlugin()],
		},
		plugins: [
			new DefinePlugin({
				'process.env': JSON.stringify(envVars),
			}),
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
		],
	};
};

export default config;
