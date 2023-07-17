import { AxiosInstance } from "axios";
import { storeToken } from "../token.js";
import { Request, Response } from "express";


export const oauthCallback = (client: AxiosInstance, onSuccess: () => void) => async (req: Request, res: Response) => {
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
  const token = await client.post(
    `http://127.0.0.1:3003/v1/oauth-token/${process.env["PORT"]}`,
    {
      token: code,
      token_type: "code",
    },
  );

  await storeToken({
    access_token: token.data.access_token,
    refresh_token: token.data.refresh_token,
    expires_in: token.data.expires_in,
  });

  onSuccess();
  return;
}
