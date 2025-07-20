import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { setFilterBy } from "../store/homes/homes.action"
import { homeService } from "../services/home.service"
import { getExistingProperties } from "../services/util.service"


export function useFilterSearchParams() {
    
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        setFilterBy(homeService.getFilterFromSearchParams(searchParams))
    }, [])

    function setExistFilterSearchParams(filterBy) {
        setSearchParams(getExistingProperties(filterBy))
    }

    return setExistFilterSearchParams

}