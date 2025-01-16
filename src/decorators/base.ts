export abstract class Basis<IConfig> extends HTMLElement {

    /**
     * Construct a new `Basis` instance.
     *
     * @param config The configuration object for this component.
     *
     * The `init` method is called automatically after a short delay to allow the
     * component to be fully initialized before the `init` method is called.
     */
    constructor(protected config: IConfig) {
        super();
        setTimeout(this.init.bind(this));
    }

    protected abstract init(): void;

    /**
     * Create an element with a given tag name.
     * @param tag The tag name of the element to create, e.g. "div", "span", etc.
     * @returns The created element.
     */
    protected cElem = document.createElement.bind(document);

    /**
     * Get an element by its id.
     * @param id The id of the element to retrieve.
     * @returns The element with the given id, or null if it doesn't exist.
     */
    protected idElem = <K extends keyof HTMLElementTagNameMap>(id: string): HTMLElementTagNameMap[K] | null => this.querySelector(`#${id}`);

    /**
     * Get elements by their "name" attribute.
     * @param name The value of the "name" attribute to search for.
     * @returns A list of elements with a "name" attribute equal to the given value.
     */
    protected nmElem = (name: string): NodeListOf<HTMLElement> => this.querySelectorAll(`[name="${name}"]`);

    /**
     * Get elements by their "class" attribute.
     * @param className The value of the "class" attribute to search for.
     * @returns A list of elements with a "class" attribute equal to the given value.
     */
    protected clsElem = this.getElementsByClassName;

    /**
     * Get elements by their tag name.
     * @param tag The tag name of the elements to retrieve, e.g. "div", "span", etc.
     * @returns A collection of elements with the specified tag name.
     */
    protected tagElem = this.getElementsByTagName;


    /**
     * Updates an element property with a given value.
     * If the 3rd parameter is provided, it sets an attribute on the element with the given name and value.
     * If the 3rd parameter is not provided, it sets the innerHTML of the element to the given value.
     * @param child The name of the element property to update.
     * @param value The value to update the element property with.
     * @param attr The name of the attribute to set on the element (optional).
     */
    protected uElem(child: keyof this, value: any, attr?: string): void {
        if (this[child] instanceof HTMLElement) attr ? this[child].setAttribute(attr, value) : this[child].innerHTML = `${value}`;
    }

    /**
     * Creates multiple HTML elements based on a given list of specifications.
     * Each specification includes a tag name and an optional class name.
     * @param list - An array of objects, each containing:
     *   - `tag`: The tag name of the element to create (e.g., "div", "span").
     *   - `cls` (optional): A class name to assign to the created element.
     * @returns An array of created HTML elements.
     */
    protected cAlot(list: { tag: keyof HTMLElementTagNameMap, cls?: string }[]): HTMLElement[] {
        return list.map(({ tag, cls }) => {
            const el = this.cElem(tag);
            if (cls) el.className = cls;
            return el;
        });
    }
}
