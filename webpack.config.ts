import { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import Dotenv from 'dotenv-webpack';

interface Configuration extends WebpackConfiguration {
	devServer?: WebpackDevServerConfiguration;
}

const config = (env: any, argv: any): Configuration => ({
	entry: './src/index.tsx',
	output: {
		clean: true,
		path: `${__dirname}/dist/frontend`,
		filename: '[name].[contenthash].bundle.js',
		chunkFilename: '[name].[contenthash].chunk.js',
	},
	devServer: env.WEBPACK_SERVE ? {
		historyApiFallback: true,
		proxy: {
			context: ['/api/', '/media/'],
			target: 'http://localhost:8000/',
		},
		static: `${__dirname}/dist/frontend`,
		hot: true,
	} : undefined,
	module: {
		rules: [
			{
				test: /\.(tsx?|jsx?)$/,
				exclude: /node_modules/,
				use: 'babel-loader',
			},
			{
				test: /\.s?css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
		],
	},
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx', '.css'],
		alias: {
			styles: `${__dirname}/src/styles/`,
			components: `${__dirname}/src/components/`,
			routes: `${__dirname}/src/routes/`,
			services: `${__dirname}/src/services/`,
			utils: `${__dirname}/src/utils/`,
		},
	},
	optimization: {
		minimizer: [
			'...',
			new CssMinimizerPlugin(),
		],
	},
	plugins: [
		new Dotenv(),
		new ForkTsCheckerWebpackPlugin(),
		new HtmlWebpackPlugin(
			argv.mode === 'development' ? {
				template: './src/dev.html',
				publicPath: '/',
			} : {
				template: './src/prod.html',
				publicPath: '/static/frontend/',
			}
		),
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css',
		}),
	],
});

export default config;