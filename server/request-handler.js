var http = require('http');

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var count = 0; // usedin messageId

var messages = [];

var requestHandler = function(request, response) {

  var headers = defaultCorsHeaders;
  var statusCode = 404;

  headers['Content-Type'] = 'application/json';

  // These headers will allow Cross-Origin Resource Sharing (CORS).This code allows this server to talk to websites that are on different domains, for instance, your chat client.
  //
  // Your chat client is running from a url like file://your/chat/client/index.html, which is considered a different domain Another way to get around this restriction is to serve you chat client from this domain by setting up static file serving.

  // Request and Response come from node's http module.



  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  if (request.url === '/classes/messages' || request.url === '/classes/messages?order=-createdAt') {

    if (request.method === 'POST') {
      statusCode = 201;
      var stream = '';
      count++;
      request.on('data', function(data) {
        stream += data;
      });
      request.on('end', function() {
        stream = JSON.parse(stream);
        stream.objectId = count.toString();
        messages.push(stream);
      });
    }

    if (request.method === 'GET') {
      statusCode = 200;
      request.on('end', function() {
      });
    }

    if (request.method === 'OPTIONS') {
      statusCode = 200;
    }
  }

  response.writeHead(statusCode, headers);
  // .writeHead() writes to the request line and headers of the response, which includes the status and all headers.


  request.on('error', function(err) {
    console.error('error------->', err);
  });



  // response.write() - ?

  // Make sure to always call response.end() - Node may not send anything back to the client until you do. The string you pass to response.end() will be the body of the response - i.e. what show up in the browser.

  // Calling .end "flushes" the response's internal buffer, forcing node to actually send all the data over to the client.

  response.end(JSON.stringify({
    results: messages
  }));
};




exports.requestHandler = requestHandler;