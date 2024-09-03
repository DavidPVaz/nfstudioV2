// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { init, httpClientIntegration } from '@sentry/nextjs';

if (process.env.VERCEL_ENV === 'production' || process.env.VERCEL_ENV === 'preview') {
    init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

        sampleRate: 1.0,
        enableTracing: false,

        // Setting this option to true will print useful information to the console while you're setting up Sentry.
        debug: false,

        integrations: [httpClientIntegration()],
        sendDefaultPii: true,
        sendClientReports: false,

        environment: process.env.VERCEL_ENV,
        beforeSend: event => {
            // filter out the sending of client side errors after requests to own API.
            // All client side errors are handled, but if the API endpoint returns a 4xx - 5xx range response,
            // browser still detects as error and sentry will send an unnecessary error log, because in such cases,
            // api handler already logged the error
            if (event.request?.url?.includes('/api')) {
                return null;
            }

            return event;
        }
    });
}
