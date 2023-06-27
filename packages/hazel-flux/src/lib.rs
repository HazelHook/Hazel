use config::{prepare, RequestConfig, ResolvedConfig};
use serde::{Deserialize, Serialize};
use serde_json::{Value};
use worker::*;

mod config;
pub mod nodes;

fn transform_prod(
    config: &ResolvedConfig,
    data: &Value,
) -> core::result::Result<String, Box<dyn std::error::Error>> {
    let mut transformed = config.input_node.transform_input(&data)?;
    for transformer in config.transformer_nodes.iter() {
        transformed = transformer.transform_data(&transformed)?;
    }

    config.output_node.transform_output(&transformed)
}

fn transform_dev(
    config: &ResolvedConfig,
    data: &Value,
) -> core::result::Result<String, Box<dyn std::error::Error>> {
    let mut transformed = config.input_node.transform_input_dev(&data)?;

    for transformer in config.transformer_nodes.iter() {
        transformed = transformer.transform_data_dev(&transformed)?;
    }

    config.output_node.transform_output_dev(&transformed)
}

#[derive(Serialize, Deserialize)]
struct RequestData {
    data: Value,
    config: RequestConfig,
}

fn err_worker_error(message: &str, error: Error, code: u16) -> Result<Response> {
    Response::error(
        format!(
            "{{\"error\": \"{}\", \"message\": \"{}\"}}",
            message,
            error.to_string()
        ),
        code,
    )
}
fn err_std_error(message: &str, error: Box<dyn std::error::Error>, code: u16) -> Result<Response> {
    Response::error(
        format!(
            "{{\"error\": \"{}\", \"message\": \"{}\"}}",
            message,
            error.to_string()
        ),
        code,
    )
}
fn err_string(message: &str, error: &str, code: u16) -> Result<Response> {
    Response::error(
        format!("{{\"error\": \"{}\", \"message\": \"{}\"}}", message, error),
        code,
    )
}

#[event(fetch)]
async fn main(mut req: Request, env: Env, _: Context) -> Result<Response> {
    let mut headers = Headers::new();
    let _ = headers.set("Content-Type", "application/json");

    let dev = env.var("environment");

    if dev.is_err() {
        let err = err_string(
            "Failed to get environment variable",
            "Internal Server Error",
            500,
        )?;
        return Ok(err.with_headers(headers));
    }

    let data: std::result::Result<RequestData, worker::Error> = req.json().await;

    if data.is_err() {
        let err = err_worker_error("Failed to parse request body", data.err().unwrap(), 400)?;
        return Ok(err.with_headers(headers));
    }

    let data = data.unwrap();

    let config = prepare(data.config);

    if config.is_err() {
        let err = err_std_error("Failed to parse config", config.err().unwrap(), 400)?;
        return Ok(err.with_headers(headers));
    }
    let config = config.unwrap();

    let output = if dev.unwrap().to_string() == "prod" {
        transform_prod(&config, &data.data)
    } else {
        transform_dev(&config, &data.data)
    };
    if output.is_err() {
        let err = err_std_error("Failed to transform data", output.err().unwrap(), 500)?;
        return Ok(err.with_headers(headers));
    }

    let resp = Response::ok(output.unwrap())?;

    let resp = resp.with_headers(headers);

    Ok(resp)
}

   