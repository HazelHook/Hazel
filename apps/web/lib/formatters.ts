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

export const cleanFormData = (data: any) => {
	const result: any = {}
	Object.keys(data).forEach((key) => {
		if(data.key === undefined){
			return
		}

		if(data.key === null){
			result[key] = null
			return
		}

		if(typeof data.key === "string"){
			if(data.key.trim() === ""){
				result[key] = null
				return
			}

			result[key] = data.key.trim()
			return
		}

		result[key] = data.key
	})

	return result
}