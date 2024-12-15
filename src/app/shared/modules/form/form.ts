import { Module, ModuleDecorator } from "@decorators";
import { IFormMap, IFormBtns } from "./interfaces/maps";
import { Autocomplete, Input, Select, Textarea, Checkbox, Radio, Range, Switch } from "./components";
import { FormComponent } from "./components/base";
import { FormFieldType } from "./interfaces";

import './forms.scss';

@ModuleDecorator
export class Form extends Module {
    query: { [name: string]: string } = {};
    fields: FormComponent[] = [];
    appBtns: HTMLButtonElement[] = [];
    submitable: boolean = false;

    constructor(private map: IFormMap, private btns: IFormBtns) {
        super({});
    }

    protected init(): void {
        this.innerHTML = '';
        if (!this.fields.length) this.createFields();
        this.append(this.createLegend(), ...this.fields, this.createBtns());
    }

    // Legend creator.
    private createLegend(): HTMLLegendElement | string {
        if (this.map.legend?.length) {
            const legend = this.cElem('legend');
            legend.innerText = this.map.legend;
            delete this.map.legend;
            return legend;
        } else return '';
    }

    // Fields creator.
    private createFields(): (FormFieldType)[] {
        return this.fields = Object.values(this.map.fields).map((obj) => {
            let field: FormFieldType;
            switch (obj.type) {
                case 'input':
                    field = new Input(obj.props);
                    if (obj.props.multiplyBy?.length) {
                        setTimeout(() => {
                            const ref = this.fields.find(field => field.props.label === obj.props.multiplyBy);
                            this.addRefListener(ref, field as Input);
                            this.multiply(ref, field as Input);
                        });
                    }
                    break;
                case 'select':
                    field = new Select(obj.props);
                    break;
                case 'textarea':
                    field = new Textarea(obj.props);
                    break;
                case 'autocomplete':
                    field = new Autocomplete(obj.props);
                    break;
                case "checkbox":
                    field = new Checkbox(obj.props);
                    break;
                case "range":
                    field = new Range(obj.props);
                    break;
                case "radio":
                    field = new Radio(obj.props);
                    break;
                case "switch":
                    field = new Switch(obj.props);
                    break;
                // TODO
                // URL
                // Telephone
                // Hidden (not visible, holds values for submission)
                // Color picker
                // Date and time (combined)
                // Multi-select dropdown
                // Listbox (multi-select list)
                // File upload
                // Date and time picker (calendar-based)
                // Captcha
                // Rating (stars or other symbols)
                // Tag input (adding/removing multiple items)
                // Currency input (often with symbol display)
                // Stepper (increment/decrement control)
                // File drag and drop zone
                // Masked input (for formatted data, e.g., phone numbers)
                // Rich text editor
                // Signature field
                // QR code scanner (input by scanning)
                // Geolocation (with map or coordinates)
                // CSRF token (for security)
                // User ID/session data
                // Tracking data or analytics
            }
            field.formCb = () => {
                this.query[obj.props.name] = `${field.value} ${obj.props.dataset?.unit ?? ''}`.trim();
                this.checkForm();
            }
            return field;
        });
    }

    // Buttons creator.
    private createBtns(): HTMLDivElement {
        // TODO
        // Icon button (button with only an icon)
        // Image button (custom image as button)
        const wrapper = this.cElem('div');
        const baseCls = 'form-';
        wrapper.className = `${baseCls}btns`;
        if (!this.btns.length) {
            wrapper.style.display = 'none';
            return wrapper;
        }
        wrapper.append(...this.btns.map((props) => {
            const btn = this.cElem('button');
            btn.className = `${baseCls}${props.text}`;
            btn.innerText = props.text;
            btn.type = props.type;
            if (btn.type === 'reset') {
                btn.onclick = () => this.resetForm();
            } else {
                btn.onclick = () => props.cb ? this.cleanQuery() && props.cb(this.query) : null;
                btn.disabled = !this.submitable;
                this.appBtns.push(btn);
            }
            return btn;
        }));
        return wrapper;
    }

    // Query reset.
    private cleanQuery(): true {
        for (const key of Object.keys(this.query)) if (!this.query[key]?.length) delete this.query[key];
        return true;
    }

    // Form reset.
    resetForm(): void {
        for (let field of this.fields) field.reset();
        this.checkForm();
    }

    // Multiplication.
    private addRefListener(ref: FormComponent | undefined, toClone: Input): void {
        if (ref) {
            if (!ref.value) ref?.onInput('1');
            ref.addEventListener('input', () => this.multiply(ref, toClone));
        }
    }

    private multiply(ref: FormComponent | undefined, toClone: Input): void {
        if (!ref?.value) return;
        let idx = -1;
        const amount = this.fields.filter((field, i) => {
            if (field.props.name.includes(`${toClone.props.name}`)) {
                if (idx < 0) idx = i;
                return field;
            }
        }).length;
        const newFields = [];
        for (let ctx = 1; ctx <= +ref?.value; ctx++) {
            const props = structuredClone(toClone.props);
            props.name += `${ctx}`;
            const field = new Input(props);
            field.formCb = () => {
                this.query[props.name] = `${field.value} ${props.dataset?.unit ?? ''}`.trim();
                this.checkForm();
            }
            field.onchange = () => { this.query[props.name] = field.value?.length ? `${field.value} ${props.dataset?.unit ?? ''}` : ''; this.checkForm(); };
            newFields.push(field);
        }
        this.fields.splice(idx, amount, ...newFields);
        this.init();
        this.fields[0].focus();
    }

    // Form check.
    checkForm(): void {
        this.submitable = !this.fields.some(field => field.hasError);
        for (const btn of this.appBtns) btn.disabled = !this.submitable;
    }
}