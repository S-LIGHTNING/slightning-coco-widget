import { AxiosRequestConfig } from 'axios-0.21.1';
import { IVikaClientConfig } from "./interface";
export declare const wait: (timeout: number) => Promise<unknown>;
export declare const chunks: (arr: any[], chunkSize: number) => any[][];
export declare const getResourceId: (url?: string | undefined) => string | null;
export declare const QPSController: (QPS?: number, OFFSET?: number) => (config: AxiosRequestConfig) => Promise<AxiosRequestConfig>;
export declare const mergeConfig: (config: IVikaClientConfig) => IVikaClientConfig;
export declare const subBeforeIfHaving: (str: string | undefined, searchString: string) => string | undefined;
export declare const isBrowser: boolean;
