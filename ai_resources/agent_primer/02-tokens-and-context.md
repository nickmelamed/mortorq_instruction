# 02 - Tokens and Context 

## How do Agents use Tokens and Context? 

### Similarities with Chatbots 

Tokens are tokens, regardless of the application; they represent our currency for interacting with LLMs. 

Similarly, the context window, also known as the **working memory**, represents the conversation history that the chatbot or agent uses in the given interaction.

Context windows in both cases have limits; if the conversation surpasses those limits, the chatbot or agent will "forget" older messages in the conversation. **Compression** is used by both systems to create room for newer messages. Chatbots typically will delete the older messages, with some advanced bots summarizing older information to create room, whereas agents typically do summarization and may store some information externally. 

 As mentioned in our AI primer, this is because LLMs are stateless and do not maintain a record of information outside of the context window. Naturally, compression can cause problems like **context collapse**, where the model will forget key details in the interaction. 

Interestingly, LLMs also deal with a "lost in the middle problem", where they tend to recall information from beginnings/ends of interactions, but not as much in the middle. Repeating context, shortening context, or reordering inputs tend to mitigate this problem. 

### Context Windows and Memory 

There are some key differences in how agents handle context windows in comparison to chatbots. 

Chatbots typically don't have **memory**; they don't maintain any recollection of previous context windows. Agents typically store previous conversation context in external databases, which is then used via **retrieval augmented generation**, or RAG. RAG implies that the information is retrieved and used as context for LLMs to generate a response. Agents require external storage because they require more context, often surpassing the capabilities of the context window. 

