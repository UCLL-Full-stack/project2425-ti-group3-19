export type User = {
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    role?: string;
    createdAt?: Date;
    updatedAt?: Date;
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
    user: User;
}

export type PromoCodeResponse = {
    discount: number;
    message?: string;
}

export type Role = 'admin' | 'user' | 'moderator';