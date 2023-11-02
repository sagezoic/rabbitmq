const amqp = require('amqplib'); // Promise based library

connect();
async function connect(){
    try{
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();
        const result = await channel.assertQueue("jobs");
        channel.consume("jobs", message => {
            // If you re-run the program multiple times you will still get the same message again and again. This 
            // is happing because you haven't acknowledged that you have received the message.
            const input = JSON.parse(message.content.toString());
            console.log(`Received job with input ${input.number}`);
            if(input.number==8){
                channel.ack(message);
            }
        });
        console.log("Waiting for messages...");
    }catch (ex){
        console.error(ex);
    }
}