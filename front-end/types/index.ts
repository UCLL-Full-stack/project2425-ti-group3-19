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

export type Subscription = {
  id: number;
  startDate: Date;
  endDate: Date;
  subtype: string;
  region: string;
  orderId: string;
}

export type Ticket = {
  id: number;
  date: Date;
  price: number;
  startStation: string;
  desStation: string;
  orderId: string;
}

export type Beurtenkaart = {
  id: number;
  beurten: number;
  price: number;
  valid: boolean;
  startDate: Date;
  endDate: Date;
  orderId: string;
}

export type PromoCodeResponse = {
  discount: number;
  message?: string;
}