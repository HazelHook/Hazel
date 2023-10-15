function matchesWildcard(path: string, pattern: string): boolean {
	const regexPattern = pattern
		.split("*")
		.join(".*") // Replace * with .*
		.replace(/:[a-zA-Z0-9_]+/g, "[^/]+") // Replace :somevalue with [^/]+
	const regex = new RegExp(`^${regexPattern}$`)
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
