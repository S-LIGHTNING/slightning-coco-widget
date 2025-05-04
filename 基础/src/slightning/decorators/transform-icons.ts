import { MethodsTypes, PropertiesTypes, Types } from "../types"
import { Widget } from "../widget"

export const ICON_URL_MAP: Record<string, string> = {
    "icon-dialog": "https://creation.bcmcdn.com/716/appcraft/IMAGE_SXY4eTgli_1738894324586.svg",
    "icon-scan-qr-code": "https://creation.bcmcdn.com/716/appcraft/IMAGE_EImzw5odGZ_1738894324587.svg",
    "icon-widget-actor": "https://creation.bcmcdn.com/716/appcraft/IMAGE_YVXz1URINQ_1738894324588.svg",
    "icon-widget-audio": "https://creation.bcmcdn.com/716/appcraft/IMAGE_LPAJGpF1X__1738894324589.svg",
    "icon-widget-brush": "https://creation.bcmcdn.com/716/appcraft/IMAGE_iqAvN4M-3L_1738894324591.svg",
    "icon-widget-button": "https://creation.bcmcdn.com/716/appcraft/IMAGE_ygdSsuBTM1_1738894324591.svg",
    "icon-widget-camera": "https://creation.bcmcdn.com/716/appcraft/IMAGE_vBhQu3HklT_1738894324592.svg",
    "icon-widget-canvas": "https://creation.bcmcdn.com/716/appcraft/IMAGE_HyX2I21HIe_1738894324594.svg",
    "icon-widget-checkbox": "https://creation.bcmcdn.com/716/appcraft/IMAGE_L23GJxU5uG_1738894324595.svg",
    "icon-widget-cloud-dict": "https://creation.bcmcdn.com/716/appcraft/IMAGE_BTRdhvrb2l_1738894324598.svg",
    "icon-widget-cloud-room": "https://creation.bcmcdn.com/716/appcraft/IMAGE_ZcerLC7GOC_1738894324596.svg",
    "icon-widget-cloud-table": "https://creation.bcmcdn.com/716/appcraft/IMAGE_U1NBmrg2QF_1738894324597.svg",
    "icon-widget-contact-picker": "https://creation.bcmcdn.com/716/appcraft/IMAGE_eh7WY4vim9_1738894324599.svg",
    "icon-widget-date-picker": "https://creation.bcmcdn.com/716/appcraft/IMAGE_5BNwaBk_IW_1738894324600.svg",
    "icon-widget-gyroscope": "https://creation.bcmcdn.com/716/appcraft/IMAGE_3a09PLSPRQ_1738894324601.svg",
    "icon-widget-http-client": "https://creation.bcmcdn.com/716/appcraft/IMAGE_yf_9_ekNHu_1738894324602.svg",
    "icon-widget-image": "https://creation.bcmcdn.com/716/appcraft/IMAGE_4sZuSDFkqIl_1738894324603.svg",
    "icon-widget-input": "https://creation.bcmcdn.com/716/appcraft/IMAGE_-EIWoX7ctRl_1738894324604.svg",
    "icon-widget-list-viewer": "https://creation.bcmcdn.com/716/appcraft/IMAGE_CizHBYub3vx_1738894324605.svg",
    "icon-widget-local-storage": "https://creation.bcmcdn.com/716/appcraft/IMAGE_Nfe5M_-XqCq_1738894324606.svg",
    "icon-widget-pedometer": "https://creation.bcmcdn.com/716/appcraft/IMAGE_Uch6b-t83Fb_1738894324607.svg",
    "icon-widget-phone-dialer": "https://creation.bcmcdn.com/716/appcraft/IMAGE_opGSFk3ryK6_1738894324608.svg",
    "icon-widget-qrcode": "https://creation.bcmcdn.com/716/appcraft/IMAGE_SKZ06Rea3il_1738894324609.svg",
    "icon-widget-radio": "https://creation.bcmcdn.com/716/appcraft/IMAGE_XsGEG6vcofk_1738894324611.svg",
    "icon-widget-slider copy 10": "https://creation.bcmcdn.com/716/appcraft/IMAGE_fSfhBEcYJIe_1738894324612.svg",
    "icon-widget-slider": "https://creation.bcmcdn.com/716/appcraft/IMAGE_EBUvZe43pi__1738894324613.svg",
    "icon-widget-sms-service": "https://creation.bcmcdn.com/716/appcraft/IMAGE_-X_DA7es5AM_1738894324614.svg",
    "icon-widget-switch": "https://creation.bcmcdn.com/716/appcraft/IMAGE_aSqQWV61Wod_1738894324615.svg",
    "icon-widget-table-data": "https://creation.bcmcdn.com/716/appcraft/IMAGE_cQVMUNMWXJT_1738894324616.svg",
    "icon-widget-text": "https://creation.bcmcdn.com/716/appcraft/IMAGE_28OpuQ0Vq5i_1738894324617.svg",
    "icon-widget-time-picker": "https://creation.bcmcdn.com/716/appcraft/IMAGE_ISJT89rx6kI_1738894324618.svg",
    "icon-widget-timer": "https://creation.bcmcdn.com/716/appcraft/IMAGE_gh8hy5hUCnq_1738894324619.svg",
    "icon-widget-volume-sensor": "https://creation.bcmcdn.com/716/appcraft/IMAGE_HKqL2kStbYN_1738894324620.svg",
    "icon-widget-web-view": "https://creation.bcmcdn.com/716/appcraft/IMAGE_QR6adggz8xb_1738894324621.svg"
}

export function transformIcons(types: Types, widget: Widget): [Types, Widget] {
    typesTransformIcons(types)
    return [types, widget]
}

function typesTransformIcons(types: Types): void {
    transformIcon(types.info)
    propertiesTypesTransformIcon(types.properties)
    methodsTypesTransformIcon(types.methods)
}

function propertiesTypesTransformIcon(properties: PropertiesTypes): void {
    for (const property of properties) {
        if (
            property.blockOptions?.get != null &&
            typeof property.blockOptions?.get == "object"
        ) {
            transformIcon(property.blockOptions.get)
        }
        if (
            property.blockOptions?.set != null &&
            typeof property.blockOptions?.set == "object"
        ) {
            transformIcon(property.blockOptions.set)
        }
        if ("contents" in property) {
            propertiesTypesTransformIcon(property.contents)
        }
    }
}

function methodsTypesTransformIcon(methods: MethodsTypes): void {
    for (const method of methods) {
        if (method.blockOptions != null) {
            transformIcon(method.blockOptions)
        }
        if ("contents" in method) {
            methodsTypesTransformIcon(method.contents)
        }
    }
}

function transformIcon(object: { icon?: string | null | undefined }): void {
    if (object.icon != null) {
        object.icon = ICON_URL_MAP[object.icon] ?? object.icon
    }
}
