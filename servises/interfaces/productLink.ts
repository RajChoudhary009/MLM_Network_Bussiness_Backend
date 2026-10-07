export interface ProductLinkAttributes {
    id: number;
    product_id: number;
    main_category: string | null;
    price: number;
    link: string;
    image: string;
}

export interface ProductLinkCreationAttributes {
    product_id: number;
    main_category?: string | null;
    price: number;
    link: string;
    image: string;
}