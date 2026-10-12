# GenAI Architecture Resource Page

Every AI model this curriculum has used so far has been treated as a black box you talk to, not something we build. 

This primer opens that box. It turns out there's nothing inside it that isn't
already built from pieces this curriculum covered: matrices and dot products
(`linear_algebra_primer`), layers, activation functions, and backpropagation
(`deep_learning_primer`). What's new is a specific way of arranging those pieces (as Transformers) and the two ideas bolted on: turning text into numbers, and turning numbers back into text.

## What is GenAI Architecture?

"GenAI" (Generative AI) covers models that produce original content. This primer covers the  specific architecture almost every current GenAI model is built on. We dive into how raw text becomes tokens, how tokens (and, eventually, image patches) become vectors, and how those vectors get transformed by attention into whatever comes next; whether that's generated text, a retrieved document, or a response grounded in a picture.

## Why should I care?

You've been using the vocabulary this primer explains without the mechanism behind it. `ai_primer/01-context-is-key.md` already told you tokens are the unit you're billed in and pointed you at the OpenAI Tokenizer tool to watch text get split into tokens. In this unit, you'll build a basic tokenizer. `agent_primer/02-tokens-and-context.md` already told you about the "Lost in the Middle Effect". In this primer, you'll see how attention suffers from this problem even though it can theoretically see every token. `agent_primer/06-memory-systems.md` already told you agents retrieve relevant information via RAG whenever it can't all fit in context. This primer is where "relevant" stops being a black box and becomes a real, computable number. And `ai_primer`'s own definition of a prompt as "text, an image, or a combination" has been asking you to take multimodal input on faith since early in this curriculum. This primer is where that combination gets built, out of the exact same attention mechanism, not a separate one bolted on for pictures.

## Key Terms

A running glossary of vocabulary introduced across this primer, in the order you'll
meet it. See also the [linear_algebra_primer](../linear_algebra_primer/README.md)
glossary for Matrix-Vector Product and Matrix Multiplication, and the
[deep_learning_primer](../deep_learning_primer/README.md) glossary for Softmax and
Regression Head, which this primer's attention mechanism and transformer block are
built from directly.

- **Token**: the smallest unit of text a language model actually processes. It is not
  always a whole word, sometimes a sub-word piece or a single character.
- **Tokenization**: the process of splitting raw text into tokens.
- **Byte-Pair Encoding (BPE)**: the tokenization algorithm most real language models use: starting from individual characters, repeatedly merging the most frequent adjacent pair into a new token.
- **Vocabulary**: the fixed set of every token a model knows, each with its own integer ID.
- **Embedding**: a learned vector representation of a token; similar tokens end up
  with similar vectors.
- **Embedding Matrix**: the matrix whose rows are every token's embedding; looking up a token's embedding is a single row index into this matrix.
- **Positional Encoding**: information added to each token's embedding indicating
*where* in the sequence it is, since attention alone has no built-in sense of order.
- **Query, Key, Value (Q, K, V)**: three different linear projections of the same input embeddings, used together to compute attention.
- **Attention Score**: a single number measuring how relevant one token's Key is to another token's Query.
- **Attention Weight**: an attention score after softmax, turning a row of scores into a probability distribution over which tokens to attend to.
- **Self-Attention**: attention where the Queries, Keys, and Values all come from the
  same sequence. Every token is looking at every other token in the same input.
- **Scaled Dot-Product Attention**: the specific self-attention formula real
  Transformers use, scaling the raw dot-product scores down before the softmax.
- **Multi-Head Attention**: running several independent attention computations in
  parallel ("heads"), each potentially learning to attend to different kinds of
  relationships, then combining their outputs.
- **Residual Connection**: adding a layer's input back onto its output, so the layer
  only has to learn a *change* to make, not the whole transformation from scratch.
- **Layer Normalization**: rescaling a layer's output to have consistent scale before
  it's passed to the next layer, stabilizing training in a deep network.
