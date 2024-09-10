import React from 'react';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { useForm } from 'react-hook-form';
import * as v from 'valibot';
import { Button } from '@/components/atoms/button';
import { Textarea } from '@/components/atoms/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/atoms/form';

const LoadFormSchema = v.object({
    ids: v.pipe(
        v.string(),
        v.regex(/(?!^$)/, 'At least 1 NFT ID must be provided.'),
        v.regex(/^[0-9,]+$/, 'Only numbers and commas are allowed.'),
        v.regex(
            /^(?!,)(?!.*,,)(?!.*,$)[0-9,]+$/,
            'There should be no leading, trailing, or consecutive commas.'
        ),
        v.regex(/^([0-9]{1,5})(,[0-9]{1,5})*$/, 'Each NFT ID must be between 1 and 5 digits.'),
        v.regex(
            /^([0-9]{1,5})(,[0-9]{1,5}){0,19}$/,
            'You can only provide a maximum of 20 NFT IDs.'
        ),
        v.transform(ids => ids.split(',').map(Number))
    )
});

export const LoadForm = ({ onSubmit }: { onSubmit: ({ ids }: { ids: number[] }) => void }) => {
    const form = useForm<
        v.InferInput<typeof LoadFormSchema>,
        unknown,
        v.InferOutput<typeof LoadFormSchema>
    >({
        resolver: valibotResolver(LoadFormSchema),
        mode: 'onChange',
        defaultValues: {
            ids: ''
        }
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-1">
                <FormField
                    control={form.control}
                    name="ids"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="ids">NFT IDs</FormLabel>
                            <FormControl>
                                <Textarea autoFocus placeholder="e.g. 1200,400,3130" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    className="w-full"
                    type="submit"
                    disabled={!!form.formState.errors.ids?.message || form.formState.isSubmitting}
                >
                    Load
                </Button>
            </form>
        </Form>
    );
};
