export class Query {
    private readonly queryParams: Map<string, string> = new Map();

    /**
     * Initializes a new instance of the Query class.
     * Throws an error if the environment is not a browser.
     * Extracts query parameters from the current URL and stores them.
     */
    constructor() {
        if (typeof location === 'undefined')
            throw new Error('Query class must be used in a browser environment.');
        else
            this.extractQueryParams();
    }

    /**
     * Extracts query parameters from the current URL and stores them in the query parameters map.
     * This function is called in the constructor and should not be called manually.
     * @private
     */
    private extractQueryParams(): void {
        const urlObj = new URL(location.href);
        for (const [key, value] of urlObj.searchParams) this.queryParams.set(key, value);
        urlObj.search = '';
        history.replaceState(null, '', urlObj.toString());
    }

    /**
     * Clears all query parameters from the map.
     * @returns void
     */
    public clearParams(): void {
        this.queryParams.clear();
    }

    /**
     * Retrieves the value associated with the given key from the query parameters map.
     * @param key The key of the query parameter to retrieve.
     * @returns The value associated with the given key, or undefined if the key does not exist in the query parameters map.
     */
    public getParam(key: string): string | undefined {
        return this.queryParams.get(key);
    }

    /**
     * Sets a query parameter with the specified key and value.
     *
     * @param key The key of the query parameter to set.
     * @param value The value of the query parameter to set.
     */
    public setParam(key: string, value: string): void {
        this.queryParams.set(key, value);
    }

    /**
     * Deletes a query parameter with the specified key from the query parameters map.
     *
     * @param key The key of the query parameter to delete.
     */
    public deleteParam(key: string): void {
        this.queryParams.delete(key);
    }
}
