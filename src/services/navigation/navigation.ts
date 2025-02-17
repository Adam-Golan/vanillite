import { Loader } from "@shared";
import type { Page } from "@decorators";
import type { State } from "@services/state/state";
import { StateKeys } from "@constants/stateKeys.constant";
import { IPages, IPage, IPagesTree } from "./types";
import { appConfig } from "app.config";

export class Navigation {
    private loader = new Loader({});
    private currentPage: Page;
    private cachedPages: Map<string, Page> = new Map();
    private history: string[] = [];
    public tree: IPagesTree;
    private homePage: string;

    // get pages(): IterableIterator<string> {
    //     return this._pages.keys();
    // }

    constructor(private state: State, private ref: HTMLElement, private pages: IPages, public basePath = '/') {
        this.tree = this.createTree();
        this.subscribes();
        this.homePage = pages.keys().next().value || '/home';
    }

    // ------------------------------
    // Initiation section.
    // ------------------------------
    private subscribes(): void {
        // Page Navigation.
        this.state.subscribe(StateKeys.navigate, (path) => this.loadingProcess(path));
        // Load Page.
        this.state.subscribe(`${this.basePath}:${StateKeys.contentReady}`, () => this.ref.replaceChild(this.currentPage, this.loader));
        window.addEventListener('popstate', () => {
            this.history[this.history.length - 2]
                ? this.loadingProcess(this.history[this.history.length - 2])
                : this.fisrtLoad();
        });
        window.addEventListener('hashchange', () => history.replaceState(null, '', window.location.pathname), { once: true });
    }

    private createTree(pages: IPages = this.pages): IPagesTree {
        const tree: IPagesTree = [];
        pages.forEach((value, key) => {
            value.getPages
                ? tree.push({ [key]: this.createTree(value.getPages()) })
                : tree.push(key);
        });
        return tree;
    }

    // ------------------------------
    // Loading section.
    // ------------------------------
    public reload(): void {
        this.ref.replaceChild(this.loader, this.currentPage);
        this.navigationLogic(location.pathname);
    }

    fisrtLoad(): void {
        this.pushState(this.findPage(location.pathname));
        Array.from(this.ref.children).forEach(child => !child.classList.contains('navbar') ? this.ref.removeChild(child) : null);
        this.ref.append(this.loader);
        // this.log('fisrtLoad', location.pathname);
        this.navigationLogic(location.pathname);
    }

    private loadingProcess(path: string): void {
        if (path.slice(1).remove('-') === this.currentPage?.id) return;
        // this.log('loadingProcess', path);
        path = this.searchFullPath(path) || this.homePage;
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
        document.title = `${appConfig.siteURL.replace(/(https?:\/\/|www\.)/, '').sliceTo('.').titleCase()} | ${(path).slice(1).addSpaces('-').titleCase()}`;
        if (this.cachedPages.has(path)) {
            this.currentPage = this.cachedPages.get(path)!;
            this.ref.replaceChild(this.currentPage, this.loader);
            if (this.currentPage.navigation) this.currentPage.navigation.reload();
        } else {
            const Page = this.pages.get(path)!;
            if (Page.name === this.currentPage?.constructor.name && !location.pathname.includes(path)) return;
            this.cachedPages.set(path, new Page(null, this.state));
            this.currentPage = this.cachedPages.get(path)!;
        }
    }

    // ------------------------------
    // Utilities.
    // ------------------------------
    private searchFullPath(path: string, tree = this.tree): string | null {
        // this.log('searchPath', path);
        const fullPath: string[] = [];
        for (const branch of tree) {
            if (typeof branch !== 'string')
                for (const key of Object.keys(branch)) {
                    const result = this.searchFullPath(path, branch[key]);
                    if (result) fullPath.push(key, result);
                }
            else if (branch === path) fullPath.push(path);
        }
        return fullPath.length ? fullPath.join('') : null;
    }

    private findPage(path: string): string {
        // this.log('findPage', path);
        if (path === this.basePath) return this.homePage;
        const pathArr = path.slice(1).split('/');
        for (let i = 0; i < pathArr.length; i++) if (this.pages.has(`/${pathArr[i]}`)) return `/${pathArr[i]}`;
        return this.homePage;
    }

    private pushState(path: string): void {
        this.history.push(path);
        if (!location.pathname.includes(path))
            window.history.pushState(null, '', `${this.basePath === '/' ? '' : this.basePath}${path}`);
    }

    private log(fnName: string, path: string): void {
        console.log('base path: ', this.basePath, `\n${fnName}: `, path, '\n-----------------------------');
    }
}