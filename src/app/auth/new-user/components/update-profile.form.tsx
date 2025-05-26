"use client"

import { Button, LoadingButton } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { updateProfileAction } from '@/lib/updateProfile.action'
import { useRouter } from 'next/navigation'
import { CldImage, CldUploadWidget } from 'next-cloudinary'
import { Camera, User, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { updateProfileFormSchema, UpdateProfileFormSchemaType } from '@/schemas/updateProfile-form.schema'

export const UpdateProfileForm = ({ defaultValues }: { defaultValues?: UpdateProfileFormSchemaType }) => {
    const router = useRouter();

    const form = useForm<UpdateProfileFormSchemaType>({
        resolver: zodResolver(updateProfileFormSchema),
        defaultValues: defaultValues ?? {
            name: "",
            image: null,
        },
    });

    async function onSubmit(values: UpdateProfileFormSchemaType) {
        try {
            await updateProfileAction(values);

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
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Profile Photo</FormLabel>
                            <FormControl>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        {
                                            field.value ? (
                                                <CldImage
                                                    width="100"
                                                    height="100"
                                                    src={field.value}
                                                    sizes="100px"
                                                    alt="Profile Image"
                                                    crop={"auto"}
                                                />
                                            ) : (
                                                <User className="h-8 w-8" />
                                            )
                                        }
                                        {field.value && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    field.onChange(null);
                                                }}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <X className="h-4 w-4 mr-2" />
                                                Remove
                                            </Button>
                                        )}
                                    </div>

                                    <CldUploadWidget
                                        signatureEndpoint="/api/sign-cloudinary-params"
                                        onSuccess={(result, { widget }) => {
                                            console.log(result.info)
                                            if (typeof result.info === "object" && "secure_url" in result.info) {
                                                field.onChange(result.info.public_id);
                                                // widget.close();
                                            }
                                        }}
                                        options={{
                                            cropping: true,
                                            maxFiles: 1,
                                            maxFileSize: 2 * 1024 * 1024, // 2MB
                                            folder: "profile-images",
                                            tags: ["profile-image"],
                                        }}
                                        onQueuesEnd={(_, { widget }) => {
                                            // widget.close();
                                        }}
                                    >
                                        {({ open }) => {
                                            function handleOnClick() {
                                                open();
                                            }
                                            return (
                                                <Card
                                                    onClick={handleOnClick}
                                                    className={"border-2 border-dashed transition-colors cursor-pointer border-muted-foreground/25 hover:border-muted-foreground/50"}
                                                >
                                                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                                                        <div className="rounded-full bg-muted p-4 mb-4">
                                                            <Camera className="h-6 w-6 text-muted-foreground" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <p className="text-sm font-medium">
                                                                Click to upload
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">PNG, JPG, JPEG or WEBP (max. 5MB)</p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        }}
                                    </CldUploadWidget>
                                </div>
                            </FormControl>
                            <FormDescription>Upload a profile photo. This will be visible to other users.</FormDescription>
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