- **Transformer**: the full architecture! Tokens turned into embeddings plus positional encodings, passed through a stack of N Transformer Blocks, with an output head on top that turns the final vectors into a probability distribution over the vocabulary.
- **Transformer Block**: one repeatable unit of a Transformer. It is a multi-head attention plus a feedforward network, each wrapped with a residual connection.
- **Autoregressive Generation**: generating one token at a time, feeding each generated token back in as part of the input for generating the next one.
- **Causal Mask**: a rule preventing a token's attention from looking at tokens that
  come after it, so a model generating text can't "see the future" of its own output.
- **Encoder**: a Transformer with no causal mask, where every token attends to the whole input in both directions. Built for understanding complete text (classification, embeddings, retrieval). BERT and sentence-embedding models are encoder-only.
- **Decoder**: a Transformer with a causal mask, trained to predict the next token and run one token at a time to generate text. GPT, Claude, and Llama are decoder-only.
- **Encoder-Decoder**: an encoder reads the input, then a decoder generates the output while attending to the encoder's result through cross-attention. The original 2017 Transformer and T5 work this way; common for translation and summarization.
- **Cross-Attention**: attention where the Queries come from one sequence (the decoder's tokens so far) and the Keys and Values come from another (the encoder's output).
- **Temperature**: a knob that rescales a probability distribution before sampling from it. Above 1 flattens it (more randomness), below 1 sharpens it (closer to greedy), with the effect only visible once the underlying distribution isn't already near-certain.
- **Instruction Fine-Tuning**: an additional training stage, on top of next-token- prediction pretraining, on examples that specifically look like `instruction -> helpful response` pairs. It is part of what turns a raw text-continuation model into a chat assistant.
- **Supervised Fine-Tuning (SFT)**: the mechanical name for instruction fine-tuning. It is continuing next-token training on `instruction -> response` demonstrations, with the loss counted only on the response tokens, not the prompt.
- **Chat Template**: the fixed wrapper a chat interface puts around your text (role markers like a "the assistant's turn starts here" token) before the model sees it.
- **RLHF (Reinforcement Learning from Human Feedback)**: an additional training stage using the same Reinforcement Learning family as `ml_resources/rl_primer`: people compare pairs of responses, a reward model learns to score responses the way they would, and the language model is then optimized to earn higher scores.
- **Reward Model**: a network trained on human preference pairs to score a (prompt response) pair with one number; a stand-in for human judgment that an optimizer can query thousands of times.
- **Preference Pair**: one prompt with two responses, labeled with which one a person preferred. It is the unit of data a reward model trains on.
- **Best-of-n**: sampling n responses and keeping the one the reward model scores highest; improves outputs without changing any weights, at n times the generation cost.
- **KL Penalty**: a term subtracting from the reward how far the model's token probabilities have drifted from a frozen reference model, so optimizing against an imperfect reward model can't drag the model arbitrarily far.
- **Cosine Similarity**: the dot product of two vectors divided by the product of their magnitudes. It is a bounded score (-1 to 1) that compares vectors by direction alone, regardless of length, and the actual mechanism a RAG system uses to decide what's "relevant."
- **Vector Database**: a system (FAISS, pgvector, Pinecone, and similar) built to store embeddings and search them by similarity at a scale brute-force comparison can't keep up with.
- **Approximate Nearest Neighbor (ANN)**: an indexing strategy that finds (most of) the best-matching vectors for a query in sub-linear time, trading a small amount of retrieval accuracy for a large speedup over comparing against every stored vector.
- **Chunking**: splitting source text into smaller pieces (a paragraph, a match report) before embedding each one separately, so retrieval can return a specific, right-sized piece of text instead of an entire document or an orphaned fragment.
- **Patch Embedding**: the image equivalent of a token embedding. It is an image split into small fixed-size squares, each flattened and projected through one learned matrix into a vector of the same width as a text token embedding.
- **Vision Transformer (ViT)**: a Transformer applied to a sequence of patch embeddings instead of token embeddings. It is the same attention mechanism, with image input instead of text.
- **Multimodal Model**: a model that accepts more than one kind of input (e.g. text and images) by projecting every modality into the same shared embedding space, so one attention computation can relate a word to a patch of an image the same way it relates one word to another.
- **Imitation Learning**: training a model to reproduce an expert's behavior from demonstrations (observation and action pairs) instead of from a reward signal. **Behavior Cloning** is the simplest version: plain supervised learning on the expert's actions.
- **Diffusion Model**: a generative model trained by corrupting real data with noise step by step (the **forward process**), then learning to undo each step (the **reverse process**); generation starts from pure noise and removes it step by step.
- **Denoiser**: the network a diffusion model trains, which looks at a noisy input (and how noisy it is) and predicts the noise that was added.
- **Diffusion Policy**: a robot policy that uses the diffusion loop to generate a sequence of actions, conditioned on camera images and robot state, instead of generating pixels.
- **Action Tokenization**: dividing a continuous action's range into bins and giving each bin an integer token ID, so a robot's output can be generated by the same next-token machinery as text.
- **Vision-Language-Action (VLA) Model**: a multimodal Transformer that takes images and a text instruction as input and produces robot actions as output, either as tokens or through a diffusion-style action head.

