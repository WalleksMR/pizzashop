import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { DialogContent, DialogFooter, DialogHeader } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useQuery } from '@tanstack/react-query';
import { getManagedRestaurant } from '@/api/get-managed-restorant';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const storeProfileSchema = z.object({
  name: z.string().min(1),
  description: z.string()
});
type StoreProfileSchema = z.infer<typeof storeProfileSchema>;

export function StoreProfileDialog() {
  // Aqui é interessante que essa request não é feita novamente, pois ela ja foi realizada pelo componente anterior account-menu

  const { data: managedRestaurant } = useQuery({
    queryKey: ['managed-restaurant'],
    queryFn: getManagedRestaurant
  });

  const { register, handleSubmit } = useForm<StoreProfileSchema>({
    resolver: zodResolver(storeProfileSchema),
    values: {
      name: managedRestaurant?.name ?? '',
      description: managedRestaurant?.description ?? ''
    }
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Perfil da loja</DialogTitle>
        <DialogDescription>
          Atualize as informações do seu estabelecimento visíveis ao seu cliente
        </DialogDescription>
      </DialogHeader>

      <form>
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
          <Button type='button' variant='ghost'>
            Cancelar
          </Button>
          <Button type='submit' variant='success'>
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
