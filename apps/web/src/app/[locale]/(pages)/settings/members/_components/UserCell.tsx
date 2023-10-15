import { AvatarImage, Avatar } from "@//components/ui/avatar"
import { getSeededProfileImageUrl } from "@//lib/utils"
import { User } from "@supabase/supabase-js"

export const UserCell = ({ user }: { user: User }) => {
	return (
		<div className="flex flex-row gap-2">
			<Avatar>
				<AvatarImage src={getSeededProfileImageUrl(user.id)} />
			</Avatar>
			<div>
				{user ? <p>{(user as any).raw_user_meta_data?.user_name?.toUpperCase()}</p> : <p>Loading...</p>}
				<p className="text-muted-foreground">{user.id}</p>
			</div>
		</div>
	)
}
