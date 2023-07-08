"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useAction } from "@/server/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import type { createDestinationAction } from "./_actions";
import { formSchema } from "./schema";

interface NewDestinationFormProps {
  action: typeof createDestinationAction;
  shouldRedirect?: boolean;
  onClose?: (id: string) => void;
}

export function NewDestinationForm({
  onClose,
  action,
  shouldRedirect = true,
}: NewDestinationFormProps) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      url: "",
    },
  });

  const createSource = useAction(action, {
    onSuccess(data) {
      router.refresh();
      if (shouldRedirect) {
        router.push(`/destination/${data.id}/`);
      }

      onClose?.(data.id);
    },
    onError(error) {
      form.setError("root", error);
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    createSource.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Destination ..." {...field} />
              </FormControl>
              <FormDescription>
                A name to identify your destination.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination Url</FormLabel>
              <FormControl>
                <Input placeholder="Url" {...field} />
              </FormControl>
              <FormDescription>
                HTTP endpoint of your backend or api
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormMessage />

        <Button
          type="submit"
          disabled={createSource.status === "loading"}
          loading={createSource.status === "loading"}
        >
          Create
        </Button>
      </form>
    </Form>
  );
}
