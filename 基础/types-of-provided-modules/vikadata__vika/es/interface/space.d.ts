export interface ISpaceItem {
    id: string;
    name: string;
    isAdmin?: boolean;
}
export declare type IGetSpaceListResponseData = {
    spaces: ISpaceItem[];
};
