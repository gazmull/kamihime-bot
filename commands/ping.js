// Calculates ping between sending a message and editing it, giving a nice round-trip latency.
// The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)

exports.run = (client, message, args) => {
    message.channel.send(`Pong! API Latency is ${Math.round(client.ping)}ms`).catch(console.error);
}
