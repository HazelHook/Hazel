
async fn test_json_serialization(mut req: Request, env: Env, _: Context) -> Result<Response> {
    let json_content: std::result::Result<RequestData, worker::Error> = req.json().await;

    if json_content.is_err() {
        let err = err_worker_error("Failed to parse request body", json_content.err().unwrap(), 400)?;
        return Ok(err);
    }

    let json_content = json_content.unwrap();

    
    let json_back_as_string = serde_json::to_string(&json_content).unwrap();
    let resp = Response::ok(json_back_as_string)?;

    Ok(resp)
}

async fn test_direct_return(mut req: Request, env: Env, _: Context) -> Result<Response> {
    let text_content = req.text().await;

    if text_content.is_err() {
        let err = err_worker_error("Failed to parse request body", text_content.err().unwrap(), 400)?;
        return Ok(err);
    }

    let resp = Response::ok(text_content.unwrap())?;

    Ok(resp)
}

fn stream_back(mut req: Request, env: Env, _: Context) -> Result<Response> {
    let stream = req.stream().unwrap();
    let resp = Response::from_stream(stream)?;
    Ok(resp)
}


// #[event(fetch)]
async fn main(mut req: Request, env: Env, ctx: Context) -> Result<Response> {
    let mut headers = Headers::new();
    let _ = headers.set("Content-Type", "application/json");

    let resp = stream_back(req, env, ctx).unwrap();
    let resp = resp.with_headers(headers);
    
    Ok(resp)
}
