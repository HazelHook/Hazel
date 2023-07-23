import { AvatarImage, Avatar } from "@/components/ui/avatar"
import { getSeededProfileImageUrl } from "@/lib/utils"
import { api } from "@/server/client"
import { User } from "@clerk/nextjs/dist/types/server/clerkClient"
import { useEffect, useState } from "react"

export const UserCell = ({ userId }: { userId: string }) => {
	const [user, setUser] = useState<User>()

	const fetchData = async (userId: string) => {
		const user = await api.getUser.query({ userId })
		setUser(user)
	}

	useEffect(() => {
		fetchData(userId)
	}, [userId])

	return (
		<div className="flex flex-row gap-2">
			<Avatar>
				<AvatarImage src={getSeededProfileImageUrl(userId)} />
			</Avatar>
			<div>
				{user ? <p>{user?.username?.toUpperCase()}</p> : <p>Loading...</p>}
				<p className="text-muted-foreground">{userId}</p>
			</div>
		</div>
	)
}
