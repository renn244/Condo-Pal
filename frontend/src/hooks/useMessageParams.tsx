import { useSearchParams } from "react-router-dom"

const useMessageParams = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const leaseAgreementId = searchParams.get("leaseAgreementId") || "";
    
    const setLeaseAgreementId = (id: string) => {
        const newParams = new URLSearchParams(searchParams); 
        newParams.set("leaseAgreementId", id);
        setSearchParams(newParams);
    }

    return { leaseAgreementId, setLeaseAgreementId }
}

export default useMessageParams