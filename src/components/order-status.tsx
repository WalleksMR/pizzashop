import { ReactNode } from 'react';

type OrderStatus =
  | 'pending'
  | 'canceled'
  | 'processing'
  | 'delivering'
  | 'delivered';

interface OrderStatusProps {
  status: OrderStatus;
}

const orderStatusMap: Record<OrderStatus, string> = {
  pending: 'Pendente',
  canceled: 'Cancelado',
  delivered: 'Entregue',
  delivering: 'Em entrega',
  processing: 'Em preparo'
};

const colorStatus: Record<OrderStatus, ReactNode> = {
  pending: <span className='h-2 w-2 rounded-full bg-slate-400 ' />,
  canceled: <span className='h-2 w-2 rounded-full bg-rose-500 ' />,
  delivered: <span className='h-2 w-2 rounded-full bg-emerald-500 ' />,
  processing: <span className='h-2 w-2 rounded-full bg-amber-500 ' />,
  delivering: <span className='h-2 w-2 rounded-full bg-amber-500 ' />
};

export function OrderStatus({ status }: OrderStatusProps) {
  return (
    <div className='flex items-center gap-2'>
      {colorStatus[status]}
      <span className='font-medium text-muted-foreground'>
        {orderStatusMap[status]}
      </span>
    </div>
  );
}
