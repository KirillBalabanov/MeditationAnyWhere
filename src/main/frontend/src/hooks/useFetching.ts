import {useEffect} from "react";
import {ErrorI} from "../types/types";


export const useFetching = <T>(fetchRequest: string, setIsLoading: (loading: boolean) => void, setData: (el: T) => void) => {
    let fetched = true;
    useEffect(() => {
        fetch(fetchRequest).then((response) => response.json()).then((data: any | ErrorI) => {
            if("error" in data) {
                fetched = false;
                setData(data);
            }
            else {
                setData(data);
            }
            setIsLoading(false);
        });
    }, []);
    return fetched;
};