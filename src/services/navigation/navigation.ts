import { Loader } from "@shared";
import { Device } from "@services/device/device";
import { Language } from "@services/language/language";
import type { Page } from "@decorators";
import type { State } from "@services/state/state";
import { StateKeys } from "@constants/stateKeys.constant";
import { IPages, IPage } from "./types";

export class Navigation {
    private loader = new Loader({});
    private currentPage: Page<any>;
    private cachedPages: Map<string, Page<any>> = new Map();
    private i18n = new Language();
    private history: string[] = [];

    get pages(): IterableIterator<string> {
        return this._pages.keys();
    }

    constructor(private state: State, private ref: HTMLElement, private _pages: IPages, private homePage = '/home', public basePath = '/') {
        window.addEventListener('popstate', () => {
            this.history[this.history.length - 2]
                ? this.loadingProcess(this.history[this.history.length - 2])
                : this.fisrtLoad();
        });
        window.addEventListener('hashchange', () => history.replaceState(null, '', window.location.pathname), { once: true });
        // this.buildTreeMap();
        this.subscribes();
    }

    // ------------------------------
    // Initiation section.
    // ------------------------------
    private subscribes(): void {
        // Page Navigation.
        this.state.subscribe(StateKeys.navigate, (path) => this.loadingProcess(path));
        // Load Page.
        this.state.subscribe(`${this.basePath}:${StateKeys.contentReady}`, () => this.ref.replaceChild(this.currentPage, this.loader));
    }

    // ------------------------------
    // Texts handles.
    // ------------------------------
    public async importTexts(): Promise<void> {
        await this.i18n.importTexts(Device.lang);
        this.fisrtLoad();
    }

    public setTexts(texts: any): void {
        this.i18n.texts = texts;
        this.fisrtLoad();
    }

    // ------------------------------
    // Loading section.
    // ------------------------------
    public reload(): void {
        this.ref.replaceChild(this.loader, this.currentPage);
        this.navigationLogic(location.pathname);
    }

    private fisrtLoad(): void {
        // this.history = [];
        if (location.pathname === this.basePath) this.pushState(this.homePage);
        Array.from(this.ref.children).forEach(child => !child.classList.contains('navbar') ? this.ref.removeChild(child) : null);
        this.ref.append(this.loader);
        // this.log('fisrtLoad', location.pathname);
        this.navigationLogic(location.pathname);
    }

    private loadingProcess(path: string): void {
        if (location.pathname === path) return;
        // this.log('loadingProcess', path);
        this.pushState(path);
        try {
            this.ref.replaceChild(this.loader, this.currentPage);
            this.navigationLogic(path);
        } catch (_) {
            this.fisrtLoad();
        }
    }

    private navigationLogic(path: string): void {
        path = this.findPage(path);
        // this.log('navigationLogic', `${this.getBasePath()}${path}`);
        document.title = `Vanilla | ${(path).slice(1).addSpaces('-').titleCase()}`;
        if (this.cachedPages.has(path)) {
            this.currentPage = this.cachedPages.get(path)!;
            this.ref.replaceChild(this.currentPage, this.loader);
            if (this.currentPage.navigation) this.currentPage.navigation.reload();
        } else {
            const Page = this.getPage(path);
            if (Page.name === this.currentPage?.constructor.name && !location.pathname.includes(path)) return;
            const texts = this.i18n.getTexts(path.remove(/(\-|\/)/));
            this.cachedPages.set(path, new Page(texts, this.state));
            this.currentPage = this.cachedPages.get(path)!;
        }
    }

    // ------------------------------
    // Utilities.
    // ------------------------------
    private getPage(path: string): IPage {
        // this.log('getPage', path);
        return this._pages.get(path) as IPage;
    }

    private findPage(path: string): string {
        // this.log('findPage', path);
        if (path === this.basePath) return this.homePage;
        const pathArr = path.slice(1).split('/');
        for (let i = 0; i < pathArr.length; i++) if (this._pages.has(`/${pathArr[i]}`)) return `/${pathArr[i]}`;
        return this.homePage;
    }

    private pushState(path: string): void {
        this.history.push(path);
        window.history.pushState(null, '', `${this.getBasePath()}${path}`);
    }

    private getBasePath(): string {
        return this.basePath === '/' ? '' : this.basePath;
    }

    private log(fnName: string, path: string): void {
        console.log('base path: ', this.basePath, `\n${fnName}: `, path, '\n-----------------------------');
    }

    // ------------------------------
    // Statics.
    // ------------------------------
    // static lastCrumb(): string {
    //     return location.pathname.slice(1).split('/').last;
    // }
}