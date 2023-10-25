import React, { useState, ChangeEvent, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { CloudUploadIcon } from "@hazel/icons"
import { toast } from "sonner"
import { cn } from "./utils"

type Ext = "jpg" | "jpeg" | "png" | "gif"

interface ImageUploadProps {
	className?: string
	initialImageUrl?: string
	generatedImgId: string
	onChange: (file: string, fileName: string, ext: Ext) => void
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ initialImageUrl, generatedImgId, onChange, className }) => {
	const [imageUrl, setImageUrl] = useState<string | undefined>(initialImageUrl)

	useEffect(() => {
		setImageUrl(initialImageUrl)
	}, [initialImageUrl])

	const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			console.log(file.size)

			if (file.size > 1024 * 1024) {
				toast.error("File size should not exceed 1MB.")
				return
			}

			const reader = new FileReader()
			reader.onloadend = () => {
				const base64String = (reader.result as string).split(",")[1]
				setImageUrl(reader.result as string)

				const fileExtension = file.name.split(".").pop() as Ext

				// Invoke the onChange handler with Base64 data
				onChange(base64String, file.name, fileExtension)
			}
			reader.readAsDataURL(file)
		}
	}

	return (
		<div className={cn("relative rounded-full w-24 h-24 overflow-hidden", className)}>
			<Avatar className="w-full h-full">
				<AvatarImage src={imageUrl || `https://avatar.vercel.sh/${generatedImgId}.png`} alt="Uploaded" />
			</Avatar>
			<label className="absolute transition-all duration-500 top-0 left-0 w-full h-full flex items-center justify-center cursor-pointer opacity-0 hover:bg-secondary hover:opacity-100">
				<input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
				<CloudUploadIcon className="w-12 h-12" />
			</label>
		</div>
	)
}
