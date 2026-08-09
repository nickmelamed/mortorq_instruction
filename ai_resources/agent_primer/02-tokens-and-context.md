# 02 - Tokens and Context 

## How do Agents use Tokens and Context? 

### Similarities with Chatbots 

Tokens are tokens, regardless of the application; they represent our currency for interacting with LLMs. 

Similarly, the context window, also known as the **working memory**, represents the conversation history that the chatbot or agent uses in the given interaction.

Context windows in both cases have limits; if the conversation surpasses those limits, the chatbot or agent will "forget" older messages in the conversation. **Compression** is used by both systems to create room for newer messages. Chatbots typically will delete the older messages, with some advanced bots summarizing older information to create room, whereas agents typically do summarization and may store some information externally. 

 As mentioned in our AI primer, this is because LLMs are stateless and do not maintain a record of information outside of the context window. Naturally, compression can cause problems like **context collapse**, where the model will forget key details in the interaction. 

Recall from the AI primer that LLMs also deal with a "lost in the middle problem", where they tend to recall information from beginnings/ends of interactions, but not as much in the middle. Repeating context, shortening context, or reordering inputs tend to mitigate this problem. 

### Context Windows and Memory 

There are some key differences in how agents handle context windows in comparison to chatbots. 

Chatbots typically don't have **memory**; they don't maintain any recollection of previous context windows. You might've seen in Claude or ChatGPT that it can recall facts from previous contexts, but this is still an agentic capability. Agents typically store previous conversation context in external databases, which is then used via **retrieval augmented generation**, or RAG. RAG implies that the information is retrieved and used as context for LLMs to generate a response. Agents require external storage because they require more context, often surpassing the capabilities of the context window. 

## Try It

This is a side-by-side test of the Lost in the Middle Effect mentioned above. You'll build one buried fact and one prominent fact, then see which one the model actually uses.

1. Pick a fake, specific fact the model couldn't already know, e.g. `Team 4930's robot is nicknamed "The Iron Giant."` \\
2. Write a long context block (15-20 sentences works) about an unrelated topic - anything is fine, e.g. a rambling description of how an FRC competition day is structured, match by match. Copy/generate filler if you'd like, it just needs to be long enough to bury a single sentence in. \\
3. Build **Version A**: paste the filler text with your fact sentence inserted dead in the *middle*, then ask at the end: "What is team 4930's robot nicknamed?" \\
4. Build **Version B**: identical filler text, but move the fact sentence to the very *start* (right before the filler begins), keeping the same question at the end. \\
5. Run both versions as fresh, separate conversations (not follow-up turns in the same chat) in the same model, and record both answers exactly as given.

Self-check:
- [ ] Both versions used the exact same filler text and the exact same question, only the fact's position changed
- [ ] I ran each version in a brand-new conversation, not as two turns in the same chat
- [ ] I can state whether the model got the fact right in Version A, in Version B, or both

If both versions got it right, the passage likely wasn't long enough to trigger the effect. Try roughly doubling the filler length and re-running Version A only. If you want a third data point, try a **Version C** with the fact at the very *end* instead of the start, and compare against A and B. And if that doesn't work, maybe chatbots are getting smarter than we give them credit for...

## Resources

- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401) - the original RAG paper, for the retrieval mechanism this module introduces (paper)

