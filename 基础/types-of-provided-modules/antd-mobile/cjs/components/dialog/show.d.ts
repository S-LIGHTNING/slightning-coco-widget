import { DialogProps } from './dialog';
export declare type DialogShowProps = Omit<DialogProps, 'visible' | 'destroyOnClose' | 'forceRender'>;
export declare type DialogShowHandler = {
    close: () => void;
};
export declare const closeFnSet: Set<() => void>;
export declare function show(props: DialogShowProps): DialogShowHandler;
