import { useEffect, useState } from "react";

export default function useFetch({ url, options }) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();

        async function fetchData() {
            try {
                setIsLoading(true);

                const response = await fetch(url, { ...options, signal: abortController.signal });
                const result = await response.json();

                setData(result);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();

        return () => { abortController.abort() };
    }, [url, options]);

    return { data, isLoading, error };
}