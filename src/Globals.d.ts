declare module '*.css';
declare module '*.scss';

declare function pluralidx(n: number): number;
declare function gettext(msgid: string): string;
declare function ngettext(singular: string, plural: string, count: number): string;
declare function gettext_noop(msgid: string): string;
declare function pgettext(context: string, msgid: string): string;
declare function npgettext(context: string, singular: string, plural: string, count: number): string;
declare function interpolate(fmt: string, obj: any[] | Record<string, any>, named?: boolean): string;
declare function get_format(format_type: string): string;
declare const jsi18n_initialized: boolean;