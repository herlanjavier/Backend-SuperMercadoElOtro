export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

const toPositiveInteger = (value, fallback) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return fallback;
  return parsed;
};

export const getPaginationParams = (query = {}) => {
  const page = toPositiveInteger(query.page, DEFAULT_PAGE);
  const requestedLimit = toPositiveInteger(query.limit, DEFAULT_LIMIT);
  const limit = Math.min(requestedLimit, MAX_LIMIT);

  return { page, limit };
};

export const getPaginationRange = (page, limit) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  return { from, to };
};

export const buildPaginationMeta = (page, limit, total = 0) => {
  const safeTotal = Number.isFinite(total) ? total : 0;
  const totalPages = Math.ceil(safeTotal / limit);

  return {
    page,
    limit,
    total: safeTotal,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

export const buildPaginatedResponse = (items, page, limit, total) => ({
  items,
  pagination: buildPaginationMeta(page, limit, total),
});
