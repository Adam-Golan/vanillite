export class Storage {
    private storageTypes = ['localStorage', 'sessionStorage', 'indexedDB'] as const;

    constructor(private db: string = 'DB', private store: string = 'general') { }

    /**
     * Sets the value associated with the given key in the specified storage type.
     *
     * @param key The key of the item to set.
     * @param value The value to set.
     * @param storageType The type of storage to set the item in. Defaults to 'localStorage'.
     * @throws {Error} If the storage type is invalid.
     */
    public async setItem(key: string, value: any, storageType: Storage['storageTypes'][number] = 'localStorage') {
        this.checkType(storageType);
        switch (storageType) {
            case 'localStorage':
            case 'sessionStorage':
                window[storageType].setItem(key, JSON.stringify(value));
                break;
            case 'indexedDB':
                const [store, tx] = await this.getStore();
                store.put(value, key);
                await tx;
                break;
            default:
                throw new Error(`Failed to set item: ${key}`);
        }
    }

    /**
     * Retrieves the value associated with the given key from the specified storage type.
     *
     * @param key The key of the item to retrieve.
     * @param storageType The type of storage to retrieve the item from.
     * @throws {Error} If the storage type is invalid.
     * @returns The value associated with the given key, or `null` if the key does not exist in the storage type.
     */
    public async getItem(key: string, storageType: Storage['storageTypes'][number] = 'localStorage') {
        this.checkType(storageType);
        let result: any;
        switch (storageType) {
            case 'localStorage':
            case 'sessionStorage':
                result = window[storageType].getItem(key);
                return result ?? JSON.parse(result);
            case 'indexedDB':
                const [store] = await this.getStore();
                const request: IDBRequest = store.get(key);
                result = await new Promise((res) => {
                    request.onsuccess = () => res(request.result);
                    request.onerror = () => res(null);
                });
                return result;
            default:
                throw new Error(`Failed to get item: ${key}`);
        }
    }

    /**
     * Removes the item with the given key from the specified storage type.
     *
     * @param key The key of the item to remove.
     * @param storageType The type of storage to remove the item from.
     * @throws {Error} If the storage type is invalid.
     */
    public async removeItem(key: string, storageType: Storage['storageTypes'][number] = 'localStorage') {
        this.checkType(storageType);
        switch (storageType) {
            case 'localStorage':
            case 'sessionStorage':
                window[storageType].removeItem(key);
                break;
            case 'indexedDB':
                const [store, tx] = await this.getStore();
                store.delete(key);
                await tx;
                break;
            default:
                throw new Error(`Failed to remove item: ${key}`);
        }
    }

    /**
     * Checks if the given storage type is valid.
     * @param storageType The storage type to check.
     * @throws {Error} If the storage type is invalid.
     * @private
     */
    private checkType(storageType: Storage['storageTypes'][number]) {
        if (!this.storageTypes.includes(storageType)) throw new Error(`Invalid storage type: ${storageType}`);
    }

    /**
     * Opens the IndexedDB database and returns the object store and transaction.
     * @returns A tuple containing the object store and transaction.
     * @private
     */
    private async getStore(): Promise<[IDBObjectStore, IDBTransaction]> {
        const db: IDBDatabase = await this.openDB(this.db, 1);
        const tx: IDBTransaction = db.transaction(this.store, 'readwrite');
        const store: IDBObjectStore = tx.objectStore(this.store);
        return [store, tx];
    }

    /**
     * Opens the IndexedDB database with the given name and version.
     * @param name The name of the database.
     * @param version The version of the database. If not provided, the latest version is used.
     * @returns A Promise that resolves with the opened database.
     * @private
     */
    private async openDB(name: string, version?: number): Promise<IDBDatabase> {
        return new Promise((res, rej) => {
            const request = indexedDB.open(name, version);
            request.onsuccess = () => res(request.result);
            request.onerror = () => rej(request.error);
        });
    }
}