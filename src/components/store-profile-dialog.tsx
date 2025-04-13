import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getManagedRestaurant,
  GetManagedRestaurantResponse
} from '@/api/get-managed-restorant';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfile } from '@/api/update-profile';
import { toast } from 'sonner';
import { queryClient } from '@/lib/react-query';

const storeProfileSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable()
});
type StoreProfileSchema = z.infer<typeof storeProfileSchema>;

export function StoreProfileDialog() {
  // Aqui é interessante que essa request não é feita novamente, pois ela ja foi realizada pelo componente anterior account-menu

  const { data: managedRestaurant } = useQuery({
    queryKey: ['managed-restaurant'],
    queryFn: getManagedRestaurant,
    staleTime: Infinity
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<StoreProfileSchema>({
    resolver: zodResolver(storeProfileSchema),
    values: {
      name: managedRestaurant?.name ?? '',
      description: managedRestaurant?.description ?? ''
    }
  });
  function updateManagedRestaurantCached({
    name,
    description
  }: StoreProfileSchema) {
    const cached = queryClient.getQueryData<GetManagedRestaurantResponse>([
      'managed-restaurant'
    ]);

    if (cached) {
      queryClient.setQueryData<GetManagedRestaurantResponse>(
        ['managed-restaurant'],
        {
          ...cached,
          name,
          description
        }
      );
    }
    return { previousManagedRestaurant: cached };
  }

  const { mutateAsync: updateProfileFn } = useMutation({
    mutationFn: updateProfile,
    /**
     * Aqui o comportamento sera de atualizar os dados em cache no momento que a request de update for sucesso
     */
    // onSuccess(_, { name, description }) {
    //   updateManagedRestaurantCached({
    //     name,
    //     description
    //   });
    // },

    /**
     * Interface Otimista
     * Este conceito permite reagir a alterações de entrada do usuário antes mesmo que elas sejam confirmadas no backend.
     * Para implementar a interface otimista, separamos o código de atualização em uma função separada e a chamamos no evento onMutate, que é acionado no momento em que o usuário clica no botão de salvar.
     * Também utilizamos o evento onError para lidar com erros na requisição, revertendo o cache para os dados originais caso ocorra algum problema.
     *  A interface otimista é uma técnica poderosa para melhorar a experiência do usuário em situações em que a probabilidade de erro é baixa.
     *
     */

    onMutate({ name, description }) {
      return updateManagedRestaurantCached({
        name,
        description
      });
    },
    onError(_, __, context) {
      if (context?.previousManagedRestaurant) {
        updateManagedRestaurantCached({
          name: context.previousManagedRestaurant.name,
          description: context.previousManagedRestaurant.description
        });
      }
    }
  });

  async function handleUpdateProfile(data: StoreProfileSchema) {
    try {
      await updateProfileFn({
        name: data.name,
        description: data.description
      });

      toast.success('Perfil atualizado com sucesso');
    } catch {
      toast.error('Falha ao atualizar o perfil, tente novamente!');
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Perfil da loja</DialogTitle>
        <DialogDescription>
          Atualize as informações do seu estabelecimento visíveis ao seu cliente
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleUpdateProfile)}>
        <div className='space-y-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-3'>
            <Label className='text-right' htmlFor='name'>
              Nome
            </Label>
            <Input className='col-span-3' id='name' {...register('name')} />
          </div>

          <div className='grid grid-cols-4 items-center gap-3'>
            <Label className='text-right' htmlFor='description'>
              Descrição
            </Label>
            <Textarea
              className='col-span-3'
              id='description'
              {...register('description')}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='ghost'>
              Cancelar
            </Button>
          </DialogClose>
          <Button type='submit' variant='success' disabled={isSubmitting}>
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
