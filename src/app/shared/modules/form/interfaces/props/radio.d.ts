import { Props } from "./base";

export interface IRadioProps extends Omit<Props, 'placeholder' | 'autocomplete' | 'required' | 'error'>, Partial<Pick<HTMLInputElement, 'value'>> {
    label: string;
    values: string[];
}

export interface IRadioElement {
    type: 'radio';
    props: IRadioProps;
}