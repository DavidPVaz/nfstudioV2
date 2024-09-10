import React, { useCallback } from 'react';
import { Button } from '@/components/atoms/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card';
import { Textarea } from '@/components/atoms/input';

import { valibotResolver } from '@hookform/resolvers/valibot';
import { useForm } from 'react-hook-form';
import * as v from 'valibot';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';

const formSchema = v.object({
    ids: v.pipe(
        v.string(),
        v.regex(
            /^[0-9,]+$/,
            'The input contains invalid characters. Only numbers and commas are allowed.'
        ),
        v.regex(
            /^(?!,)(?!.*,,)(?!.*,$)[0-9,]+$/,
            'There should be no leading, trailing, or consecutive commas.'
        ),
        v.regex(/^([0-9]{1,5})(,[0-9]{1,5})*$/, 'Each NFT ID must be between 1 and 5 digits.'),
        v.regex(
            /^([0-9]{1,5})(,[0-9]{1,5}){0,19}$/,
            'There must be at least 1 NFT ID and no more than 20 NFT IDs.'
        )
    )
});

/*
ids: v.pipe(
        v.array(v.pipe(v.number(), v.minValue(0), v.maxValue(10000), v.transform(String))),
        v.minLength(1, 'A minimum of 1 NFT ID needs to be provided.'),
        v.maxLength(20, 'You can only provide a maximum of 20 NFTs IDs.')
    )
*/

export const LoadNfts = () => (
    <div className="container flex w-full items-center justify-center overflow-y-auto">
        <LoadForm />
    </div>
);

const LoadForm = () => {
    const form = useForm<v.InferInput<typeof formSchema>>({
        resolver: valibotResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            ids: ''
        }
    });

    const onFormSubmit = useCallback((data: v.InferInput<typeof formSchema>) => {
        console.log('DATA: ', data);
    }, []);

    return (
        <Card className="relative h-full w-full max-w-sm border-0 bg-background 2xs:h-auto 2xs:border">
            <CardHeader className="gap-y-1 pb-2 pl-0 pr-0 pt-6 2xs:p-6 sm:gap-y-3">
                <CardTitle className="text-lg text-foreground sm:text-xl">
                    Please <strong>provide</strong> <strong>the</strong> <strong>IDs</strong> of the{' '}
                    <strong>NFTs</strong> you wish to convert.
                </CardTitle>
                <CardDescription className="text-sm text-foreground sm:text-lg">
                    You can load up to <strong>20</strong> <strong>NFTs</strong>, but you will{' '}
                    <strong>only</strong> <strong>be</strong> <strong>able</strong> to work on them{' '}
                    <strong>individually</strong>. Please add the <strong>IDs</strong>{' '}
                    <strong>separated</strong> <strong>by</strong> <strong>comma</strong>.
                </CardDescription>
                <CardDescription className="text-sm text-foreground sm:text-lg">
                    When you are done, <strong>click</strong> <strong>Load</strong>.
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onFormSubmit)}
                    className="flex flex-col gap-y-4 pb-6 pl-0 pr-0 pt-2 2xs:p-6"
                >
                    <FormField
                        control={form.control}
                        name="ids"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="ids">NFT IDs</FormLabel>
                                <FormControl>
                                    <Textarea
                                        autoFocus
                                        placeholder="e.g. 1200,400,3130"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        className="w-full"
                        type="submit"
                        disabled={
                            !!form.formState.errors.ids?.message || form.formState.isSubmitting
                        }
                    >
                        Load
                    </Button>
                </form>
            </Form>
        </Card>
    );
};
