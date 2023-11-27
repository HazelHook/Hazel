/** @type {import('prettier').Config} */
module.exports = {
	importOrder: [
		"^(react/(.*)$)|^(react$)",
		"^(next/(.*)$)|^(next$)",
		"",
		"^@/hazel/ui/(.*)$",
		"^@/hazel/icons/(.*)$",
		"",
		"^@/hazel/(.*)$",
		"",
		"^types$",
		"^@/types/(.*)$",
		"^@/server/(.*)$",
		"^@/config/(.*)$",
		"^@/lib/(.*)$",
		"^@/hooks/(.*)$",
		"^@/components/ui/(.*)$",
		"^@/components/(.*)$",
		"^@/styles/(.*)$",
		"^@/app/(.*)$",
		"",
		"",
		"<THIRD_PARTY_MODULES>",
		"",
		"^[./]",
	],
	importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
	plugins: ["@ianvs/prettier-plugin-sort-imports"],
}
