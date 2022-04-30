import {useEffect, useState} from "react";

export const useFetching = (fetchRequest: string, setData: (obj: any) => void, setIsLoading: (loading: boolean) => void) => {
    let [errorMsg, setErrorMsg] = useState("s");
    let [fetched, setFetched] = useState(true);
    useEffect(() => {
        fetch(fetchRequest).then((response) => response.json()).then((data) => {
            if("error" in data) {
                setFetched(false);
                setErrorMsg(data["error"]);
            }
            else {
                console.log(data);
                setData(data);
            }
            setIsLoading(false);
        });
    }, []);
    return [fetched, errorMsg];
};