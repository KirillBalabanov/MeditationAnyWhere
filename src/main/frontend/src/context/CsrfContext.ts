import {createContext} from "react";
import {CsrfContextI} from "../types/types";

export const CsrfContext = createContext<CsrfContextI | null>(null);