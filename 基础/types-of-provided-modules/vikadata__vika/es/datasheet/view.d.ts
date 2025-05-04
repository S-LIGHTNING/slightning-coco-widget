import { IGetViewsListRespData } from '../interface/view';
import { Vika } from '../apitable';
import { Datasheet } from './datasheet';
export declare class ViewManager {
    datasheet: Datasheet;
    apitable: Vika;
    constructor(datasheet: Datasheet);
    get APIEndpoint(): string;
    /**
     *
     */
    list(): Promise<import("..").IHttpResponse<IGetViewsListRespData>>;
}
