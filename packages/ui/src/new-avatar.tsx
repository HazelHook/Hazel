import Avatar from "tw-avatar"

export type NewAvatarProps = {
	value: string
	size?: number
}

export const NewAvatar = ({ value, size }: NewAvatarProps) => {
	return <Avatar value={value} size={size} variant="shape" />
}
