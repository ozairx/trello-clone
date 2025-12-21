'use client';

import { createBoardAction } from '@/lib/actions/board-actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRef, useState } from 'react';

export function CreateBoardForm() {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await createBoardAction(formData);
    if (result.success) {
      setOpen(false);
      formRef.current?.reset();
    } else {
      // Handle error, e.g., show a toast message
      console.error(result.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create new board</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new board</DialogTitle>
          <DialogDescription>
            Enter a title for your new board.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <Input name="title" placeholder="Board title" />
          <Button type="submit">Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
