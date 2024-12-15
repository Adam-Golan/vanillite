import { Component, ComponentDecorator } from "@decorators";
import { IHeaderText } from "./lang";

import './header.scss';

@ComponentDecorator
export class Header extends Component<IHeaderText> {
    protected init(): void {
        const h1 = this.cElem('h1');
        const h3 = this.cElem('h3');
        h1.innerText = this.config.header;
        h3.innerText = this.config.subHeader;
        this.append(h1, h3);
    }
}