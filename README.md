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

# Manual test

To make a request for a batch 
```bash
deno run --allow-net ./manual/test_addBatch.ts BTCUSDT 1000
```

To make a request for stats
```bash
deno run --allow-net ./manual/test_stats.ts BTCUSDT 2
```

# Algorithm

I'm maintaining a sliding window with calculated stats for each of the k `1<k<8`. Values for each k are also stored. For k=1 last 10 values, and for k=8 last 10^8 values. 
This could be optimized further to only use up 10^8 values. 

Every new value is added to the memory for value of k. The complexity of inserting a batch of m elements is O(m*k).

Average, Variance are calculated with a sliding window technique.
Recalculation for each value is done with O(1) complexity and O(m) for the batch. It is NOT looping over ALL N the values.

Min and Max calculation is done once fore every batch. In order to calculate min/max in less than O(N) I maintain a AVL tree. Adding all the values of the batch will take
O(m*log(n)) and finding min and max will take O(log(n)) once per batch. 

Reeds a happening in O(1). All values are pre-calculated.

Space complexity is 2N. Values are stored twice for each symbol and each value of k. Once in a list and once in a tree.
I could not find a solution with O(N) space AND O(log(N)) computation complexity. It is either N space and 0(N) or 2N and O(log(N)).

It there is such solution I need to know it.


 








