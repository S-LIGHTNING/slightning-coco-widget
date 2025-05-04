import { LogLevel } from "./logging";
export declare const MAX_RECORD_SIZE = 1000;
export declare const QPS = 5;
export declare const MIN_TIME_GAP: number;
export declare const DST_MAX_RECORDS = 50000;
export declare const DEFAULT_HOST = "https://api.vika.cn";
export declare const FUSION_PATH_PREFIX = "/fusion";
export declare const DEFAULT_VERSION_PREFIX = "/fusion/v1";
export declare const DEFAULT_REQUEST_TIMEOUT = 60000;
export declare const MAX_WRITE_SIZE_PER_REQ = 10;
export declare const LOG_LEVEL_WEIGHT_MAP: {
    debug: number;
    info: number;
    warn: number;
    error: number;
};
