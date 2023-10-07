export default {
	auth: {
		signUpHeading: "Create an account",
		signUp: "Sign Up",
		signInHeading: "Sign in to your account",
		signIn: "Sign In",
		getStarted: "Get started",
		signOut: "Sign out",
		signingIn: "Signing in...",
		signingUp: "Signing up...",
		orContinueWithEmail: "or continue with email",
		doNotHaveAccountYet: "Do not have an account yet?",
		alreadyHaveAnAccount: "Already have an account?",
		joinOrganizationHeading: "Join {organization}",
		joinOrganizationSubHeading: "You were invited to join <b>{organization}</Bold>",
		signUpToAcceptInvite: "Please sign in/up to accept the invite",
		clickToAcceptAs: "Click the button below to accept the invite with as <b>{email}</b>",
		acceptInvite: "Accept invite",
		acceptingInvite: "Accepting Invite...",
		acceptInviteSuccess: "Invite successfully accepted",
		acceptInviteError: "Error encountered while accepting invite",
		acceptInviteWithDifferentAccount: "Want to accept the invite with a different account?",
		alreadyHaveAccountStatement: "I already have an account, I want to sign in instead",
		doNotHaveAccountStatement: "I do not have an account, I want to sign up instead",
		addingToOrganization: "We are adding you to <b>{name}</b>. Please Wait...",
		signInWithProvider: "Sign in with {provider}",
		signInWithPhoneNumber: "Sign in with Phone Number",
		passwordHint: "Ensure it's at least 6 characters",
		repeatPasswordHint: "Type your password again",
		repeatPassword: "Repeat password",
		passwordsDoNotMatch: "The passwords do not match",
		passwordForgottenQuestion: "Password forgotten?",
		passwordResetLabel: "Reset Password",
		passwordResetSubheading: "Enter your email address below. You will receive a link to reset your password.",
		passwordResetSuccessMessage: "Check your Inbox! We emailed you a link for resetting your Password.",
		passwordRecoveredQuestion: "Password recovered?",
		passwordLengthError: "Please provide a password with at least 6 characters",
		sendEmailLink: "Send Email Link",
		sendingEmailLink: "Sending Email Link...",
		sendLinkSuccess: "We sent you a link to your email! Follow the link to sign in.",
		sendLinkSuccessToast: "Link successfully sent",
		getNewLink: "Get a new link",
		verificationCode: "Verification Code",
		verificationCodeHint: "Enter the code we sent you by SMS",
		verificationCodeSubmitButtonLabel: "Submit Verification Code",
		sendingMfaCode: "Sending Verification Code...",
		verifyingMfaCode: "Verifying code...",
		sendMfaCodeError: "Sorry, we couldn't send you a verification code",
		verifyMfaCodeSuccess: "Code verified! Signing you in...",
		verifyMfaCodeError: "Ops! It looks like the code is not correct",
		reauthenticate: "Reauthenticate",
		reauthenticateDescription: "For security reasons, we need you to re-authenticate",
		errorAlertHeading: "Sorry, we could not authenticate you",
		emailConfirmationAlertHeading: "We sent you a confirmation email.",
		emailConfirmationAlertBody: "Welcome! Please check your email and click the link to verify your account.",
		errors: {
			"Invalid login credentials": "The credentials entered are invalid",
			"User already registered": "This credential is already in use. Please try with another one.",
			"Email not confirmed": "Please confirm your email address before signing in",
			default: "We have encountered an error. Please ensure you have a working internet connection and try again",
			generic: "Sorry, we weren't able to authenticate you. Please try again.",
			link: "Sorry, we encountered an error while sending your link. Please try again.",
		},
	},
	common: {
		dashboardTabLabel: "Dashboard",
		organizationSettingsTabLabel: "Organization",
		settingsTabLabel: "Settings",
		profileSettingsTabLabel: "Profile",
		subscriptionSettingsTabLabel: "Subscription",
		emailAddress: "Email Address",
		password: "Password",
		modalConfirmationQuestion: "Are you sure you want to continue?",
		imageInputLabel: "Click here to upload an image",
		cancel: "Cancel",
		backToHomePage: "Back to Home Page",
		genericServerError: "Sorry, something went wrong.",
		genericServerErrorHeading:
			"Sorry, something went wrong while processing your request. Please contact us if the issue persists.",
		pageNotFound: "Ops. Page not Found.",
		pageNotFoundSubHeading: "Apologies, the page you were looking for was not found",
		genericError: "Oooops. An error occurred",
		anonymousUser: "Anonymous",
		theme: "Theme",
		lightTheme: "Light",
		darkTheme: "Dark",
		systemTheme: "System",
		expandSidebar: "Expand Sidebar",
		collapseSidebar: "Collapse Sidebar",
		documentation: "Documentation",
		getStarted: "Get Started",
		retry: "Retry",
		contactUs: "Contact Us",
		loading: "Loading",
		genericErrorSubHeading:
			"Apologies, an error occurred while processing your request. Please contact us if the issue persists.",
		roles: {
			owner: {
				label: "Owner",
				description: "Can change any setting, invite new members and manage billing",
			},
			admin: {
				label: "Admin",
				description: "Can change some settings, invite members, perform disruptive actions",
			},
			member: {
				label: "Member",
				description: "Cannot invite members or change settings",
			},
		},
	},
	profile: {
		generalTab: "My Details",
		generalTabSubheading: "Manage your profile details",
		emailTab: "Email",
		emailTabTabSubheading: "Update your email address",
		passwordTab: "Password",
		passwordTabSubheading: "Update your password",
		manageConnectedAccounts: "Connected Accounts",
		manageConnectedAccountsSubheading: "Manage your connected accounts",
		connectedAccounts: "Connected Accounts",
		authenticationTab: "Authentication",
		multiFactorAuth: "Multi-Factor Authentication",
		multiFactorAuthSubheading: "Set up a MFA method to secure your account",
		connectedAccountsSubheading: "Below are the accounts linked to your profile",
		availableProviders: "Available Providers",
		availableProvidersSubheading: "Click on the providers below to link your profile to the provider",
		updateProfileSuccess: "Profile successfully updated",
		updateProfileError: "Encountered an error. Please try again",
		updatePasswordSuccess: "Password update request successful",
		updatePasswordSuccessMessage: "Your password has been successfully updated!",
		updatePasswordError: "Encountered an error. Please try again",
		updatePasswordLoading: "Updating password...",
		updateProfileLoading: "Updating profile...",
		displayNameLabel: "Your Name",
		emailLabel: "Email Address",
		profilePictureLabel: "Your Photo",
		updateProfileSubmitLabel: "Update Profile",
		currentPassword: "Current Password",
		newPassword: "New Password",
		repeatPassword: "Repeat New Password",
		yourPassword: "Your Password",
		updatePasswordSubmitLabel: "Update Password",
		newEmail: "Your New Email",
		repeatEmail: "Repeat Email",
		updateEmailSubmitLabel: "Update Email Address",
		updateEmailSuccess: "Email update request successful",
		updateEmailSuccessMessage:
			"We sent you an email to confirm your new email address. Please check your inbox and click on the link to confirm your new email address.",
		updateEmailLoading: "Updating your email...",
		updateEmailError: "Email not updated. Please try again",
		passwordNotMatching: "Passwords do not match. Make sure you're using the correct password",
		passwordNotChanged: "Your password has not changed",
		emailsNotMatching: "Emails do not match. Make sure you're using the correct email",
		updatingSameEmail: "The email chosen is the same as your current one",
		cannotUpdateEmail: "You cannot update your email because your account is not linked to any.",
		cannotUpdatePassword: "You cannot update your password because your account is not linked to any.",
		unlinkActionLabel: "Unlink",
		unlinkAccountModalHeading: "Unlink Account",
		confirmUnlink: "You're about to unlink this account.",
		confirmUnlinkSubmitLabel: "Yep, Unlink Account",
		unlinkActionSuccess: "Account successfully unlinked",
		unlinkActionError: "Sorry, we couldn't unlink this account",
		unlinkActionLoading: "Unlinking account...",
		linkActionSuccess: "Account successfully linked",
		linkActionError: "Sorry, we couldn't link this account",
		linkActionLoading: "Linking account...",
		linkAccount: "Link Account",
		connectWithProvider: "Connect with {{ provider }}",
		connectedWithProvider: "Connected with {{ provider }}",
		setupMfaButtonLabel: "Setup a new Factor",
		multiFactorSetupError: "Sorry, there was an error while setting up your factor. Please try again.",
		multiFactorAuthHeading: "Secure your account with Multi-Factor Authentication",
		multiFactorAuthDescription:
			"Enable Multi-Factor Authentication to verify your identity for an extra layer of security to your account in case your password is stolen. In addition to entering your password, it requires you confirm your identity via SMS.",
		multiFactorModalHeading: "Use your phone to scan the QR code below. Then enter the code generated.",
		factorNameLabel: "A memorable name to identify this factor",
		factorNameHint: "Use an easy-to-remember name to easily identify this factor in the future. Ex. iPhone 14",
		factorNameSubmitLabel: "Set factor name",
		unenrollTooltip: "Unenroll this factor",
		unenrollingFactor: "Unenrolling factor...",
		unenrollFactorSuccess: "Factor successfully unenrolled",
		unenrollFactorError: "Unenrolling factor failed",
		factorsListError: "Error loading factors list",
		factorName: "Factor Name",
		factorType: "Type",
		factorStatus: "Status",
		mfaEnabledSuccessTitle: "Multi-Factor authentication is enabled",
		mfaEnabledSuccessDescription:
			"Congratulations! You have successfully enrolled in the multi factor authentication process. You will now be able to access your account with a combination of your password and an authentication code sent to your phone number.",
		verificationCode: "Verification Code",
		addEmailAddress: "Add Email address",
		updatePhoneNumber: "Update Phone Number",
		updatePhoneNumberSubheading: "Link your phone number to your account",
		updatePhoneNumberLoading: "Updating phone number...",
		updatePhoneNumberSuccess: "Phone number successfully updated",
		updatePhoneNumberError: "Sorry, we weren't able to update your phone number",
		phoneNumberLabel: "Phone Number",
		addPhoneNumber: "Add Phone Number",
		removePhoneNumber: "Remove Phone Number",
		confirmRemovePhoneNumberDescription:
			"You're about to remove your phone number. You will not be able to use it to login to your account.",
		confirmRemovePhoneNumber: "Yes, remove phone number",
		verifyActivationCodeDescription: "Enter the verification code generated by your authenticator app",
		loadingFactors: "Loading factors...",
		enableMfaFactor: "Enable Factor",
		disableMfaFactor: "Disable Factor",
		qrCodeError: "Sorry, we weren't able to generate the QR code",
		multiFactorSetupSuccess: "Factor successfully enrolled",
		submitVerificationCode: "Submit Verification Code",
		mfaEnabledSuccessAlert: "Multi-Factor authentication is enabled",
		verifyingCode: "Verifying code...",
		invalidVerificationCode: "Invalid verification code. Please try again",
		unenrollFactorModalHeading: "Unenroll Factor",
		unenrollFactorModalBody:
			"You're about to unenroll this factor. You will not be able to use it to login to your account.",
		unenrollFactorModalButtonLabel: "Yes, unenroll factor",
		selectFactor: "Choose a factor to verify your identity",
		disableMfa: "Disable Multi-Factor Authentication",
		disableMfaButtonLabel: "Disable MFA",
		confirmDisableMfaButtonLabel: "Yes, disable MFA",
		disablingMfa: "Disabling Multi-Factor Authentication. Please wait...",
		disableMfaSuccess: "Multi-Factor Authentication successfully disabled",
		disableMfaError: "Sorry, we encountered an error. MFA has not been disabled.",
		sendingEmailVerificationLink: "Sending Email...",
		sendEmailVerificationLinkSuccess: "Verification link successfully sent",
		sendEmailVerificationLinkError: "Sorry, we weren't able to send you the email",
		sendVerificationLinkSubmitLabel: "Send Verification Link",
		sendVerificationLinkSuccessLabel: "Email sent! Check your Inbox",
		verifyEmailAlertHeading: "Please verify your email to enable MFA",
		verifyPhoneNumberSubmitLabel: "TODO",
		verificationLinkAlertDescription:
			"Your email is not yet verified. Please verify your email to be able to set up Multi-Factor Authentication.",
		authFactorName: "Factor Name (optional)",
		authFactorNameHint: "Assign a name that helps you remember the phone number used",
		loadingUser: "Loading user details. Please wait...",
		linkPhoneNumber: "Link Phone Number",
	},
} as const
