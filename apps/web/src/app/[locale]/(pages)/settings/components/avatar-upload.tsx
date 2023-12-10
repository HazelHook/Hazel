"use client"

import { ReactNode } from "react"
import { useRouter } from "next/navigation"

import { useAction } from "@hazel/server/actions/client"
import { TRPCActionHandler } from "@hazel/server/actions/trpc"
import Heading from "@hazel/ui/heading"
import { ImageUpload } from "@hazel/ui/image-upload"
import { toast } from "sonner"

export type AvatarUploadProps = {
	imageUrl?: string | null
	action: TRPCActionHandler<{
		input: {
			imageBuffer: string
			fileExt: "jpg" | "jpeg" | "png" | "gif" | "svg"
		}
		output: any
		errorShape: any
	}>
	generatedImgId: string
	children: ReactNode
}

export const AvatarUpload = ({ imageUrl, action, generatedImgId, children }: AvatarUploadProps) => {
	const router = useRouter()
	const { mutateAsync } = useAction(action, {
		onSuccess: () => {
			router.refresh()
		},
	})

	return (
		<div className="flex flex-row gap-6">
			<ImageUpload
				generatedImgId={generatedImgId}
				initialImageUrl={imageUrl!}
				onChange={(file, _, ext) => {
					toast.promise(
						mutateAsync({
							imageBuffer: file,
							fileExt: ext,
						}),
						{
							loading: "Uploading new Image...",
							success: "Sucessfully uploaded new Image",
							error: "There was an error uploading your new image...",
						},
					)
				}}
			/>
			<div>
				<Heading type={3}>{children}</Heading>
				<p className="text-muted-foreground text-sm">
					Click on the avatar to upload a custom one from your files.
					<br />
					Square image recommended. Accepted file types: .png, .jpg. Max file size: 1MB.
				</p>
			</div>
		</div>
	)
}
