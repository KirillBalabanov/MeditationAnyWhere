import React, {SetStateAction, useEffect} from "react";
import {ErrorFetchI} from "../types/serverTypes";


export const useFetching = <T>(fetchRequest: string, setIsLoading: (loading: boolean) => void, setData: React.Dispatch<SetStateAction<T | null>>) => {
    useEffect(() => {
        fetchReq(fetchRequest, setIsLoading, setData);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
};

export const useFetchingOnCondition = <T>(fetchRequest: string, setIsLoading: (loading: boolean) => void, setData: React.Dispatch<SetStateAction<T | null>>, condition: boolean) => {
    useEffect(() => {
        if (condition) {
            fetchReq(fetchRequest, setIsLoading, setData)
        } else {
            setIsLoading(false);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

function fetchReq<T>(fetchRequest: string, setIsLoading: (loading: boolean) => void, setData: React.Dispatch<SetStateAction<T | null>>) {
    fetch(fetchRequest).then((response) => response.json()).then((data: any | ErrorFetchI) => {
        if ("error" in data) {
            setData(data);
        } else {
            setData(data);
        }
    }).catch(() => setData(null)).then(() => setIsLoading(false));
}