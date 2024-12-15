import { Component, ComponentDecorator } from "@decorators";

import './counter.scss';

@ComponentDecorator
export class Counter extends Component<{}> {
    value: number = 0;
    constructor(_: {}) {
        super(_);
    }
    
    protected init(): void {
        this.createHeader();
        const container = this.createContainer('counter');
        const value = this.cElem('span');
        value.innerText = `${this.value}`;
        value.className = 'value';
        const add = this.cElem('span');
        add.innerHTML = '+';
        add.className = 'add';
        add.onclick = () => value.innerText = `${++this.value}`;
        const sub = this.cElem('span');
        sub.innerHTML = '-';
        sub.className = 'sub';
        sub.onclick = () => value.innerText = `${--this.value}`;
        container.append(add, value, sub);
        this.append(container);
        this.createSnippet();
    }

    private createHeader(): void {
        const header = this.cElem('h2');
        header.innerText = 'This is a counter:';
        this.append(header);
    }

    private createSnippet(): void {
        const header = this.cElem('h3');
        header.innerText = 'This is the snippet:';
        const samp = this.cElem('code');
        samp.innerText = 'const value = this.cElem(\'span\');\nvalue.innerText = `${this.value}`;\nvalue.className = \'value\';\nconst add = this.cElem(\'span\');\nadd.innerHTML = \'+\';\nadd.className = \'add\';\nadd.onclick = () => value.innerText = `${++this.value}`;\nconst sub = this.cElem(\'span\');\nsub.innerHTML = \'-\';\nsub.className = \'sub\';\nsub.onclick = () => value.innerText = `${--this.value}`;';
        this.append(header, samp);
    }
}