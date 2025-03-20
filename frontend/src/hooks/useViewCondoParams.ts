import { useSearchParams } from 'react-router-dom'

const useViewCondoParams = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const paymentPage = parseInt(searchParams.get('paymentPage') || '1');
    const maintenancePage = parseInt(searchParams.get('paymentPage') || '1');
    const expensePage = parseInt(searchParams.get('paymentPage') || '1');

    const setPage = (type: 'maintenance' | 'payment' | 'expense', value: number) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set(`${type}Page`, value.toString());
        setSearchParams(newParams);
    }

    return { 
        paymentPage, maintenancePage, expensePage, setPage, 

    }
}

export default useViewCondoParams