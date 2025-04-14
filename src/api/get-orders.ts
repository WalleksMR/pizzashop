import { api } from '@/lib/axios';

export interface GetOrderQuery {
  pageIndex?: number | null;
  orderId?: string | null;
  customerName?: string | null;
  status?: string | null;
}

export interface GerOrdersResponse {
  orders: {
    orderId: string;
    createdAt: string;
    status: 'pending' | 'canceled' | 'processing' | 'delivering' | 'delivered';
    customerName: string;
    total: number;
  }[];
  meta: {
    pageIndex: number;
    perPage: number;
    totalCount: number;
  };
}

export async function getOrders({
  pageIndex,
  orderId,
  customerName,
  status
}: GetOrderQuery) {
  const response = await api.get<GerOrdersResponse>('/orders', {
    params: {
      pageIndex,
      orderId,
      customerName,
      status
    }
  });

  return response.data;
}
