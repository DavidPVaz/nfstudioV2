import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov', 'json'],
            include: [
                'src/middleware.ts',
                'src/server/service/**/**',
                'src/server/middleware/**',
                'src/lib/**/**',
                'src/pages/api/**/**'
            ],
            exclude: ['src/server/service/**/types.*']
        },
        testTimeout: 30000,
        setupFiles: ['dotenv/config'],
        hideSkippedTests: true
    }
});
