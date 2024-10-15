# Disclaimer

This is a web server build with `deno`. A new TypeScript runtime/toolchain.

To run the app first get Deno

```bash
brew install deno
```
more information [here](https://docs.deno.com/runtime/getting_started/installation/)

This is the first time I'm using Deno. I've decided to use this codding challenge to also try it. 
And it is awesome. Apart from server API. It sucks.

# Run the server

```bash
deno run --allow-net server.ts
```
Deno will install the dependencies in at the first run. Good boy, Deno.


# API

API support following endpoints:

```
GET /stats/:symbol/:k
POST /add_batch/:symbol
```
Where `:symbol` is one of the following symbols:

```
BTCUSDT, ETHUSDT, XRPUSDT, LTCUSDT, DOGEUSDT, ADAUSDT, XMRUSDT, ZECUSDT, XRPUSDT, BNBUSDT
```

`:k` is the power of 10 of the length of the batch to calculate the stats for.

`/add_batch/:symbol` expect the JSON in the following format:
```
{
    "values": [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
}
```

Server will return a meaningful error message if something is wrong.

# Run unit tests

```bash
deno test
```

# Integration tests

To make a request for a batch 
```bash
deno run --allow-net ./integration/test_addBatch.ts BTCUSDT 1000
```

To make a request for stats
```bash
deno run --allow-net ./integration/test_stats.ts BTCUSDT 2
```

# Algorithm

Memory class maintains the list of batches for a particular symbol. 
Each batch contains the values from each API call and the stats calculated for that batch.

## Add values
Stats are calculated for each new batch and added to the memory.
When the total count of values in all batches reaches the maxSize=10^k (k=8)
- Remove the oldest batch until the total summed count of values is less than maxSize
- Split the oldest batch into two. One part replaces the oldest batch to keep the total count of values equal to maxSize.
  The second part is discarded.

## Get stats
It aggregates the stats from the batches until it reaches the batch that exceeds the window size.
This batch is then split into two. One part is used for the calculation of stats and the other part is discarded.

## Complexity
Calculating stats will always be O(n). n is the number of values in the batch.
Insertion of a batch is O(1) best case. Worst case O(m) where m is the number of batches. In case of batch size of 1 the complexity is O(10^k). This implementation will not perform well with in such extreme cases.

Getting stats is O(m). Where m is the number of batches stored. Also in case of batch size of 1 the complexity is O(10^k). 

This implementation will perform well batch size >> 10.

## Further optimization
Depending on insert/get request ratio or ratio between insert average batches size vs requested stats size the algorithm can be further improved.

For example
Splitting and recalculating the oldest batch in the insertion time is not really necessary. Removing those that exeed the maxSize is enough. But this will move the calculation of stats for the part of the last batch to the get stats endpoint.

Stats for each values of `k` can be precalculated and cached. 

Batching can be done in fixed size with exception of the the far right and far left batches. Those can be of arbitrary size. This will eliminate the edges case O(n) complexity adn will make the overall complexity O(maxSize/batchSize) for every insertion.






