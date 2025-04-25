import ExpenseForm, { formSchema } from "@/components/form/ExpenseForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import useViewCondoParams from "@/hooks/useViewCondoParams";
import axiosFetch from "@/lib/axios";
import { ValidationError } from "@/lib/handleValidationError";
import { useQueryClient } from "@tanstack/react-query";
import { DollarSign } from "lucide-react";
import { useState } from "react"
import toast from "react-hot-toast";
import { z } from "zod";

type AddExpenseProps = {
    condoId: string,
}

const AddExpense = ({
    condoId
}: AddExpenseProps) => {
    const queryClient = useQueryClient();
    const { expensePage, expenseSearch, expenseCategory, expenseIsRecurring, expenseRecurrence } = useViewCondoParams();
    const [open, setOpen] = useState(false);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const response = await axiosFetch.post(`/expense?condoId=${condoId}`, data);
    
        if(response.status === 400) {
            throw new ValidationError(response);
        }

        if(response.status >= 401) {
            throw new Error(response.data.message);
        }

        toast.success('Expense has been added!')
        setOpen(false)
        // update query data here 
        await queryClient.setQueryData([
            'expenses', expensePage, expenseSearch, expenseCategory, 
            expenseIsRecurring, expenseRecurrence, condoId
        ], (oldData: getExpensesResponse) => {
            if(!oldData) return oldData;

            return {
                ...oldData,
                expenses: [response.data, ...oldData.expenses]
            }
        })

        return
    }
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Add Expense
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Add Expense</DialogTitle>
                    <DialogDescription>
                        Add a new expense record to the system. Please fill in the details below.
                    </DialogDescription>
                </DialogHeader>
                <ExpenseForm onsubmit={onSubmit} />
            </DialogContent>
        </Dialog>
    )
}

export default AddExpense