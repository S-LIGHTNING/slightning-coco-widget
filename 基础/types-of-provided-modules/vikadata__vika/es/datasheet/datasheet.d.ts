import FormData from 'form-data';
import { IDatasheetCreateRo, IAttachment } from '../interface';
import { IDatasheetCreateVo } from '../interface/datasheet.create.vo';
import { Vika } from '../apitable';
import { FieldManager } from './field';
import { RecordManager } from './record';
import { ViewManager } from './view';
import { IEmbedLinkCreateRo, IEmbedLinkCreateVo } from '../interface/embed.link';
export declare class Datasheet {
    apitable: Vika;
    spaceId: string;
    datasheetId: string;
    constructor(spaceId: string, datasheetId: string, apitable: Vika);
    get fields(): FieldManager;
    get views(): ViewManager;
    get records(): RecordManager;
    /**
    * Create Form.
    */
    create(datasheetCreateRo: IDatasheetCreateRo): Promise<import("../interface").IHttpResponse<IDatasheetCreateVo>>;
    /**
     * Upload files.
     * @param file
     * @returns
     */
    upload(file: any, options?: FormData.AppendOptions): Promise<import("../interface").IHttpResponse<IAttachment>>;
    createEmbedLink(embedLinkCreateRo?: IEmbedLinkCreateRo): Promise<import("../interface").IHttpResponse<IEmbedLinkCreateVo>>;
    getEmbedLinks(): Promise<import("../interface").IHttpResponse<IEmbedLinkCreateVo[]>>;
    /**
     * @param linkId
     * @returns
     */
    deleteEmbedLink(linkId: string): Promise<import("../interface").IHttpResponse<IEmbedLinkCreateVo[]>>;
}
