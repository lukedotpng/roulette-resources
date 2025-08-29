import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function useLocalState<T>(
    key: string,
    initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState<T>(
        GetLocalStateValue(key, initialValue),
    );

    useEffect(() => {
        SetLocalStateValue(key, value);
    }, [key, value]);

    return [value, setValue];
}

function SetLocalStateValue<T>(key: string, value: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`FAILED TO SAVE "${key}"`);
        console.error(error);
    }
}

function GetLocalStateValue<T>(key: string, initialValue: T): T {
    let storedValue;
    try {
        storedValue = localStorage.getItem(key);
    } catch (error) {
        console.error(`FAILED TO LOAD "${key}"`);
        console.error(error);
        return initialValue;
    }

    if (storedValue === null) {
        SetLocalStateValue(key, initialValue);
        return initialValue;
    }

    const parsedValue = JSON.parse(storedValue) as T;
    return parsedValue;
}
