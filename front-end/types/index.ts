export type User = {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    role?: string;
  };
  
  export type Order = {
    id: number;
    product: string;
    orderDate: string;
    price: number;
    region?: string;
    beginStation?: string;
    endStation?: string;
    subscriptionLength?: string;
    orderReferentie: string;
}

export type PromoCodeResponse = {
    discount: number;
    message?: string;
}