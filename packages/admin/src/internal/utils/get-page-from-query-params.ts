/**
 * Get page from query params
 * @name getPageFromQueryParams
 * @param pageParam
 */
export function getPageFromQueryParams(pageParam: string | undefined) {
	const page = pageParam ? parseInt(pageParam) : 1

	if (Number.isNaN(page) || page <= 0) {
		return 1
	}

	return page
}
