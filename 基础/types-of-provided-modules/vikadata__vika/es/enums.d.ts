export declare enum FieldType {
    Text = "Text",
    Number = "Number",
    SingleSelect = "SingleSelect",
    MultiSelect = "MultiSelect",
    DateTime = "DateTime",
    Attachment = "Attachment",
    MagicLink = "MagicLink",
    URL = "URL",
    Email = "Email",
    Phone = "Phone",
    Checkbox = "Checkbox",
    Rating = "Rating",
    Member = "Member",
    MagicLookUp = "MagicLookUp",
    Formula = "Formula",
    Currency = "Currency",
    Percent = "Percent",
    SingleText = "SingleText",
    AutoNumber = "AutoNumber",
    CreatedTime = "CreatedTime",
    LastModifiedTime = "LastModifiedTime",
    CreatedBy = "CreatedBy",
    LastModifiedBy = "LastModifiedBy"
}
export declare enum RollUpFuncType {
    VALUES = "VALUES",
    AVERAGE = "AVERAGE",
    COUNT = "COUNT",
    COUNTA = "COUNTA",
    COUNTALL = "COUNTALL",
    SUM = "SUM",
    MIN = "MIN",
    MAX = "MAX",
    AND = "AND",
    OR = "OR",
    XOR = "XOR",
    CONCATENATE = "CONCATENATE",
    ARRAYJOIN = "ARRAYJOIN",
    ARRAYUNIQUE = "ARRAYUNIQUE",
    ARRAYCOMPACT = "ARRAYCOMPACT"
}
export declare enum ViewType {
    Grid = "Grid",
    Gallery = "Gallery",
    Kanban = "Kanban",
    Gantt = "Gantt"
}
export declare enum TSymbolAlign {
    Default = "Default",
    Left = "Left",
    Right = "Right"
}
export declare enum Conversion {
    /** Delete associated fields from related datasheet. */
    Delete = "delete",
    /** Keep the associated fields of the associated datasheet and convert them to text type. */
    KeepText = "keepText"
}
export declare enum APIMetaFieldPropertyFormatEnums {
    DateTime = "DateTime",
    Number = "Number",
    Percent = "Percent",
    Currency = "Currency"
}
export declare enum IframeMessageName {
    Collaborators = "collaborators",
    SocketStatus = "socketStatus",
    SocketError = "socketError",
    ChangeView = "changeView",
    ChangeNodeName = "changeNodeName",
    PageLoaded = "pageLoaded",
    EmbedLinkFail = "embedLinkFail",
    PageCrash = "pageCrash",
    ChangeViewName = "changeViewName",
    TriggerEventResult = "triggerEventResult"
}
export declare enum TriggerIframeMessageName {
    ExportData = "exportData"
}
export declare enum Network {
    Online = "online",
    Offline = "offline",
    Sync = "sync",
    Loading = "loading"
}
