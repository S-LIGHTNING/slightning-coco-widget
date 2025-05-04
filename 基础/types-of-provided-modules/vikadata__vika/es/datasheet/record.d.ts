import { ICreateRecordsReqParams, ICreateRecordsResponseData, IGetRecordsReqParams, IGetRecordsResponseData, IRecord } from '../interface';
import { Vika } from '../apitable';
import { Datasheet } from './datasheet';
export declare class RecordManager {
    datasheet: Datasheet;
    datasheetId: string;
    apitable: Vika;
    constructor(datasheet: Datasheet);
    get APIEndpoint(): string;
    /**
     * Automatically handles paging and returns recordsets by batch.
     * for await (let eachPageRecords of dst.records.queryAll()){
     *    console.log(eachPageRecords)
     * }
     * @param params
     */
    queryAll(params?: Omit<IGetRecordsReqParams, 'pageSize' | 'pageNum'>): AsyncGenerator<IRecord[], void, unknown>;
    query(params?: IGetRecordsReqParams): Promise<import("../interface").IHttpResponse<IGetRecordsResponseData>>;
    get(recordIds: string | string[]): Promise<import("../interface").IHttpResponse<IGetRecordsResponseData>>;
    create(newRecords: ICreateRecordsReqParams, fieldKey?: "name" | "id" | undefined): Promise<import("../interface").IHttpResponse<ICreateRecordsResponseData>>;
    update(records: IRecord[], fieldKey?: "name" | "id" | undefined): Promise<import("../interface").IHttpResponse<ICreateRecordsResponseData>>;
    delete(recordIds: string | string[]): Promise<import("../interface").IHttpResponse<unknown>>;
}
