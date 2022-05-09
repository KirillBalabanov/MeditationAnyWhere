import {useEffect, useState} from "react";
import {ErrorI} from "../types/types";

export const useFetching = (fetchRequest: string, setData: (obj: any) => void, setIsLoading: (loading: boolean) => void) => {
    let [errorMsg, setErrorMsg] = useState("");
    let [fetched, setFetched] = useState(true);
    useEffect(() => {
        fetch(fetchRequest).then((response) => response.json()).then((data: any | ErrorI) => {
            if("error" in data) {
                setFetched(false);
                setErrorMsg(data["error"]);
            }
            else {
                setData(data);
            }
            setIsLoading(false);
        });
    }, []);
    return [fetched, errorMsg];
};