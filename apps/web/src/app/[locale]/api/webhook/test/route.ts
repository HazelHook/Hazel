import { verifySignature } from "@hazel/sdk"

export const POST = async (req: Request) => {
	const isValid = verifySignature(
		"sk_530a7f6d609053a3d750107cc9f",
		await req.text(),
		req.headers.get("X-HAZEL-SIGNATURE")!,
	)

	if (!isValid) {
		return Response.json({})
	}

	return Response.json({ data: {} })
}
