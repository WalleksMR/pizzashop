import { Helmet } from 'react-helmet-async';

import { Pagination } from '@/components/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import { OrderTableFilters } from './order-table-filters';
import { OrderTableRow } from './order-table-row';
import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/api/get-orders';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export function Orders() {
  const [searchParams, setSearchParams] = useSearchParams();

  const orderId = searchParams.get('orderId');
  const customerName = searchParams.get('customerName');
  const status = searchParams.get('status') ?? 'all';

  const pageIndex = z.coerce
    .number()
    .transform(page => page - 1)
    .parse(searchParams.get('page') ?? '1');

  const {
    data: result,
    isLoading: isOrderLoading,
    isError: isOrderError,
    error
  } = useQuery({
    queryKey: ['orders', pageIndex, orderId, customerName, status],
    queryFn: () =>
      getOrders({
        pageIndex,
        orderId,
        customerName,
        status: status === 'all' ? null : status
      })
  });

  function handlePaginate(pageIndex: number) {
    setSearchParams(state => {
      state.set('page', (pageIndex + 1).toString());
      return state;
    });
  }

  if (isOrderError) {
    toast.error(`Ocorreu erro ao buscar os pedidos ${error.message}`);
  }

  return (
    <>
      <Helmet title='Pedidos' />
      <div className='flex flex-col gap-4'>
        <h1 className='text-3xl font-bold tracking-tight'>Pedidos</h1>
        <div className='space-y-2.5'>
          <OrderTableFilters />
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[64px]'></TableHead>
                  <TableHead className='w-[140px]'>Identificador</TableHead>
                  <TableHead className='w-[180px]'>Realizado há</TableHead>
                  <TableHead className='w-[140px]'>Status</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className='w-[164px]'>Total do pedido</TableHead>
                  <TableHead className='w-[132px]'></TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isOrderLoading
                  ? Array.from({ length: 10 }).map((_, index) => (
                      <TableRow>
                        <TableCell colSpan={8}>
                          <Skeleton
                            id={index.toString()}
                            className='h-8 w-full '
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  : result &&
                    result.orders.map(order => (
                      <OrderTableRow key={order.orderId} order={order} />
                    ))}
              </TableBody>
            </Table>
          </div>
          {result && (
            <Pagination
              pageIndex={result.meta.pageIndex}
              perPage={result.meta.perPage}
              totalCount={result.meta.totalCount}
              onPageChange={handlePaginate}
            />
          )}
        </div>
      </div>
    </>
  );
}
