import {
	Body,
	Button,
	Column,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Row,
	Section,
	Tailwind,
	Text,
} from "@react-email/components"
import * as React from "react"

interface VercelInviteUserEmailProps {
	username: string
	userImage: string
	invitedByUsername: string
	invitedByEmail: string
	teamName: string
	teamImage: string
	inviteLink: string
}

const baseUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "https://hazel-git-feat-emails-maple-analytics.vercel.app"

export const OrganizationInviteEmail = ({
	username,
	userImage,
	invitedByUsername,
	invitedByEmail,
	teamName,
	teamImage,
	inviteLink,
}: VercelInviteUserEmailProps) => {
	const previewText = `Join ${invitedByUsername} on Hazel`

	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className="bg-white my-auto mx-auto font-sans">
					<Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
						<Section className="mt-[32px]">
							<Img src={`${baseUrl}/assets/avatar.png`} width="80" height="80" alt="Hazel" className="my-0 mx-auto" />
						</Section>
						<Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
							Join <strong>{teamName}</strong> on <strong>Hazel</strong>
						</Heading>
						<Text className="text-black text-[14px] leading-[24px]">Hello {username},</Text>
						<Text className="text-black text-[14px] leading-[24px]">
							<strong>{invitedByUsername}</strong> (
							<Link href={`mailto:${invitedByEmail}`} className="text-blue-600 no-underline">
								{invitedByEmail}
							</Link>
							) has invited you to the <strong>{teamName}</strong> team on <strong>Hazel</strong>.
						</Text>
						<Section>
							<Row>
								<Column align="right">
									<Img className="rounded-full" src={userImage} width="64" height="64" />
								</Column>
								<Column align="center">
									<Img src={`${baseUrl}/assets/arrow.png`} width="12" height="9" alt="invited you to" />
								</Column>
								<Column align="left">
									<Img className="rounded-full" src={teamImage} width="64" height="64" />
								</Column>
							</Row>
						</Section>
						<Section className="text-center mt-[32px] mb-[32px]">
							<Button
								pX={20}
								pY={12}
								className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center"
								href={inviteLink}
							>
								Join the team
							</Button>
						</Section>
						<Text className="text-black text-[14px] leading-[24px]">
							or copy and paste this URL into your browser:{" "}
							<Link href={inviteLink} className="text-blue-600 no-underline">
								{inviteLink}
							</Link>
						</Text>
						<Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
						<Text className="text-[#666666] text-[12px] leading-[24px]">
							If you were not expecting this invitation, you can safely ignore this email. If you are concerned about
							your account's safety, please reply to this email to get in touch with us.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}

export default OrganizationInviteEmail
