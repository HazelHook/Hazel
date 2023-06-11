use serde_json::{Value};
pub mod input;
pub mod output;
pub mod transform;

pub trait InputNode {
    fn transform_input(&self, data: &str) -> Result<Value, Box<dyn std::error::Error>>;
    fn transform_input_dev(&self, data: &str) -> Result<Value, Box<dyn std::error::Error>> {
        self.transform_input(data)
    }
}

// Returns a new instance of the input node with the given configuration or throws an error
pub trait ConfigurableInputNode: InputNode {
    fn configure(config: Value) -> Result<Self, Box<dyn std::error::Error>>
    where
        Self: Sized;
}

pub trait TransformerNode {
    fn transform_data(&self, data: &Value) -> Result<Value, Box<dyn std::error::Error>>;
    fn transform_data_dev(&self, data: &Value) -> Result<Value, Box<dyn std::error::Error>> {
        self.transform_data(data)
    }
}

pub trait OutputNode {
    fn transform_output(&self, data: &Value) -> Result<String, Box<dyn std::error::Error>>;
    fn transform_output_dev(&self, data: &Value) -> Result<String, Box<dyn std::error::Error>> {
        self.transform_output(data)
    }
}
