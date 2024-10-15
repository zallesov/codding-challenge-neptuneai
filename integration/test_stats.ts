// args.ts
const symbol = Deno.args[0];
const k = Deno.args[1];

console.log("Stats test:", symbol, k);

function stats(k: number) {
    fetch(`http://localhost:8000/stats/${symbol}/${k}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(async (data) => {
            const response = await data.text()
            console.log('Response:', data.status, response);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

const statsLength = Number(k);

if (!isNaN(statsLength)) {
    stats(statsLength);
} else {
    console.log("Provide batch length");
}


