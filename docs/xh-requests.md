# Example Requests

## Chat Completions

Create chat completions using conversational messages.

```sh
# Simple Chat
xh post localhost:8000/v1/chat/completions < docs/requests/chat-completions/simple-chat.json

# With Fallback Providers
xh post localhost:8000/v1/chat/completions < docs/requests/chat-completions/with-fallback-providers.json

# With Tool Calling
xh post localhost:8000/v1/chat/completions < docs/requests/chat-completions/with-tool-calling.json

# With Structured Content (text and image)
xh post localhost:8000/v1/chat/completions < docs/requests/chat-completions/with-structured-content.json
```

## Text Completions

Creates a text completion from a prompt. Useful for text generation, summarization, and other non-conversational tasks.

```sh
# Simple Text Completion
xh post localhost:8000/v1/text/completions < docs/requests/text-completions/simple-text-completions.json

# With Stop Sequences
xh post localhost:8000/v1/text/completions < docs/requests/text-completions/with-stop-sequences.json
```

## Monitoring

Monitoring and observability endpoints.

```sh
xh localhost:8000/metrics
```
