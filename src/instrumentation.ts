import { init } from '@sentry/nextjs';

export function register() {
    if (process.env.VERCEL_ENV === 'production' || process.env.VERCEL_ENV === 'preview') {
        init({
            dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

            sampleRate: 1.0,
            enableTracing: false,

            // Setting this option to true will print useful information to the console while you're setting up Sentry.
            debug: false,

            sendDefaultPii: true,
            sendClientReports: false,

            environment: process.env.VERCEL_ENV
        });
    }
}
