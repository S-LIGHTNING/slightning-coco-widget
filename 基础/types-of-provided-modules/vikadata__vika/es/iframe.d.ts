import { IframeMessageName } from "./enums";
import { IEventFunc, ITriggerIframeMessage } from "./interface/iframe";
export declare class IframeManager {
    event: Map<string, Set<IEventFunc>>;
    private listener;
    constructor();
    subscribe(eventName: IframeMessageName, func: IEventFunc): void;
    unSubscribe(eventName: IframeMessageName, func: IEventFunc): void;
    unSubscribeAll(): void;
    triggerEvent({ iframeRef, eventName, data }: ITriggerIframeMessage): void;
}
