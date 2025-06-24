/// ModelProvider represents the different AI model providers supported by Sorai.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum ModelProvider {
    OpenAI,
    Anthropic,
    AzureOpenAI,
    Bedrock,
    Cohere,
    Vertex,
}
