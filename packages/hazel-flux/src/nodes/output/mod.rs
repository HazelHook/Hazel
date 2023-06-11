use crate::config::RequestNode;

use super::{OutputNode};

pub mod json_output_node;

pub fn get_output_node(node: &RequestNode) -> Result<Box<dyn OutputNode>, Box<dyn std::error::Error>> {
    let node_type = node.node_type.as_str();
    match node_type {
        "json" => Ok(Box::new(json_output_node::JsonOutputNode)),
        _ => panic!("Unknown output type: {}", node_type)
    }
}