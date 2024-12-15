import { ComponentDecorator } from '@decorators';
import { addMeta } from '@decorators/utils';

import './fluid.scss';

@ComponentDecorator
export class Fluid extends HTMLElement {

    constructor() {
        super();
        addMeta(this, 'component');
    }
}