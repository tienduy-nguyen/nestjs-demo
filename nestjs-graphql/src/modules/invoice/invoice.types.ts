export enum Currency {
  NGN = 'NGN',
  USD = 'USD',
  GBP = 'GBP',
  EUR = ' EUR',
}
export enum PaymentStatus {
  PAID = 'PAID',
  NOT_PAID = 'NOT_PAID',
}

export interface IItem {
  description: string;
  rate: number;
  quantity: number;
}
