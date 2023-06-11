use jsonschema::{JSONSchema};
use serde_json::{Value};
use worker::{console_log, console_error};

use crate::nodes::{ConfigurableInputNode, InputNode};

pub struct ValidatedJsonInputNode{
    schema: JSONSchema
}


impl InputNode for ValidatedJsonInputNode {
    fn transform_input(&self, data: &Value) -> Result<Value, Box<dyn std::error::Error>> {
        let json_data = serde_json::from_str(data.to_string().as_str())?;
        console_log!("Validating json data: {}", json_data);

        let result = self.schema.validate(&json_data);
        if result.is_err() {
            console_error!("Validation error");
        }
        if result.is_ok() {
            console_log!("Validation success");
        }

        if let Err(errors) = result {
            for error in errors {
                console_error!("Validation error: {}", error);
                console_error!("Instance path: {}", error.instance_path);
            }

            return Err(Box::new(std::io::Error::new(std::io::ErrorKind::InvalidData, "Validation error")));
        }

        Ok(json_data.clone())
    }
}

impl ConfigurableInputNode for ValidatedJsonInputNode {
    fn configure(config: Value) -> Result<ValidatedJsonInputNode, Box<dyn std::error::Error>> {
        let schema = config.get("schema").unwrap();

        console_log!("Configuring validated json input node: {}", schema);

        let compiled = JSONSchema::compile(schema)
            .expect("A valid schema");

        Ok(ValidatedJsonInputNode {
            schema: compiled
        })
    }
}