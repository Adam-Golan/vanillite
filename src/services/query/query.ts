export class Query {
    private readonly queryParams: Map<string, string> = new Map();

    constructor() {
        if (typeof location === 'undefined')
            throw new Error('Query class must be used in a browser environment.');
        else
            this.extractQueryParams();
    }

    private extractQueryParams(): void {
        const urlObj = new URL(location.href);
        for (const [key, value] of urlObj.searchParams) this.queryParams.set(key, value);
        urlObj.search = '';
        history.replaceState(null, '', urlObj.toString());
    }

    public clearParams(): void {
        this.queryParams.clear();
    }

    public getParam(key: string): string | undefined {
        return this.queryParams.get(key);
    }

    public setParam(key: string, value: string): void {
        this.queryParams.set(key, value);
    }

    public deleteParam(key: string): void {
        this.queryParams.delete(key);
    }
}
