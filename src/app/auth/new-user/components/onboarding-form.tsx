"use client"

import { LoadingButton } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { newUserAction } from '@/lib/new-user.action'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
    name: z.string().regex(/^[a-zA-Z\s]+$/, {
        message: "Name must contain only letters and spaces",
    }).min(3, {
        message: "Name must be at least 3 characters long"
    }).max(50, {
        message: "Name must be at most 50 characters long"
    }),
});

export const OnboardingForm = () => {
    const router = useRouter();
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await newUserAction(values);

            router.push('/profile');
            router.refresh();
        } catch (e) {
            if (e instanceof Error) {
                form.setError("name", { type: "manual", message: e.message });
            } else {
                form.setError("name", { type: "manual", message: "An unexpected error occurred" });
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Your name</FormLabel>
                            <FormControl>
                                <Input required placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <LoadingButton
                    isLoading={form.formState.isSubmitting}
                    type="submit"
                    loadingText='Saving...'
                    className="w-full"
                >
                    Save
                </LoadingButton>
            </form>
        </Form>
    )
}