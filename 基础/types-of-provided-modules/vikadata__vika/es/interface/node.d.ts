export interface INodeItem {
    id: string;
    name: string;
    type: NodeType;
    icon: string;
    isFav: boolean;
}
export declare const enum NodeType {
    'Datasheet' = 0,
    'Mirror' = 1,
    'Folder' = 2,
    'Form' = 3,
    'Dashboard' = 4
}
export interface IGetNodeListReqParams {
    spaceId: string;
}
export declare type IGetNodeListResponseData = {
    nodes: INodeItem[];
};
export interface IGetNodeDetailReqParams {
    spaceId: string;
    nodeId: string;
}
export interface IGetNodeDetailResponseData extends INodeItem {
    children?: INodeItem[];
}
export interface ISearchNodeListReqParams {
    spaceId: string;
    type: NodeType;
    permissions?: number[];
    query?: string;
}
export declare type ISearchNodeListResponseData = {
    nodes: ISearchNodeDetail[];
};
export interface ISearchNodeDetail extends INodeItem {
    parentId?: string;
    permission: number;
}
