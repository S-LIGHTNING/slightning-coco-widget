import { FormInstance } from 'rc-field-form';
import type { FieldProps } from 'rc-field-form/lib/Field';
import type { FC, MutableRefObject, ReactNode } from 'react';
import React from 'react';
import { NativeProps } from '../../utils/native-props';
import { ListItemProps } from '../list';
import type { FormLayout } from './index';
declare type RenderChildren<Values = any> = (form: FormInstance<Values>) => ReactNode;
declare type ChildrenType<Values = any> = RenderChildren<Values> | ReactNode;
declare type RcFieldProps = Omit<FieldProps, 'children'>;
export declare type FormItemProps = Pick<RcFieldProps, 'dependencies' | 'valuePropName' | 'name' | 'rules' | 'messageVariables' | 'trigger' | 'validateTrigger' | 'shouldUpdate' | 'initialValue' | 'getValueFromEvent' | 'getValueProps' | 'normalize' | 'preserve' | 'validateFirst'> & Pick<ListItemProps, 'style' | 'extra' | 'clickable' | 'arrow' | 'arrowIcon' | 'description'> & {
    label?: ReactNode;
    help?: ReactNode;
    helpIcon?: ReactNode;
    hasFeedback?: boolean;
    required?: boolean;
    noStyle?: boolean;
    disabled?: boolean;
    hidden?: boolean;
    layout?: FormLayout;
    childElementPosition?: 'normal' | 'right';
    children?: ChildrenType;
    onClick?: (e: React.MouseEvent, widgetRef: MutableRefObject<any>) => void;
} & NativeProps;
export declare const FormItem: FC<FormItemProps>;
export {};
