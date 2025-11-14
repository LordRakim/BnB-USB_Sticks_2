
export interface CustomerInfo {
  name: string;
  email: string;
  address: string;
  phone: string;
}

export interface OrderDetails extends CustomerInfo {
  quantity: number;
  totalPrice: number;
}
