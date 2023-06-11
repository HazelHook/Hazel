use serde_json::Value;
use crate::nodes::InputNode;

pub struct JsonInputNode;

impl InputNode for JsonInputNode {
    fn transform_input(&self, data: &Value) -> Result<Value, Box<dyn std::error::Error>> {
        let v: Value = serde_json::from_str(data.to_string().as_str())?;
        
        Ok(v)
    }
}