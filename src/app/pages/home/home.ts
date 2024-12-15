import { Page, PageDecorator } from "@decorators";
import { Hero } from "@shared";
import { Counter } from "./components/counter";

import './home.scss';

@PageDecorator
export class Home extends Page {
    protected init() {
        this.append(new Hero({header: 'wellcome to vanilla', subHeader: 'Not a framework, but a frame to work with.', img: '/hero.jpeg',}, this.appState), new Counter({}));
        super.init();
        this.showPage();
    }
}