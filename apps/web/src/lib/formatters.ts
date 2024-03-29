export const currencyFormatter = (currency = "eur", locale = "en") =>
	Intl.NumberFormat(locale, {
		style: "currency",
		currency: currency,
	})

export const dashboardNumberFormatter = (locale = "en", maximumFractionDigits = 3, maximumSignificantDigits = 3) =>
	Intl.NumberFormat(locale, {
		notation: "compact",
		maximumFractionDigits: maximumFractionDigits,
		maximumSignificantDigits: maximumSignificantDigits,
	})

export const dateFormatter = (locale = "en") => {
	return Intl.DateTimeFormat(locale, {
		day: "numeric",
		month: "numeric",
		year: "numeric",
	})
}

export const dataTableTimestampFormatter = (locale = "en") => {
	return Intl.DateTimeFormat(locale, {
		month: "short",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "numeric",
		hour12: true,
	})
}

type FormatType = "json"

export const formatCode = (code: string, type: FormatType) => {
	switch (type) {
		case "json": {
			try {
				const jsonObject = JSON.parse(code)
				return JSON.stringify(jsonObject, null, 2)
			} catch (error) {
				return code
			}
		}
	}
}
