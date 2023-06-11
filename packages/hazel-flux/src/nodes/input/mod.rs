use serde_json::Value;

use crate::config::RequestNode;

use super::{InputNode, ConfigurableInputNode};

mod json_input_node;
mod validated_json_input_node;

pub fn get_input_node(node: &RequestNode) -> Result<Box<dyn InputNode>, Box<dyn std::error::Error>> {
    let node_type = node.node_type.as_str();
    match node_type {
        "json" => Ok(Box::new(json_input_node::JsonInputNode)),
        "validated_json" => {
            let config: &Value = node.config.as_ref().unwrap();

            let input = validated_json_input_node::ValidatedJsonInputNode::configure(config)?;
            Ok(Box::new(input))
        }
        _ => panic!("Unknown input type: {}", node_type)
    }
}