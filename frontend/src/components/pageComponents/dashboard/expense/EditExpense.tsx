import ExpenseForm, { formSchema } from "@/components/form/ExpenseForm"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import useViewCondoParams from "@/hooks/useViewCondoParams"
import axiosFetch from "@/lib/axios"
import { ValidationError } from "@/lib/handleValidationError"
import { useQueryClient } from "@tanstack/react-query"
import { Pencil } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { z } from "zod"

type EditExpenseProps = {
    condoId: string,
    initialExpense: expense,
}

const EditExpense = ({
    condoId,
    initialExpense
}: EditExpenseProps) => {
    const { expensePage, expenseSearch, expenseCategory, expenseIsRecurring, expenseRecurrence } = useViewCondoParams();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const response = await axiosFetch.patch(`/expense?condoId=${condoId}&expenseId=${initialExpense.id}`, data)

        if(response.status === 400) {
            throw new ValidationError(response);
        }

        if(response.status >= 401) {
            throw new Error(response.data.message);
        }

        toast.success('Expense has been updated!')
        setOpen(false)
        // update query data here 
        await queryClient.setQueryData([
            'expenses', expensePage, expenseSearch, expenseCategory, 
            expenseIsRecurring, expenseRecurrence, condoId
        ], (oldData: getExpensesResponse) => {
            if(!oldData) return oldData;

            return {
                ...oldData,
                expenses: oldData.expenses.map((expense) => {
                    if(expense.id === initialExpense.id) {
                        return response.data
                    }

                    return expense
                })
            }
        })

        return
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="ghost" className="w-full justify-baseline">
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Expense
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Expense</DialogTitle>
                    <DialogDescription>
                        Edit the details of the expense record. Feel free change the details below.
                    </DialogDescription>
                </DialogHeader>
                <ExpenseForm isUpdate initialData={initialExpense} onsubmit={onSubmit} />
            </DialogContent>
        </Dialog>
    )
}

export default EditExpense