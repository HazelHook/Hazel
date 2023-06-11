use crate::nodes;
use nodes::input::get_input_node;
use nodes::output::get_output_node;
use nodes::transform::get_transformer_node;
use nodes::{InputNode, TransformerNode, OutputNode};
use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Serialize, Deserialize)]
pub struct RequestNode {
    pub node_type: String,
    pub config: Option<Value>
}

#[derive(Serialize, Deserialize)]
pub struct RequestConfig {
    pub input_node: RequestNode,
    pub output_node: RequestNode,
    pub transformer_nodes: Vec<RequestNode>
}

pub struct ResolvedConfig {
    pub input_node: Box<dyn InputNode>,
    pub output_node: Box<dyn OutputNode>,
    pub transformer_nodes: Vec<Box<dyn TransformerNode>>,
}

pub fn prepare(config: RequestConfig) -> Result<ResolvedConfig, Box<dyn std::error::Error>> {

    let input_node = get_input_node(&config.input_node)?;
    let output_node = get_output_node(&config.output_node)?;

    let mut transformer_nodes: Vec<Box<dyn TransformerNode>> = Vec::new();
    for transformer in config.transformer_nodes.iter() {
        let transformer_node = get_transformer_node(&transformer)?;

        transformer_nodes.push(transformer_node);
    }

    Ok(ResolvedConfig {
        input_node,
        output_node,
        transformer_nodes,
    })
}