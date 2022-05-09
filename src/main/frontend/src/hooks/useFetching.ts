import {useEffect} from "react";
import {ErrorI} from "../types/types";


export const useFetching = <T>(fetchRequest: string, setIsLoading: (loading: boolean) => void, setData: (el: T) => void) => {
    useEffect(() => {
        fetchReq(fetchRequest, setIsLoading, setData);
        setIsLoading(false);
    }, []);
};

export const useFetchingOnCondition = <T>(fetchRequest: string, setIsLoading: (loading: boolean) => void, setData: (el: T) => void, condition: boolean) => {
    useEffect(() => {
        if (condition) {
            fetchReq(fetchRequest, setIsLoading, setData)
        }
        setIsLoading(false);
    }, []);
}

function fetchReq<T>(fetchRequest: string, setIsLoading: (loading: boolean) => void, setData: (el: T) => void) {
    fetch(fetchRequest).then((response) => response.json()).then((data: any | ErrorI) => {
        if("error" in data) {
            setData(data);
        }
        else {
            setData(data);
        }
    });
}