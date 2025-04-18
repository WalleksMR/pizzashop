import { DollarSign } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMonthCanceledOrdersAmount } from '@/api/get-month-canceled-orders-amount';
import { useQuery } from '@tanstack/react-query';
import { MetricCardSkeleton } from './matric-card-skeleton';

export function MonthCanceledOrdersAmountCard() {
  const { data: monthCanceledOrderAmount } = useQuery({
    queryKey: ['metrics', 'month-canceled-orders-amount'],
    queryFn: getMonthCanceledOrdersAmount
  });

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-base font-semibold'>
          Cancelamentos (mês)
        </CardTitle>
        <DollarSign className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent className='space-y-1 '>
        {monthCanceledOrderAmount ? (
          <>
            <span className='text-2xl font-bold tracking-tight'>
              {monthCanceledOrderAmount.amount.toLocaleString('pt-br')}
            </span>
            <p className='text-xs text-muted-foreground'>
              {monthCanceledOrderAmount.diffFromLastMonth >= 0 ? (
                <>
                  <span className='text-emerald-500 dark:text-emerald-400'>
                    +{monthCanceledOrderAmount.diffFromLastMonth}%
                  </span>{' '}
                  em relação ao mês passado
                </>
              ) : (
                <>
                  <span className='text-rose-500 dark:text-rose-400'>
                    {monthCanceledOrderAmount.diffFromLastMonth}%
                  </span>{' '}
                  em relação ao mês passado
                </>
              )}
            </p>
          </>
        ) : (
          <MetricCardSkeleton />
        )}
      </CardContent>
    </Card>
  );
}
