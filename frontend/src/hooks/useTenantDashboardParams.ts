import { useSearchParams } from "react-router-dom"

const useTenantDashboardParams = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // maintenanec tab
    const status = searchParams.get('status') || 'ALL';
    const priority = searchParams.get('priority') || 'ALL';
    const maintenancePage = parseInt(searchParams.get('maintenancePage') || '1');
    const maintenanceSearch = searchParams.get('maintenanceSearch') || '';

    // payment tab
    const paymentType = searchParams.get('paymentType') || 'ALL';
    const paymentStatus = searchParams.get('paymentStatus') || 'ALL';
    const paymentPage = parseInt(searchParams.get('paymentPage') || '1');
    const paymentSearch = searchParams.get('paymentSearch') || '';

    // expense tab
    const expenseCategory = searchParams.get('expenseCategory') || 'ALL';
    const expenseIsRecurring = searchParams.get('expenseIsRecurring') === 'true';
    const expenseRecurrence = searchParams.get('expenseRecurrence') || 'ALL';
    const expensePage = parseInt(searchParams.get('expensePage') || '1');
    const expenseSearch = searchParams.get('expenseSearch') || '';

    // maintenance
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

    // payment
    const setPaymentType = (value: CondoPaymentType | "ALL") => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('paymentType', value);
        if(value !== "GCASH") newParams.set('paymentStatus', "ALL");
        setSearchParams(newParams);
    }

    const setPaymentStatus = (value: GcashPaymentStatus | "ALL") => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('paymentStatus', value);
        setSearchParams(newParams);
    }

    // expense
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
        setPage, setSearch, // general
        // maintenance
        status, priority, maintenancePage, maintenanceSearch,
        setStatus, setPriority,
        // payment
        paymentType, paymentStatus, paymentPage, paymentSearch,
        setPaymentType, setPaymentStatus,
        // expense
        expenseCategory, expenseIsRecurring, expenseRecurrence, expensePage, expenseSearch,
        setExpenseCategory, setExpenseIsRecurring, setExpenseRecurrence
    }
}

export default useTenantDashboardParams