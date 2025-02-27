import { useSearchParams } from "react-router-dom"

const useCondoParams = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';

    const setSearch = (value: string) => {
        const newParams = new URLSearchParams(searchParams); // Clone existing params
        newParams.set('search', value);
        setSearchParams(newParams)
    }

    const setPage = (value: number) => {
        const newParams = new URLSearchParams(searchParams); // Clone existing params
        newParams.set('page', value.toString());
        setSearchParams(newParams)
    }

    return {
        page, search, setSearch, setPage
    }
}

export default useCondoParams