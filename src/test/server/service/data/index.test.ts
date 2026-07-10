import { describe, vi, afterEach } from 'vitest';

const { getDbConnectionMock, buildQueryMock } = vi.hoisted(() => ({
    getDbConnectionMock: vi.fn(),
    buildQueryMock: vi.fn()
}));

vi.mock('@/server/service/data/core', () => ({
    getDbConnection: getDbConnectionMock,
    buildQuery: buildQueryMock
}));

describe.todo('server/service/data/index', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });
});
