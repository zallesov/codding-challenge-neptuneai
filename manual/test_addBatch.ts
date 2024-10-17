// args.ts
const arg = Deno.args[1];
const symbol = Deno.args[0];

console.log("/add_batch/ test:", arg);

function batch(num: number) {
    console.log("Batching", num);
    const randomFloats = Array.from({ length: num }, () => Math.random());
    const payload = { values: randomFloats };
    fetch(`http://localhost:8000/add_batch/${symbol}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })
        .then(async (data) => {
            const response = await data.text();
            console.log('Success:', response);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

const batchLength = Number(arg);

if (!isNaN(batchLength)) {
    batch(batchLength);
} else {
    console.log("Provide batch length");
}
