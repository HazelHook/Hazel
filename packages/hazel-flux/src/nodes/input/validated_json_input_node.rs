use jsonschema::{JSONSchema};
use serde_json::{Value};

use crate::nodes::{ConfigurableInputNode, InputNode};


pub struct ValidatedJsonInputNode{
    schema: JSONSchema
}

impl InputNode for ValidatedJsonInputNode {
    fn transform_input(&self, data: &str) -> Result<Value, Box<dyn std::error::Error>> {
        let v: Value = serde_json::from_str(data)?;

        assert!(self.schema.is_valid(&v));

        Ok(v)
    }

    fn transform_input_dev(&self, data: &str) -> Result<Value, Box<dyn std::error::Error>> {
        let v: Value = serde_json::from_str(data)?;
        
        let result = self.schema.validate(&v);
        if let Err(errors) = result {
            for error in errors {
                println!("Validation error: {}", error);
                println!("Instance path: {}", error.instance_path);
            }
        }

        Ok(v.clone())
    }
}

impl ConfigurableInputNode for ValidatedJsonInputNode {
    fn configure(config: &Value) -> Result<ValidatedJsonInputNode, Box<dyn std::error::Error>> {
        let compiled = JSONSchema::compile(&config).unwrap();

        Ok(ValidatedJsonInputNode {
            schema: compiled
        })
    }
}
