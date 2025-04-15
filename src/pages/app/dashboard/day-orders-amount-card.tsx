import { Utensils } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getDayOrdersAmount } from '@/api/get-day-orders-amount';
import { MetricCardSkeleton } from './matric-card-skeleton';

export function DayOrdersAmountCard() {
  const { data: dayOrderAmount } = useQuery({
    queryKey: ['metrics', 'day-orders-amount'],
    queryFn: getDayOrdersAmount
  });

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-base font-semibold'>Pedidos (dia)</CardTitle>
        <Utensils className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent className='space-y-1 '>
        {dayOrderAmount ? (
          <>
            <span className='text-2xl font-bold tracking-tight'>
              {dayOrderAmount.amount.toLocaleString('pt-br')}
            </span>
            <p className='text-xs text-muted-foreground'>
              {dayOrderAmount.diffFromYesterday >= 0 ? (
                <>
                  <span className='text-emerald-500 dark:text-emerald-400'>
                    +{dayOrderAmount.diffFromYesterday}%
                  </span>{' '}
                  em relação a ontem
                </>
              ) : (
                <>
                  <span className='text-rose-500 dark:text-rose-400'>
                    {dayOrderAmount.diffFromYesterday}%
                  </span>{' '}
                  em relação a ontem
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
