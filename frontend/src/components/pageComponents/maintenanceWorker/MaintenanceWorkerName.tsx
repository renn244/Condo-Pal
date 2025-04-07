import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axiosFetch from "@/lib/axios"
import { QueryObserverResult, RefetchOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Home, RotateCcw, TriangleAlert } from "lucide-react"
import { FormEvent, useState } from "react"
import toast from "react-hot-toast"
import { useSearchParams } from "react-router-dom"

type MaintenanceWorkerNameProps = {
    maintenanceId: string;
}

const MaintenanceWorkerName = ({
    maintenanceId
}: MaintenanceWorkerNameProps) => {
    const [workerName, setWorkerName] = useState<string>("");
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();

    const token = searchParams.get('token');

    const { mutate: updateWorkerName, isPending } = useMutation({
        mutationKey: ['updateWorkerName'],
        mutationFn: async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const response = await axiosFetch.patch(`/maintenance-worker-token/updateWorkerName?maintenanceId=${maintenanceId}&token=${token}`, {
                workerName
            })

            if(response.status >= 400) {
                throw new Error(response.data.message)
            }

            return response.data as maintenanceWorker;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['getWorkerName'], (oldData: maintenanceWorker): maintenanceWorker => {
                return {
                    ...oldData,
                    workerName: data.workerName
                }
            })
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const { data: maintenanceWorker, isLoading: maintenanceWorkerLoading, refetch, isFetching } = useQuery({
        queryKey: ['getWorkerName'],
        queryFn: async () => {
            const response = await axiosFetch.get(`/maintenance-worker-token/getWorker?maintenanceId=${maintenanceId}&token=${token}`);
            
            if(response.status === 404) {
                return null
            }
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // setting the workerName to sessionStorage
            if(response.data.workerName && !sessionStorage.getItem("workerName")) {
                sessionStorage.setItem("workerName", response.data.workerName)
                window.location.reload()
            }

            return response.data as maintenanceWorker;
        },
        refetchOnWindowFocus: false
    })

    if(maintenanceWorkerLoading) return null

    if(!maintenanceWorker) return <NotAuthenticated refetch={refetch} isFetching={isFetching} />
    
    return (
        !maintenanceWorker.workerName && (
            <Dialog open={true}>
                <DialogContent>
                    <form onSubmit={updateWorkerName}
                    className="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>
                                Update Worker Name (Required)
                            </DialogTitle>
                            <DialogDescription>
                                Please enter your name to identify yourself in the chat. you would only need to do this once.
                                and can't change it later, you may use company name.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-2">
                            <Label htmlFor="workerName">
                                Worker Name
                            </Label>
                            <Input placeholder="John Doe..." value={workerName} onChange={(e) => setWorkerName(e.target.value)} />
                        </div>
                        <Button disabled={!workerName && isPending} type="submit">
                            {isPending ? <LoadingSpinner /> : "Save Worker Name"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        )
    )
}

const NotAuthenticated = ({
    refetch,
    isFetching
}: { refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<maintenanceWorker | null, Error>>, isFetching: boolean }) => (
    <Dialog open={true}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="text-red-500">
                    You are not authenticated to this maintenance
                </DialogTitle>
                <DialogDescription>
                    You are not allowed to access and modify this maintenance. Please contact the support if something is wrong.
                </DialogDescription>
            </DialogHeader>
            <div className="w-full flex flex-col items-center justify-center py-3">
                <TriangleAlert className="h-14 w-14 text-red-500" />
                <h1 className="text-xl font-semibold text-red-500">
                    Not Authenticated
                </h1>
            </div>
            <div className="w-full flex justify-center items-center gap-8">
                <Button className="w-[150px]" onClick={() => history.back()}>
                    <Home className="h-4 w-4" />
                    Return
                </Button>
                <Button className="w-[150px]" onClick={() => refetch()}>
                    {isFetching ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <RotateCcw className="h-4 w-4" />
                            Refresh
                        </>
                    )}
                </Button>
            </div>
        </DialogContent>
    </Dialog>
)

export default MaintenanceWorkerName