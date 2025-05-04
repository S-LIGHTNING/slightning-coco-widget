import { APIMetaFieldPropertyFormatEnums, RollUpFuncType, TSymbolAlign } from "../enums";
import { IFormat } from "./field.property";
export interface IOpenSingleTextFieldProperty {
    defaultValue?: string;
}
export interface IOpenNumberFieldProperty {
    defaultValue?: string;
    precision: number;
    symbol?: string;
}
export interface IOpenCheckboxFieldProperty {
    icon: string;
}
export interface IOpenRatingFieldProperty {
    /** Maximum value 1 - 10. */
    max: number;
    /** Emoji slug. */
    icon: string;
}
export interface IOpenPercentFieldProperty {
    /** New record default value. */
    defaultValue?: string;
    /** Retain decimal places. */
    precision: number;
}
export interface IOpenCurrencyFieldProperty {
    /** New record default value. */
    defaultValue?: string;
    /** Unit. */
    symbol: string;
    /** Retain decimal places. */
    precision: number;
    /** Unit alignment. */
    symbolAlign?: TSymbolAlign;
}
export declare type IMultiSelectedIds = string[];
export interface IWriteOpenSelectBaseFieldProperty {
    defaultValue?: string | IMultiSelectedIds;
    /** Option Configuration. */
    options: {
        id?: string;
        name: string;
        /** color name */
        color?: string;
    }[];
}
export interface IOpenDateTimeFieldProperty {
    dateFormat: string;
    timeFormat?: string;
    /** Whether to automatically fill in the creation time when adding a record. */
    autoFill?: boolean;
    includeTime?: boolean;
}
export declare type IAddOpenTextFieldProperty = null;
export declare type IAddOpenURLFieldProperty = null;
export declare type IAddOpenEmailFieldProperty = null;
export declare type IAddOpenPhoneFieldProperty = null;
export declare type IAddOpenSingleTextFieldProperty = IOpenSingleTextFieldProperty;
export declare type IAddOpenNumberFieldProperty = IOpenNumberFieldProperty;
export declare type IAddOpenCheckboxFieldProperty = IOpenCheckboxFieldProperty;
export declare type IAddOpenRatingFieldProperty = IOpenRatingFieldProperty;
export declare type IAddOpenPercentFieldProperty = IOpenPercentFieldProperty;
export declare type IAddOpenCurrencyFieldProperty = IOpenCurrencyFieldProperty;
export declare type IAddOpenSingleSelectFieldProperty = IWriteOpenSelectBaseFieldProperty;
export declare type IAddOpenMultiSelectFieldProperty = IWriteOpenSelectBaseFieldProperty;
export interface IAddOpenMemberFieldProperty {
    isMulti?: boolean;
    /** Whether to send notifications. */
    shouldSendMsg?: boolean;
}
export declare type IAddOpenDateTimeFieldProperty = IOpenDateTimeFieldProperty;
export declare type IAddOpenAttachmentFieldProperty = null;
export interface IAddOpenMagicLinkFieldProperty {
    /** Association datasheet ID, switch the association datasheet, the previous brotherField will be converted to a text field */
    foreignDatasheetId: string;
    /** Specify the view ID to filter the records. */
    limitToViewId?: string;
    /** Whether to restrict selection to a single record. */
    limitSingleRecord?: boolean;
}
export interface IOpenComputedFormat {
    type: APIMetaFieldPropertyFormatEnums;
    format: IFormat;
}
export interface IAddOpenMagicLookUpFieldProperty {
    /** Associated field ID of the referenced current datasheet. */
    relatedLinkFieldId: string;
    /** Field ID of the query in the correlation datasheet. */
    targetFieldId: string;
    /** Aggregate functions. */
    rollupFunction?: RollUpFuncType;
    /** Format, which varies due to differences in the referenced fields (number, percent, date, currency) */
    format?: IOpenComputedFormat;
}
export interface IAddOpenFormulaFieldProperty {
    /** Formula expressions. */
    expression?: string;
    /**
     * The calculated value may not be obtained properly when the relevant field on which
     * the formula depends is deleted or converted to a type.
     */
    format?: IOpenComputedFormat;
}
export declare type IAddOpenAutoNumberFieldProperty = null;
export declare type IOpenCreatedTimeFieldProperty = Omit<IOpenDateTimeFieldProperty, 'autoFill'>;
export declare type IAddOpenCreatedTimeFieldProperty = IOpenCreatedTimeFieldProperty;
export declare enum CollectType {
    AllFields = 0,
    SpecifiedFields = 1
}
export interface IAddOpenLastModifiedTimeFieldProperty {
    dateFormat: string;
    timeFormat?: string;
    includeTime?: boolean;
    /** Specify the field type: 0 All editable, 1 Specify the field */
    collectType?: CollectType;
    /** Whether to specify the field, array type can specify more than one field, not fill for all. */
    fieldIdCollection?: string[];
}
export declare type IAddOpenCreatedByFieldProperty = null;
export interface IAddOpenLastModifiedByFieldProperty {
    /** Specify the field type: 0 All editable, 1 Specify the field. */
    collectType?: CollectType;
    /** Whether to specify the field, array type can specify more than one field, not fill for all. */
    fieldIdCollection?: string[];
}
export declare type IAddOpenFieldProperty = IAddOpenTextFieldProperty | IAddOpenURLFieldProperty | IAddOpenEmailFieldProperty | IAddOpenPhoneFieldProperty | IAddOpenSingleTextFieldProperty | IAddOpenNumberFieldProperty | IAddOpenCheckboxFieldProperty | IAddOpenRatingFieldProperty | IAddOpenPercentFieldProperty | IAddOpenCurrencyFieldProperty | IAddOpenSingleSelectFieldProperty | IAddOpenMultiSelectFieldProperty | IAddOpenMemberFieldProperty | IAddOpenDateTimeFieldProperty | IAddOpenAttachmentFieldProperty | IAddOpenMagicLinkFieldProperty | IAddOpenMagicLookUpFieldProperty | IAddOpenFormulaFieldProperty | IAddOpenAutoNumberFieldProperty | IAddOpenCreatedTimeFieldProperty | IAddOpenLastModifiedTimeFieldProperty | IAddOpenCreatedByFieldProperty | IAddOpenLastModifiedByFieldProperty;
