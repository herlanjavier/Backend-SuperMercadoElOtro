import {
  buildPaginationMeta,
  getPaginationParams,
  getPaginationRange,
  MAX_LIMIT,
} from '../../../src/utils/pagination.js';

describe('pagination utils', () => {
  it('uses defaults when page and limit are missing or invalid', () => {
    expect(getPaginationParams({})).toEqual({ page: 1, limit: 20 });
    expect(getPaginationParams({ page: '0', limit: '-4' })).toEqual({ page: 1, limit: 20 });
  });

  it('caps limit at the maximum allowed value', () => {
    expect(getPaginationParams({ page: '2', limit: '500' })).toEqual({ page: 2, limit: MAX_LIMIT });
  });

  it('builds the Supabase range from page and limit', () => {
    expect(getPaginationRange(3, 20)).toEqual({ from: 40, to: 59 });
  });

  it('builds pagination metadata', () => {
    expect(buildPaginationMeta(2, 20, 45)).toEqual({
      page: 2,
      limit: 20,
      total: 45,
      totalPages: 3,
      hasNextPage: true,
      hasPreviousPage: true,
    });
  });
});
