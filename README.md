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

# Manula test

To make a request for a batch 
```bash
deno run --allow-net ./integration/test_addBatch.ts BTCUSDT 1000
```

To make a request for stats
```bash
deno run --allow-net ./integration/test_stats.ts BTCUSDT 2
```

# Algorithm

I'm maintaining a sliding window with calculated stats for each of the k `1<k<8`. Values for each k are also stored. For k=1 last 10 values, and for k=8 last 10^8 values. 
This could be optimized further to only use up 10^8 values. 
Every new value is added to the stats for this window for every k. The complexity of inserting a batch of m elements is O(m*k).
When the window reaches its limit (10^k) the oldest is removed from it and the new one is added. The stats are recalculated first for the removed value and then for the new value. 
Recalculation is done with O(1) complexity. It is not looping over the values.

Except for min and max. In case min or max value is removed there is no way to find a new min/max value in O(1) time AND O(1) space complexity. 
A separate sorted list will have to be maintained to complete it in O(1)










