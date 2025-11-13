export interface Order {
    id: number;
    type: string;
    status: 'pending' | 'accepted' | 'delivered' | 'cancelled' | 'accepted';
    is_paid: number;
    total_amount: number;
    comment: string | null;
    delivery_address_id: number | null;
    cac_address_id: number | null;
    customer_id: number;
    store_id: number;
    created_at: string;
    updated_at: string;
    stripe_payment_intent: string | null;
    order_by: string;
    planified: number;
    planified_at: string | null;
    at_place: number;
    payment_at_checkout: number;
    table_id: number | null;
    fees: number;
    promocode_id: number | null;
    isRefund: number;
    isRead: number;
    borne_cust_name: string | null;
    printed: number;
    customer_store_id: number | null;
    elements_order: OrderElement[];
    customer?: Customer; // You might need to add this if it's in the response
  }

  export interface OrderElement {
    id: number;
    price: number;
    quantity: number;
    total_amount_element: number;
    comment: string | null;
    order_id: number;
    product_id: number;
    created_at: string;
    updated_at: string;
    promo_id: number | null;
    total_amount_element_subelements: number;
    promo: any | null;
    product: Product;
    sub_elements_order?: SubElementOrder[]; // Sub elements with products
  }

  export interface SubElementOrder {
    id: number;
    price: number;
    quantity: number;
    total_amount_sub_element: number;
    element_order_id: number;
    sub_product_id: number;
    created_at: string;
    updated_at: string;
    type: string;
    sub_product: SubProduct;
  }

  export interface SubProduct {
    id: number;
    name: string;
    price: number;
    store_id: number;
    group_id: number;
    created_at: string;
    updated_at: string;
    max: number;
    default: number;
    ingredient_id: number | null;
    supplement_id: number;
    order: number | null;
    is_customizable_price: number;
    ingredient: any | null;
    supplement: Supplement | null;
  }

  export interface Supplement {
    id: number;
    name: string;
    max: number;
    price: number;
    default: number;
    is_enabled: number;
    store_id: number;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    bank_image_id: number;
  }

  export interface Product {
    id: number;
    name: string;
    description: string;
    path_image: string | null;
    thumbnail_image: string | null;
    price: number;
    LIV: number;
    CAC: number;
    store_id: number;
    category_id: number;
    created_at: string;
    updated_at: string;
    is_enabled: number;
    AT_PLACE: number;
    order: number | null;
    slug: string;
    bank_image_id: number | null;
    preparation_time_liv: number | null;
    preparation_time_cac: number | null;
    is_promo: number;
    category: Category;
    promos: any[];
  }

  export interface Category {
    id: number;
    name: string;
    store_id: number;
    created_at: string;
    updated_at: string;
    logo: string | null;
    description: string;
    bank_image_id: number | null;
    order: number | null;
  }

  
  export interface Customer {
    id: number;
    name: string;
    email: string;
    // Add other customer properties as needed
  }

  export interface OrdersResponse {
    message: string;
    data: {
      current_page: number;
      data: Order[];
      first_page_url: string;
      from: number;
      last_page: number;
      last_page_url: string;
      links: Array<{
        url: string | null;
        label: string;
        active: boolean;
      }>;
      next_page_url: string | null;
      path: string;
      per_page: number;
      prev_page_url: string | null;
      to: number;
      total: number;
    };
  }

  export interface ActiveOrdersByType {
    CAC: Order[];
    LIV: Order[];
    AT_PLACE: Order[];
    emporter: Order[];
  }

  export interface ActiveOrdersResponse {
    message: string;
    data: {
      pending?: ActiveOrdersByType;
      accepted?: ActiveOrdersByType;
      accepted?: ActiveOrdersByType;
      delivered?: ActiveOrdersByType;
      cancelled?: ActiveOrdersByType;
    };
  }

  export interface OrderFilters {
    status?: string;
    type?: string;
    orderBy?: string;
    page?: number;
    // Filter by whether order is planified (1 = planified, 0 = not planified)
    // Used in historic orders to filter orders that have a scheduled delivery time
    planified?: number | string;
  }
