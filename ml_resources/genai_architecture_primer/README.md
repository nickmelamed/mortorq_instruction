# GenAI Architecture Resource Page

Every model this curriculum has used so far - the chatbots in `ai_primer`, the agents in
`agent_primer` - has been treated as a black box you talk to, not something you could
build. This primer opens that box. It turns out there's nothing inside it that isn't
already built from pieces this curriculum covered: matrices and dot products
(`linear_algebra_primer`), layers, activation functions, and backpropagation
(`deep_learning_primer`). What's new is a specific way of arranging those pieces - the
**Transformer** architecture - and the two ideas bolted onto either end of it:
turning text into numbers, and turning numbers back into text.

## What is GenAI Architecture?

"GenAI" (Generative AI) covers models that produce original content - the term is
already defined loosely in `ai_resources/ai_primer/README.md`. This primer is about the
specific architecture almost every current text-based GenAI model is built on: how raw
text becomes **tokens**, how tokens become vectors, and how those vectors get
transformed by **attention** into whatever comes next.

## Why should I care?

You've been using the vocabulary this primer explains without the mechanism behind it.
`ai_primer/01-context-is-key.md` already told you tokens are the unit you're billed in
and pointed you at the OpenAI Tokenizer tool to *watch* text get split into tokens -
this primer is where you build the thing that does the splitting. `agent_primer/02-
tokens-and-context.md` already told you about the "Lost in the Middle Effect" - this
primer is where you'll see a real, concrete reason attention-based models still favor
the beginning and end of a long context, even though attention is theoretically able to
look anywhere at once. And if this team's scouting agent ever needs to fuse multiple
kinds of scouting data (match text, stats, video) into one model, a Transformer-style
encoder - covered here - is the standard tool for exactly that.

## Key Terms

A running glossary of vocabulary introduced across this primer, in the order you'll
meet it. See also the [linear_algebra_primer](../linear_algebra_primer/README.md)
glossary for Matrix-Vector Product and Matrix Multiplication, and the
[deep_learning_primer](../deep_learning_primer/README.md) glossary for Softmax and
Regression Head, which this primer's attention mechanism and transformer block are
built from directly.

- **Token**: the smallest unit of text a language model actually processes - not
  always a whole word, sometimes a sub-word piece or a single character.
- **Tokenization**: the process of splitting raw text into tokens.
- **Byte-Pair Encoding (BPE)**: the tokenization algorithm most real language models
  use - starting from individual characters, repeatedly merging the most frequent
  adjacent pair into a new token.
- **Vocabulary**: the fixed set of every token a model knows, each with its own integer
  ID.
- **Embedding**: a learned vector representation of a token - similar tokens end up
  with similar vectors.
- **Embedding Matrix**: the matrix whose rows are every token's embedding; looking up a
  token's embedding is a single row index into this matrix.
- **Positional Encoding**: information added to each token's embedding indicating
  *where* in the sequence it is, since attention alone has no built-in sense of order.
- **Query, Key, Value (Q, K, V)**: three different linear projections of the same input
  embeddings, used together to compute attention.
- **Attention Score**: a single number measuring how relevant one token's Key is to
  another token's Query.
- **Attention Weight**: an attention score after softmax, turning a row of scores into
  a probability distribution over which tokens to attend to.
- **Self-Attention**: attention where the Queries, Keys, and Values all come from the
  same sequence - every token looking at every other token in the same input.
- **Scaled Dot-Product Attention**: the specific self-attention formula real
  Transformers use, scaling the raw dot-product scores down before the softmax.
- **Multi-Head Attention**: running several independent attention computations in
  parallel ("heads"), each potentially learning to attend to different kinds of
  relationships, then combining their outputs.
- **Residual Connection**: adding a layer's input back onto its output, so the layer
  only has to learn a *change* to make, not the whole transformation from scratch.
- **Layer Normalization**: rescaling a layer's output to have consistent scale before
  it's passed to the next layer, stabilizing training in a deep network.
- **Transformer Block**: one repeatable unit of a Transformer - multi-head attention
  plus a feedforward network, each wrapped with a residual connection.
- **Autoregressive Generation**: generating one token at a time, feeding each generated
  token back in as part of the input for generating the next one.
- **Causal Mask**: a rule preventing a token's attention from looking at tokens that
  come after it, so a model generating text can't "see the future" of its own output.

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

## Where This Goes Next

This primer stops at a single Transformer block's forward pass on toy data - it does
not train a real language model (that takes a training corpus, a vocabulary of tens of
thousands of tokens, and far more compute than a classroom notebook can reasonably use).
What you get here is what's actually inside the chatbots and agents this curriculum has
been using all along, demystified down to matrices, dot products, and softmax you've
already built by hand - not a new kind of math, just a new way of arranging the math
you already know.
