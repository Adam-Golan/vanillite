import { Component, ComponentDecorator } from "@decorators";

import './counter.scss';

@ComponentDecorator
export class Counter extends Component<{}> {
    _value: number = 0;
    field = this.cElem('span');

    set value(newVal: number) {
        this.uElem('field', this._value = newVal);
    }

    protected init(): void {
        this.createHeader();
        const [container, add, sub] = this.cAlot([{ tag: 'div', cls: 'container counter' }, { tag: 'span', cls: 'add' }, { tag: 'span', cls: 'sub' }]);
        this.value = this._value;
        this.field.className = 'value';
        add.innerHTML = '+';
        add.onclick = () => this.value = ++this._value;
        sub.innerHTML = '-';
        sub.onclick = () => this.value = --this._value;
        container.append(add, this.field, sub);
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
        samp.innerText = Counter.toString();
        this.append(header, samp);
    }
}