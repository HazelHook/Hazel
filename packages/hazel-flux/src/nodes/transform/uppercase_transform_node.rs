use serde_json::Value;

use crate::nodes::TransformerNode;

pub struct UppercaseTransformNode;

impl TransformerNode for UppercaseTransformNode {
    fn transform_data(&self, data: &Value) -> Result<Value, Box<dyn std::error::Error>> {
        self.uppercase_data(data).map_err(|e| e.into())
    }
}

impl UppercaseTransformNode {
    fn uppercase_data(&self, data: &Value) -> serde_json::Result<Value> {
        match data {
            Value::Object(map) => {
                let mut res = serde_json::Map::new();
                for (k, v) in map {
                    res.insert(k.to_uppercase(), self.uppercase_data(v)?);
                }
                Ok(Value::Object(res))
            }
            Value::Array(arr) => {
                let mut res = Vec::new();
                for v in arr {
                    res.push(self.uppercase_data(v)?);
                }
                Ok(Value::Array(res))
            }
            Value::String(s) => Ok(Value::String(s.to_uppercase())),
            _ => Ok(data.clone()), // For other types (number, boolean, null), just clone it
        }
    }
}