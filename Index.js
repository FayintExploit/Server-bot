const fetch = require("node-fetch");

const WEBHOOK_URL = process.env.WEBHOOK_URL;
const PLACE_ID = 2753915549;

setInterval(async () => {
    try {
        const res = await fetch(
            `https://games.roblox.com/v1/games/${PLACE_ID}/servers/Public?limit=100`
        );

        const data = await res.json();

        if (!data.data) return;

        const server = data.data.find(s => s.playing <= 2);

        if (!server) return;

        const joinLink = `https://www.roblox.com/games/start?placeId=${PLACE_ID}&gameInstanceId=${server.id}`;

        await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: `🟢 Server low!\n👥 ${server.playing}/${server.maxPlayers}\n🔗 ${joinLink}`
            })
        });

        console.log("Sent!");

    } catch (e) {
        console.log("Error:", e.message);
    }
}, 8000);