## What's in this Primer?

Read these in order:

1. [01 - Tokenization and Embeddings](01-tokenization-and-embeddings.ipynb) - building
   a small Byte-Pair Encoding tokenizer from scratch, and turning token IDs into
   vectors
2. [02 - The Attention Mechanism](02-attention-mechanism.ipynb) - scaled dot-product
   self-attention, built and visualized from scratch
3. [03 - The Transformer Block, and Why This Won](03-transformer-block-and-history.ipynb) -
   assembling multi-head attention and a feedforward network into one repeatable block,
   plus the actual history of why this architecture displaced what came before it
4. [04 - Generation, and Why Chat Models Behave](04-generation-and-why-chat-models-behave.ipynb) -
   a classification head over the vocabulary, a real toy next-word predictor, the
   autoregressive generation loop, temperature sampling, and why a chat model answers
   questions instead of just continuing them
5. [05 - Post-Training: Instruction Fine-Tuning and RLHF](05-post-training-instruction-tuning-and-rlhf.ipynb) -
   a base model that answers questions with more questions, fine-tuned into one that
   answers, then a reward model trained from preference pairs, best-of-n selection, and a
   policy-gradient update with a KL penalty that improves the answers it gives
6. [06 - Embeddings for Retrieval: The Architecture Behind RAG](06-embeddings-for-retrieval.ipynb) -
   cosine similarity, a hand-designed semantic search demo that beats naive keyword
   search, and why real retrieval systems chunk documents and use approximate indexes
7. [07 - Multimodal Architecture: One Shared Space for More Than Text](07-multimodal-and-shared-embedding-spaces.ipynb) -
   patch embeddings, a real cross-modal attention demo fusing text and image tokens in
   one sequence, and how this contrasts with `cv_primer`'s convolution
8. [08 - Beyond Text: Diffusion and Action Outputs](08-beyond-text-diffusion-and-actions.ipynb) -
   why a regression head averages a robot's two valid routes into a crash, a diffusion
   model trained from scratch that keeps both, and the other route real systems take:
   turning actions into tokens (the idea behind vision-language-action models)

## Where This Goes Next

This primer stops at toy-scale versions of pretraining, generation, retrieval, and
multimodal fusion. It does not train a real language model, run a production vector
database, or post-train anything at production scale (that takes a training corpus, a
vocabulary of tens of thousands of tokens, real ANN infrastructure, thousands of human preference labels, and far more compute than a classroom notebook can reasonably use). 

`05` does build instruction fine-tuning and a miniature RLHF loop, but on a twelve-token language with a rule standing in for human raters, and with plain policy gradient rather than the PPO or DPO that real systems use. Image *generation* appears only through `08`'s toy diffusion model on robot trajectories, not at real image scale. Elsewhere, images are only *understanding*, as one more input a Transformer can attend over. 

What you get here is what's actually inside the chatbots, RAG-backed agents, and multimodal tools this curriculum has been using all along, demystified down to matrices, dot products, and softmax you've already built by hand. It is not a new kind of math, just a new way of arranging the math you already know.

`07`'s own closing section promises this architecture is what would let the scouting
agent reason over match film and photos, not just text and stats, once it's wired in
for real. That wiring is covered in `ai_resources/agent_primer/14-multimodal-match-film-analysis.md`, an optional extension of the existing `agent_primer` capstone rather than new content in this primer.
