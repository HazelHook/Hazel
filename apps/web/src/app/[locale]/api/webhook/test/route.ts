export const POST = async (req: Request) => {
	return Response.json({ data: await req.text() })
}
