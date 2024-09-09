import { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import CopyPlugin from 'copy-webpack-plugin';

interface Configuration extends WebpackConfiguration {
	devServer?: WebpackDevServerConfiguration;
}

const config = (env: any, argv: any): Configuration => {
	const isProduction: boolean = argv.mode !== 'production';

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
					historyApiFallback: true,
					proxy: {
						context: ['/api/', '/media/'],
						target: 'http://localhost:8000/',
					},
					static: `${__dirname}/dist/frontend`,
					hot: true,
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
						isProduction ? 'style-loader' : MiniCssExtractPlugin.loader,
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
				styles: `${__dirname}/src/styles/`,
				components: `${__dirname}/src/components/`,
				routes: `${__dirname}/src/routes/`,
				services: `${__dirname}/src/services/`,
				utils: `${__dirname}/src/utils/`,
				i18n: `${__dirname}/src/i18n/`,
			},
		},
		optimization: {
			minimizer: ['...', new CssMinimizerPlugin()],
		},
		plugins: [
			new Dotenv(),
			new CopyPlugin({
				patterns: [{ from: './src/locale', to: 'locale' }],
			}),
			new ForkTsCheckerWebpackPlugin(),
			new HtmlWebpackPlugin(
				isProduction
					? {
							template: './src/dev.html',
							publicPath: '/',
						}
					: {
							template: './src/prod.html',
							publicPath: '/static/frontend/',
						},
			),
			new MiniCssExtractPlugin({
				filename: '[name].[contenthash].css',
			}),
		],
	};
};

export default config;
