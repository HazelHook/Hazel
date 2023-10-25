"use client"

import { ImageUploadInput } from "@hazel/ui/image-upload-input"
import { TextField } from "@hazel/ui/text-field"

export type AvatarUploadProps = {
	image: string
}

export const AvatarUpload = ({ image }: AvatarUploadProps) => {
	return (
		<TextField>
			<TextField.Label>
				WOW
				{/* <Trans i18nKey={"profile:profilePictureLabel"} /> */}

				<ImageUploadInput
					// {...photoURLControl}
					multiple={false}
					// onClear={onAvatarCleared}
					image={image}
				>
					WOW2
					{/* <Trans i18nKey={"common:imageInputLabel"} /> */}
				</ImageUploadInput>
			</TextField.Label>
		</TextField>
	)
}
