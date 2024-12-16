import { Component, ComponentDecorator } from "@decorators";
import { ISeperatorText } from "./lang";

import './seperator.scss';

@ComponentDecorator
export class Seperator extends Component<ISeperatorText>{
    protected init(): void {
        this.innerText = this.config.header;
    }
}