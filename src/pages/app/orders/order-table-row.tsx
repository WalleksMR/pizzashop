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
import { approveOrder } from '@/api/approve-order';
import { deliverOrder } from '@/api/deliver-oder';
import { dispatchOrder } from '@/api/dispatch-order';

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

  const { mutateAsync: approveOrderFn, isPending: isApproveOrderPending } =
    useMutation({
      mutationFn: approveOrder,
      onSuccess: async (_, { orderId }) => {
        updateOrderStatusOnCache(orderId, 'processing');
      }
    });

  const { mutateAsync: dispatchOrderFn, isPending: isDispatchOrderPending } =
    useMutation({
      mutationFn: dispatchOrder,
      onSuccess: async (_, { orderId }) => {
        updateOrderStatusOnCache(orderId, 'delivering');
      }
    });

  const { mutateAsync: deliverOrderFn, isPending: isDeliverOrderPending } =
    useMutation({
      mutationFn: deliverOrder,
      onSuccess: async (_, { orderId }) => {
        updateOrderStatusOnCache(orderId, 'delivered');
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
        {order.status === 'pending' && (
          <Button
            disabled={isApproveOrderPending}
            onClick={() => approveOrderFn({ orderId: order.orderId })}
            variant='outline'
            size='xs'
          >
            <ArrowRight className='mr-2 h-3 w-3' />
            Aprovar
          </Button>
        )}

        {order.status === 'processing' && (
          <Button
            disabled={isDispatchOrderPending}
            onClick={() => dispatchOrderFn({ orderId: order.orderId })}
            variant='outline'
            size='xs'
          >
            <ArrowRight className='mr-2 h-3 w-3' />
            Em entrega
          </Button>
        )}

        {order.status === 'delivering' && (
          <Button
            disabled={isDeliverOrderPending}
            onClick={() => deliverOrderFn({ orderId: order.orderId })}
            variant='outline'
            size='xs'
          >
            <ArrowRight className='mr-2 h-3 w-3' />
            Entregue
          </Button>
        )}
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
