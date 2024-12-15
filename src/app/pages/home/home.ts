import { Page, PageDecorator } from "@decorators";
import type { texts } from "@i18n/en/lang";
import { Hero } from "@shared";

import './home.scss';
import { Counter } from "./components/counter";

@PageDecorator
export class Home extends Page<typeof texts.home> {
    protected init() {
        this.append(new Hero(this.texts.HERO, this.appState), new Counter({}));
        super.init();
        this.showPage();
    }
}