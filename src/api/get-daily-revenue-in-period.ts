import { api } from '@/lib/axios';

export type GetDailyRevenueInPeriodResponse = {
  date: string;
  receipt: number;
}[];

interface GetDailyRevenueInPeriodProps {
  from: Date | undefined;
  to: Date | undefined;
}

export async function getDailyRevenueInPeriod({
  from,
  to
}: GetDailyRevenueInPeriodProps) {
  const response = await api.get<GetDailyRevenueInPeriodResponse>(
    '/metrics/daily-receipt-in-period',
    {
      params: {
        from,
        to
      }
    }
  );
  return response.data;
}
