import type { Extender } from "@shared";
import { ILink } from "@shared/components/link/types";

export type ILinks = (ILink | { [K in Exclude<string, keyof ILink>]: ILinks })[];
export type MenuItem = Link | Extender<MenuItem>;