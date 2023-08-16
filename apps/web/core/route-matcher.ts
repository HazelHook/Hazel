function matchesWildcard(path: string, pattern: string): boolean {
	const regex = new RegExp(`^${pattern.split("*").join(".*")}$`)
	return regex.test(path)
}

export function isPrivateRoute(path: string, privateRoutes: string[]): boolean {
	for (const route of privateRoutes) {
		if (matchesWildcard(path, route)) {
			return true
		}
	}
	return false
}

export function isPublicRoute(path: string, publicRoutes: string[]): boolean {
	for (const route of publicRoutes) {
		if (matchesWildcard(path, route)) {
			return true
		}
	}
	return false
}
