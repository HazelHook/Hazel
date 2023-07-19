import { Request, Response } from "express";
import { storeToken } from "../lib/auth-token.js";
import { RequestClient } from "../lib/request-client.js";


export const handleOAuthCallback = (client: RequestClient, onSuccess: () => void) => async (req: Request, res: Response) => {
  res.writeHead(200, {
    "Content-Type": "text/html",
  });
  res.end(`
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>OAuth Success</title>
		
			<!-- Bootstrap CSS -->
			<link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" rel="stylesheet">
			<style>
				.center-screen {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					height: 100vh;
					text-align: center;
				}
				.btn {
					margin-top: 20px;
				}
			</style>
		</head>
		<body>
			<div class="center-screen">
				<h2 class="display-4">Authentication Successful!</h2>
				<p class="lead">You may now return to the application.</p>
			</div>
		</body>
		</html>
		
		`);

  const code = req.query["code"];

  // Call the backend to convert the code to a token
  const token = await client.post(
    `/v1/cli/token/${process.env["PORT"]}`,
    {
      token: code,
      token_type: "code",
    },
  );

  console.log("Ayy")
  console.log(token)
  await storeToken(token);

  onSuccess();
}
