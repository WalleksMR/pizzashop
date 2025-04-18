import { Utensils } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getMonthOrdersAmount } from '@/api/get-month-orders-amount';
import { MetricCardSkeleton } from './matric-card-skeleton';

export function MonthOrdersAmountCard() {
  const { data: monthOrderAmount } = useQuery({
    queryKey: ['metrics', 'month-orders-amount'],
    queryFn: getMonthOrdersAmount
  });

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-base font-semibold'>Pedidos (mês)</CardTitle>
        <Utensils className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent className='space-y-1 '>
        {monthOrderAmount ? (
          <>
            <span className='text-2xl font-bold tracking-tight'>
              {monthOrderAmount.amount.toLocaleString('pt-br')}
            </span>
            <p className='text-xs text-muted-foreground'>
              {monthOrderAmount.diffFromLastMonth >= 0 ? (
                <>
                  <span className='text-emerald-500 dark:text-emerald-400'>
                    +{monthOrderAmount.diffFromLastMonth}%
                  </span>{' '}
                  em relação ao mês passado
                </>
              ) : (
                <>
                  <span className='text-rose-500 dark:text-rose-400'>
                    {monthOrderAmount.diffFromLastMonth}%
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
