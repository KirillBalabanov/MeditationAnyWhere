import {createContext} from "react";
import {HeaderReloadContextI} from "../types/types";

export const HeaderReloadContext = createContext<HeaderReloadContextI | null>(null);