declare namespace Inventory {
    type searchOption = {
        reset: boolean = true;
        page: number;
        pageSize: number;
        warehouseSearchType: string;
        search: string;
        stockStatus: string[];
        listType: 1 | 2;
    };

    type composite = {
        sku: string;
        irvine: number;
        santaAna: number;
        us: number;
        factory: number;
        inventory: number;
        transit: number;
        compositeProductName: string;
        compositeProductNameZH: string;
        status: string;
        description: string;
        widthZH: number;
        lengthZH: number;
        heightZH: number;
        width: number;
        length: number;
        height: number;
        weight: number;
        weightZH: number;
        perPallet: number;
        palletStatus: string;
        categoryZH: string;
        inventoryNote: string;
    };
}
