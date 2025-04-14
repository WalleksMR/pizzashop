import { ArrowRight, Search, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { TableCell, TableRow } from '@/components/ui/table';

import { OrderDetails } from './order-details';
import { OrderStatus } from '@/components/order-status';

import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelOrder } from '@/api/cancel-order';
import { GerOrdersResponse } from '@/api/get-orders';

export interface OrderTableRowProps {
  order: {
    orderId: string;
    createdAt: string;
    status: 'pending' | 'canceled' | 'processing' | 'delivering' | 'delivered';
    customerName: string;
    total: number;
  };
}
export function OrderTableRow({ order }: OrderTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const queryClient = useQueryClient();
  function updateOrderStatusOnCache(orderId: string, status: OrderStatus) {
    const orderListCache = queryClient.getQueriesData<GerOrdersResponse>({
      queryKey: ['orders']
    });

    orderListCache.forEach(([cacheKey, cacheData]) => {
      if (!cacheData) {
        return;
      }
      queryClient.setQueryData<GerOrdersResponse>(cacheKey, {
        ...cacheData,
        orders: cacheData.orders.map(order => {
          if (order.orderId === orderId) {
            return {
              ...order,
              status
            };
          }
          return order;
        })
      });
    });
  }
  const { mutateAsync: cancelOrderFn, isPending: isCancelOrderPending } =
    useMutation({
      mutationFn: cancelOrder,
      onSuccess: async (_, { orderId }) => {
        updateOrderStatusOnCache(orderId, 'canceled');
      }
    });

  return (
    <TableRow>
      <TableCell>
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogTrigger asChild>
            <Button variant='outline' size='xs'>
              <Search className='h-3 w-3' />
              <span className='sr-only'>Detalhes do pedido</span>
            </Button>
          </DialogTrigger>
          <OrderDetails orderId={order.orderId} isOpen={isDetailsOpen} />
        </Dialog>
      </TableCell>
      <TableCell className='font-mono text-xs font-medium'>
        {order.orderId}
      </TableCell>
      <TableCell className='text-muted-foreground'>
        {formatDistanceToNow(order.createdAt, {
          locale: ptBR,
          addSuffix: true
        })}
      </TableCell>
      <TableCell>
        <OrderStatus status={order.status} />
      </TableCell>
      <TableCell className='font-medium'>{order.customerName}</TableCell>
      <TableCell className='font-medium'>
        {(order.total / 100).toLocaleString('pt-br', {
          style: 'currency',
          currency: 'BRL'
        })}
      </TableCell>
      <TableCell>
        <Button
          disabled={order.status !== 'pending'}
          variant='outline'
          size='xs'
        >
          <ArrowRight className='mr-2 h-3 w-3' />
          Aprovar
        </Button>
      </TableCell>
      <TableCell>
        <Button
          onClick={() => cancelOrderFn({ orderId: order.orderId })}
          disabled={
            !['pending', 'processing'].includes(order.status) ||
            isCancelOrderPending
          }
          variant='ghost'
          size='xs'
        >
          <X className='mr-2 h-3 w-3' />
          Cancelar
        </Button>
      </TableCell>
    </TableRow>
  );
}
