import { useSearchParams } from 'react-router-dom'

const useViewCondoParams = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const paymentPage = parseInt(searchParams.get('paymentPage') || '1');
    const maintenancePage = parseInt(searchParams.get('paymentPage') || '1');
    const expensePage = parseInt(searchParams.get('paymentPage') || '1');
    // Maintenane Filters
    const status = searchParams.get('status') || 'ALL';
    const priority = searchParams.get('priority') || 'ALL';
    const maintenanceSearch = searchParams.get('maintenanceSearch') || '';

    // Expense Filters
    const expenseCategory = searchParams.get('expenseCategory') || 'ALL';
    const expenseRecurrence = searchParams.get('expenseRecurrence') || 'ALL';
    const expenseIsRecurring = searchParams.get('expenseIsRecurring') === 'true';
    const expenseSearch = searchParams.get('expenseSearch') || '';

    // Maintenance Filter Functions
    const setStatus = (value: MaintenanceStatus | "ALL" ) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('status', value);
        setSearchParams(newParams);
    }

    const setPriority = (value: PriorityLevel | "ALL") => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('priority', value);
        setSearchParams(newParams);
    }

    // Expense Filter Functions
    const setExpenseCategory = (value: ExpenseCategory | "ALL") => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('expenseCategory', value);
        setSearchParams(newParams);
    }

    const setExpenseIsRecurring = (value: boolean) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('expenseIsRecurring', value.toString());
        if(value === false) newParams.delete('expenseRecurrence');
        setSearchParams(newParams);
    }
    
    const setExpenseRecurrence = (value: Recurrence | "ALL") => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('expenseRecurrence', value);
        setSearchParams(newParams);
    }
    
    // general
    const setPage = (type: 'maintenance' | 'payment' | 'expense', value: number) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set(`${type}Page`, value.toString());
        setSearchParams(newParams);
    }

    const setSearch = (type: 'maintenance' | 'payment' | 'expense', value: string) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set(`${type}Search`, value);
        setSearchParams(newParams);
    }

    return { 
        paymentPage, maintenancePage, expensePage, 
        // geneneral
        setPage, setSearch,
        // maintenance
        status, priority, maintenanceSearch,
        setStatus, setPriority,
        // expense
        expenseCategory, expenseRecurrence, expenseIsRecurring, expenseSearch,
        setExpenseCategory, setExpenseRecurrence, setExpenseIsRecurring
    }
}

export default useViewCondoParams