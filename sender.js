var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error, connection) {
    if(error) {
        throw error;
    }
    connection.createChannel(function(error1, channel){
        if(error1) {
            throw error1;
        }

        var args = process.argv.slice(2);
        var exchange = "application-log-exchange-topic";
        var logMsg = args.slice(1).join(' ');
        var logType = args[0];

        channel.assertExchange(exchange, "topic", {
            durable: false
        });
        channel.publish(exchange, logType, Buffer.from(logMsg));
        console.log("Sent %s", logMsg);
    })
    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 500);
})