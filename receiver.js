var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error, connection){
    if(error){
        throw error;
    }
    connection.createChannel(function(error1, channel) {
        if(error1){
            throw error1;
        }

        var args = process.argv.slice(2);

        var exchange = "application-log-exchange-topic";

        channel.assertExchange(exchange, "topic", {
            durable: false
        })

        channel.assertQueue("", {
            exclusive: true
        }, function(error2, q) {
            console.log(" Waiting for the message. To exit press CTRL + C");

            args.forEach(function(logType) {
                channel.bindQueue(q.queue, exchange, logType);
            })            

            channel.consume(q.queue, function(msg) {
                console.log("Received %s", msg.content.toString());
            }, {
                noAck:true
            })
        })

        
    })
})