declare namespace Inventory {
    type searchOption = {
        reset: boolean = true;
        page: number;
        pageSize: number;
        warehouseSearchType: string;
    };

    type composite = {
        sku: string;
        irvine: number;
        santaAna: number;
        compositeProductName: string;
        compositeProductNameZH: string;
        us: number;
        status: string;
    };
}
