declare module '*.css';
declare module '*.scss';
declare module '*.png' {
	export const URL: string;
	export default URL;
}
declare module '*.jpg' {
	export const URL: string;
	export default URL;
}
declare module '*.svg?url' {
	export const URL: string;
	export default URL;
}
declare module '*.svg' {
	import React from 'react';
	export const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
	export default SVG;
}
