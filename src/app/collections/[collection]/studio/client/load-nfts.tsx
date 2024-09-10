import React from 'react';
import { Button } from '@/components/atoms/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/atoms/card';
import { Textarea } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';

export const LoadNfts = () => (
    <div className="container flex w-full items-center justify-center overflow-y-auto">
        <LoadForm />
    </div>
);

const LoadForm = () => {
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
            <CardContent className="grid pb-2 pl-0 pr-0 pt-2 2xs:p-6">
                <div>
                    <Label htmlFor="ids">NFT IDs</Label>
                    <Textarea autoFocus id="ids" placeholder="e.g. 1200,400,3130" required />
                </div>
            </CardContent>
            <CardFooter className="pb-6 pl-0 pr-0 pt-2 2xs:p-6">
                <Button className="w-full">Load</Button>
            </CardFooter>
        </Card>
    );
};
