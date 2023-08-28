export interface Pagination{
    currentPage:number;
    itemperPage:number;
    totalItems:number
    totalPages: number;
}

export class PaginationResult<T>{
    data : T;
    pagination : Pagination;
    constructor( data : T,pagination :Pagination) {
        this.data=data;
        this.pagination = pagination;
        
        
    }
    
}
export class PagingParams{
        pageNumber = 1;
        pageSize = 2;
}