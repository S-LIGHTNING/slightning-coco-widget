export declare enum LogLevel {
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error"
}
export interface Logger {
    (level: LogLevel, message: string, extraInfo: Record<string, unknown>): void;
}
export declare function makeLogger(name: string): Logger;
