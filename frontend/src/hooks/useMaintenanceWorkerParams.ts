import { useSearchParams } from "react-router-dom";

const useMaintenanceWorkerParams = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    return { token }
}

export default useMaintenanceWorkerParams