use serde_json::Value;

use crate::nodes::OutputNode;

pub struct JsonOutputNode;

impl OutputNode for JsonOutputNode {
    fn transform_output(&self, data: &Value) -> Result<String, Box<dyn std::error::Error>> {
        // Convert the internal JSON data into a string
        let s = serde_json::to_string(data)?;
        
        // If the conversion is successful, return the string
        Ok(s)
    }
}
