import { Datasheet } from './datasheet/datasheet';
import { IGetSpaceListResponseData } from './interface';
import { Vika } from './apitable';
export declare class SpaceManager {
    apitable: Vika;
    spaceId: string;
    constructor(apitable: Vika, spaceId?: string);
    datasheet(datasheetId: string): Datasheet;
    get datasheets(): Datasheet;
    /**
     * Get a list of user space.
     */
    list<T = IGetSpaceListResponseData>(): Promise<import("./interface").IHttpResponse<T>>;
}
