import { AxiosInstance } from "axios-0.21.1";
import { Datasheet } from "./datasheet";
import { IHttpResponse, IVikaClientConfig } from "./interface";
import { NodeManager } from "./node";
import { SpaceManager } from "./space";
import { IframeManager } from "./iframe";
export declare class Vika {
    config: IVikaClientConfig;
    axios: AxiosInstance;
    static QPSMap: Map<string, {
        count: number;
        lastReqTimestamp: number;
    }>;
    constructor(config: IVikaClientConfig);
    request<T>(config: {
        path: string;
        params?: any;
        method: "get" | "post" | "patch" | "delete";
        data?: {
            [key: string]: any;
        };
        headers?: any;
        timeout?: number;
    }): Promise<IHttpResponse<T>>;
    /**
     * Resources - Number Table Management.
     * @param datasheetId Datasheet ID
     * @returns
     */
    datasheet(datasheetId: string): Datasheet;
    /**
     * Node Management.
     */
    get nodes(): NodeManager;
    /**
     * Space
     */
    get spaces(): SpaceManager;
    /**
     * Get a single space.
     */
    space(spaceId: string): SpaceManager;
    /**
     * 获取 iframe 通信
     */
    getIframe(): IframeManager;
}
