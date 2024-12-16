import { Basis } from "@decorators/base";
import { Enlist, addMeta } from "@decorators/utils";
import { type Navigation, State } from "@services";
import { StateKeys } from "@constants/stateKeys.constant";
import { LayoutType } from "@decorators/types";
import { Footer } from "@shared";

/**
 * Enlists a custom element into the Custom Elements Registry as a page.
 *
 * @param target - A constructor function for a custom element.
 */
export function PageDecorator(target: CustomElementConstructor) {
    Enlist('page', target);
}

export abstract class Page extends Basis<null> {
    // Creating a page's state.
    state = new State();
    // Declaring layout type.
    layout: LayoutType = 'single_column';
    // Declaring optional navigation.
    private navigation?: Navigation;

    private footer?: Footer;

    /**
     * Constructor for Page.
     * @param texts Page's texts.
     * @param appState Application's state.
     */
    constructor(protected _: null, protected appState: State) {
        super(_);
        addMeta(this, 'page');
        // Setting data-layout.
        this.dataset.layout = this.layout;
    }

    /**
     * Initializes the page.
     * Prints a message in the console if the page is not shown, and if the page has navigation, but the static method getPages() is not defined.
     * @remarks
     * This method is called automatically after the page is created.
     * If you don't want to see the message, you can delete this method or set the environment variable `DEV` to `false`.
     */
    protected init(): void {
        // Erase if upsetting.
        if (import.meta.env.DEV) {
            console.log('Don\'t forget to use showPage function, or you\'ll be stuck with the loader element.');
            if (this.navigation) console.log(`${this.constructor.name}: Don\'t forget to create a static method getPages(): IPages`);
        }
    }

    /**
     * Shows the page after the content is ready.
     * Publishes the `${path}:${StateKeys.contentReady}` state event.
     * If the page has a footer, creates a new Footer instance and appends it to the page.
     * @param path - The path of the page to show. Defaults to '/'.
     */
    protected showPage(path = '/'): void {
        this.appState.publish(`${path}:${StateKeys.contentReady}`);
        if (this.texts.FOOTER) {
           this.footer = new Footer(this.texts.FOOTER, this.appState);
           this.append(this.footer);
        }
    }
}