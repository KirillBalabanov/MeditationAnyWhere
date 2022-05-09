import {createContext} from "react";
import {AuthContextI} from "../types/types";

export const AuthContext = createContext<AuthContextI | null>(null);