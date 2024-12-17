import { CookieOptions } from "./types";

export class Cookie {
    /**
     * Sets a cookie on the client-side.
     *
     * @param name The name of the cookie.
     * @param value The value to set for the cookie.
     * @param options Options for setting the cookie. See the MDN documentation for more information:
     *     https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie#Syntax
     */
    public async set(name: string, value: any, options?: CookieOptions) {
        const expiry = this._expiry(options);
        document.cookie = `${name}=${value}; ${this._cookieString(expiry)}`;
    }

    /**
     * Retrieves the value of a cookie from the client-side.
     *
     * @param name The name of the cookie to retrieve.
     */
    public async get(name: string): Promise<string | null> {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            if (cookie.startsWith(`${name}=`)) {
                return cookie.split('=')[1];
            }
        }
        return null;
    }

    /**
     * Removes a cookie from the client-side.
     *
     * @param name The name of the cookie to remove.
     */
    public async remove(name: string) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }

    /**
     * Calculates the expiry date for a cookie based on the provided options.
     *
     * @param options Options for setting the cookie. See the MDN documentation for more information:
     *     https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie#Syntax
     */
    private _expiry(options?: CookieOptions): string {
        if (!options || !options.expires) return '';
        const expires = new Date(options.expires);
        return `expires=${expires.toUTCString()}`;
    }

    /**
     * Returns a string representing the cookie settings based on the provided options.
     *
     * @param expiry The expiry date for the cookie.
     */
    private _cookieString(expiry: string): string {
        return `${this._getDomain()}; ${expiry}; max-age=${this._maxAge()}; path=${this._getPath()}`;
    }

    /**
     * Returns a string representing the domain for the cookie.
     *
     * @returns A string representing the domain for the cookie.
     */
    private _getDomain(): string {
        return 'domain=example.com'; // Replace with your domain
    }

    /**
     * Calculates the maximum age for a cookie based on the provided options.
     *
     * @param options Options for setting the cookie. See the MDN documentation for more information:
     *     https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie#Syntax
     */
    private _maxAge(options?: CookieOptions): number {
        if (!options || !options.maxAge) return 0;
        return options.maxAge;
    }

    /**
     * Returns a string representing the path for the cookie.
     *
     * @returns A string representing the path for the cookie.
     */
    private _getPath(): string {
        return '/'; // Replace with your path
    }
}
