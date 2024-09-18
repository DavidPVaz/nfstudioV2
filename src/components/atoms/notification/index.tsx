'use client';

import React from 'react';
import * as NotificationPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Provider = NotificationPrimitives.Provider;

const NotificationViewport = React.forwardRef<
    React.ElementRef<typeof NotificationPrimitives.Viewport>,
    React.ComponentPropsWithoutRef<typeof NotificationPrimitives.Viewport>
>(({ className, ...props }, ref) => (
    <NotificationPrimitives.Viewport
        ref={ref}
        className={cn(
            'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
            className
        )}
        {...props}
    />
));
NotificationViewport.displayName = NotificationPrimitives.Viewport.displayName;

const notificationVariants = cva(
    'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
    {
        variants: {
            variant: {
                default: 'border bg-background text-foreground',
                destructive:
                    'destructive group border-destructive bg-destructive text-destructive-foreground',
                success: 'success group border-success bg-success text-success-foreground'
            }
        },
        defaultVariants: {
            variant: 'default'
        }
    }
);

const Notification = React.forwardRef<
    React.ElementRef<typeof NotificationPrimitives.Root>,
    React.ComponentPropsWithoutRef<typeof NotificationPrimitives.Root> &
        VariantProps<typeof notificationVariants>
>(({ className, variant, ...props }, ref) => {
    return (
        <NotificationPrimitives.Root
            ref={ref}
            className={cn(notificationVariants({ variant }), className)}
            {...props}
        />
    );
});
Notification.displayName = NotificationPrimitives.Root.displayName;

const NotificationAction = React.forwardRef<
    React.ElementRef<typeof NotificationPrimitives.Action>,
    React.ComponentPropsWithoutRef<typeof NotificationPrimitives.Action>
>(({ className, ...props }, ref) => (
    <NotificationPrimitives.Action
        ref={ref}
        className={cn(
            'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive',
            className
        )}
        {...props}
    />
));
NotificationAction.displayName = NotificationPrimitives.Action.displayName;

const NotificationClose = React.forwardRef<
    React.ElementRef<typeof NotificationPrimitives.Close>,
    React.ComponentPropsWithoutRef<typeof NotificationPrimitives.Close>
>(({ className, ...props }, ref) => (
    <NotificationPrimitives.Close
        ref={ref}
        className={cn(
            'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-100 transition-opacity hover:text-foreground focus:outline-none focus:ring-2 group-[.destructive]:text-red-300 group-[.success]:text-green-300 group-[.destructive]:hover:text-red-50 group-[.success]:hover:text-green-50 group-[.destructive]:focus:ring-red-400 group-[.success]:focus:ring-green-400 group-[.destructive]:focus:ring-offset-red-600 group-[.success]:focus:ring-offset-green-600',
            className
        )}
        toast-close=""
        {...props}
    >
        <X className="h-4 w-4" />
        <span className="sr-only">Close notification</span>
    </NotificationPrimitives.Close>
));
NotificationClose.displayName = NotificationPrimitives.Close.displayName;

const NotificationTitle = React.forwardRef<
    React.ElementRef<typeof NotificationPrimitives.Title>,
    React.ComponentPropsWithoutRef<typeof NotificationPrimitives.Title>
>(({ className, ...props }, ref) => (
    <NotificationPrimitives.Title
        ref={ref}
        className={cn('text-sm font-semibold', className)}
        {...props}
    />
));
NotificationTitle.displayName = NotificationPrimitives.Title.displayName;

const NotificationDescription = React.forwardRef<
    React.ElementRef<typeof NotificationPrimitives.Description>,
    React.ComponentPropsWithoutRef<typeof NotificationPrimitives.Description>
>(({ className, ...props }, ref) => (
    <NotificationPrimitives.Description
        ref={ref}
        className={cn('text-sm opacity-90', className)}
        {...props}
    />
));
NotificationDescription.displayName = NotificationPrimitives.Description.displayName;

type NotificationProps = React.ComponentPropsWithoutRef<typeof Notification>;

type NotificationActionElement = React.ReactElement<typeof NotificationAction>;

export {
    type NotificationProps,
    type NotificationActionElement,
    Provider,
    NotificationViewport,
    Notification,
    NotificationTitle,
    NotificationDescription,
    NotificationClose,
    NotificationAction
};
