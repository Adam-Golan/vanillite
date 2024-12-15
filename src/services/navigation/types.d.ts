export type IPage = (new (texts: any, appState: State) => Page<any>) & ({ getPages?: () => IPages; });
export type IPages = Map<string, IPage>;