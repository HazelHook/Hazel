use crate::config::RequestNode;

use super::TransformerNode;

mod uppercase_transform_node;
mod lowercase_transform_node;


pub fn get_transformer_node(node: &RequestNode) -> Result<Box<dyn TransformerNode>, Box<dyn std::error::Error>> {
    let node_type = node.node_type.as_str();
    match node_type {
        "uppercase" => Ok(Box::new(uppercase_transform_node::UppercaseTransformNode)),
        "lowercase" => Ok(Box::new(lowercase_transform_node::LowercaseTransformNode)),
        _ => panic!("Unknown transformer type: {}", node_type)
    }
}