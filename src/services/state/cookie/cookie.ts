export class Cookie {
    /**
     * Sets a cookie on the client-side.
     *
     * @param name The name of the cookie.
     * @param value The value to set for the cookie.
     * @param options Options for setting the cookie. See the MDN documentation for more information:
     *     https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie#Syntax
     */
    public set(name: string, value: any, days = 7): void {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
    }

    /**
     * Retrieves the value of a cookie from the client-side.
     *
     * @param name The name of the cookie to retrieve.
     */
    public get(name: string): string | null {
        return document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))?.split('=')[1] || null;
    }

    /**
     * Removes a cookie from the client-side.
     *
     * @param name The name of the cookie to remove.
     */
    public remove(name: string): void {
        this.set(name, '', -1);
    }

    /**
     * Returns a Map of all cookies set on the document.
     *
     * This method iterates over each cookie string and extracts the key-value pairs,
     * storing them in a new Map. The keys are the cookie names, and the values are the
     * corresponding cookie values.
     *
     * @returns {Map<string, string>} A Map of all cookies set on the document.
     */
    public getAll(): Map<string, string> {
        return document.cookie.split('; ').reduce((cookies, item) => {
            /**
             * Extracts a key-value pair from a single cookie string.
             *
             * This function splits the cookie string into two parts using the '=' character
             * as the separator. The first part is the key (the cookie name), and the second
             * part is the value (the cookie value).
             *
             * @param {string} item - A single cookie string.
             * @returns {Map<string, string>} An array containing the key-value pair.
             */
            const [key, value] = item.split('=');
            return cookies.set(key, decodeURIComponent(value));
        }, new Map<string, string>());
    }
}
