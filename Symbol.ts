import * as z from "zod";

export const SYMBOLS = [
    "BTCUSDT",
    "ETHUSDT",
    "XRPUSDT",
    "LTCUSDT",
    "DOGEUSDT",
    "ADAUSDT",
    "XMRUSDT",
    "ZECUSDT",
    "XRPUSDT",
    "BNBUSDT",
] as const;

export const Symbol = z.enum(SYMBOLS);

export type Symbol = z.infer<typeof Symbol>;
