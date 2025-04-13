import { Building, ChevronDown, LogOut } from 'lucide-react';

import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getProfile } from '@/api/get-profile';
import { getManagedRestaurant } from '@/api/get-managed-restorant';
import { Skeleton } from './ui/skeleton';
import { Dialog, DialogTrigger } from './ui/dialog';
import { StoreProfileDialog } from './store-profile-dialog';
import { signOut } from '@/api/sign-out';
import { useNavigate } from 'react-router-dom';

export function AccountMenuProps() {
  const navigate = useNavigate();

  // Vantagem de utilizar ReactQuery é a deduplicação. Por exemplo, caso precise buscar essa mesma informação na api do usuário logado
  // ela ira consegue fazer apenas um unica requisição com base na key, que identifica unicamente uma requisição na minha aplicação.

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: Infinity
  });

  const { data: managedRestaurant, isLoading: isLoadingManagedRestaurant } =
    useQuery({
      queryKey: ['managed-restaurant'],
      queryFn: getManagedRestaurant,
      staleTime: Infinity
    });

  const { mutateAsync: signOutFn, isPending: isSigningOut } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      // replace, faz com que o usuário nao possa volta na pagina anterior
      navigate('/sign-in', { replace: true });
    }
  });

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            className='flex select-none items-center gap-2'
          >
            {isLoadingManagedRestaurant ? (
              <Skeleton className='h-4 w-40' />
            ) : (
              managedRestaurant?.name
            )}
            <ChevronDown className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-56'>
          <DropdownMenuLabel className='flex flex-col'>
            {isLoadingProfile ? (
              <div className='space-y-1.5'>
                <Skeleton className='w32 h-4' />
                <Skeleton className='h-3 w-24' />
              </div>
            ) : (
              <>
                {' '}
                <span>{profile?.name}</span>
                <span className='text-xs  font-normal text-muted-foreground'>
                  {profile?.email}
                </span>
              </>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Building className='mr-2 h-4 w-4' />
              <span>Perfil da loja</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem
            asChild
            className='text-rose-500 dark:text-rose-400'
            disabled={isSigningOut}
          >
            <button className='w-full' onClick={() => signOutFn()}>
              <LogOut className='mr-2 h-4 w-4' />
              <span>Sair</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <StoreProfileDialog />
    </Dialog>
  );
}
