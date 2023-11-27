import { getSeededProfileImageUrl } from "@/lib/utils"

import { User } from "@hazel/db"
import { Avatar, AvatarImage } from "@hazel/ui/avatar"

export const UserCell = ({ user }: { user: User }) => {
	return (
		<div className="flex flex-row gap-2">
			<Avatar>
				<AvatarImage src={getSeededProfileImageUrl(user?.id)} />
			</Avatar>
			<div>
				{user ? <p>{user.name?.toUpperCase()}</p> : <p>Loading...</p>}
				<p className="text-muted-foreground">{user?.id}</p>
			</div>
		</div>
	)
}
