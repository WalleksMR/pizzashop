import { getOrderDetails } from '@/api/get-order-details';
import { OrderStatus } from '@/components/order-status';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { OrderDetailsSkeleton } from './order-details-skeleton';
export interface OrderDetailsProps {
  orderId: string;
  isOpen: boolean;
}

export function OrderDetails({ orderId, isOpen }: OrderDetailsProps) {
  const { data: order, isLoading: isOrderLoading } = useQuery({
    queryKey: ['order-details', orderId],
    queryFn: () => getOrderDetails({ orderId }),
    enabled: isOpen
  });

  if (!isOrderLoading && !order) {
    return null;
  }

  const priceTotal = (order?.totalInCents! / 100).toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL'
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Pedido: {orderId}</DialogTitle>
        <DialogDescription>Detalhes do pedido</DialogDescription>
      </DialogHeader>
      {order ? (
        <div className='space-y-6'>
          <Table>
            <TableRow>
              <TableCell className='text-muted-foreground'>Status</TableCell>
              <TableCell className='flex justify-end'>
                {<OrderStatus status={order.status} />}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className='text-muted-foreground'>Cliente</TableCell>
              <TableCell className='flex justify-end'>
                {order.customer.name}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className='text-muted-foreground'>Telefone</TableCell>
              <TableCell className='flex justify-end'>
                {order.customer.phone ?? 'Não informado'}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className='text-muted-foreground'>E-mail</TableCell>
              <TableCell className='flex justify-end'>
                {order.customer.email}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='text-muted-foreground'>
                Realizado há
              </TableCell>
              <TableCell className='flex justify-end'>
                {formatDistanceToNow(order.createdAt, {
                  locale: ptBR,
                  addSuffix: true
                })}
              </TableCell>
            </TableRow>
          </Table>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead className='text-right'>Qtd</TableHead>
                <TableHead className='text-right'>Preço</TableHead>
                <TableHead className='text-right'>Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.orderItems.map(orderItem => {
                const subTotal = (
                  (orderItem.priceInCents * orderItem.quantity) /
                  100
                ).toLocaleString('pt-br', {
                  style: 'currency',
                  currency: 'BRL'
                });

                const quantity = orderItem.quantity.toLocaleString('pt-br', {
                  minimumIntegerDigits: 2
                });

                const priceInCents = (
                  orderItem.priceInCents / 100
                ).toLocaleString('pt-br', {
                  style: 'currency',
                  currency: 'BRL'
                });

                return (
                  <TableRow>
                    <TableCell>{orderItem.product.name}</TableCell>
                    <TableCell className='text-right'>{quantity}</TableCell>
                    <TableCell className='text-right'>{priceInCents}</TableCell>
                    <TableCell className='text-right'>{subTotal}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableCell colSpan={3}>Total do pedido</TableCell>
              <TableCell className='text-right font-medium'>
                {priceTotal}
              </TableCell>
            </TableFooter>
          </Table>
        </div>
      ) : (
        <OrderDetailsSkeleton />
      )}
    </DialogContent>
  );
}
