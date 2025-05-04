import { IGetFieldsListRespData } from '../interface';
import { IDatasheetFieldCreateRo } from '../interface/datasheet.field.create.ro';
import { IDatasheetFieldCreateVo } from '../interface/datasheet.field.create.vo';
import { Vika } from '../apitable';
import { Datasheet } from './datasheet';
export declare class FieldManager {
    datasheet: Datasheet;
    apitable: Vika;
    constructor(datasheet: Datasheet);
    get APIEndpoint(): string;
    /**
     * Get a list of fields.
     */
    list(): Promise<import("../interface").IHttpResponse<IGetFieldsListRespData>>;
    /**
     * Create field.
     */
    create(fieldCreateRo: IDatasheetFieldCreateRo): Promise<import("../interface").IHttpResponse<IDatasheetFieldCreateVo>>;
    /**
     * Delete field.
     * @param fieldId
     * @returns
     */
    delete(fieldId: string): Promise<import("../interface").IHttpResponse<IGetFieldsListRespData>>;
}
