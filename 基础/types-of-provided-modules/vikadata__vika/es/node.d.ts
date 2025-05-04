import { IGetNodeListResponseData, IGetNodeListReqParams, IGetNodeDetailReqParams, IGetNodeDetailResponseData, ISearchNodeListReqParams, ISearchNodeListResponseData } from './interface';
import { Vika } from './apitable';
export declare class NodeManager {
    apitable: Vika;
    constructor(apitable: Vika);
    /**
     * Get the list of root nodes of the specified space stations.
     * @param param0
     */
    list<T = IGetNodeListResponseData>(params: IGetNodeListReqParams): Promise<import("./interface").IHttpResponse<T>>;
    /**
     * Get information about the specified node.
     */
    get<T = IGetNodeDetailResponseData>(params: IGetNodeDetailReqParams): Promise<import("./interface").IHttpResponse<T>>;
    /**
     * Search Nodes.
     */
    search<T = ISearchNodeListResponseData>(params: ISearchNodeListReqParams): Promise<import("./interface").IHttpResponse<T>>;
}
