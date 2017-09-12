'use strict';
const server = require('graphql-server-lambda');
const makeExecutableSchema = require('graphql-tools').makeExecutableSchema;

const typeDefs ="type Query { quoteOfTheDay: String random: Float! rollThreeDice: [Int] rollDice(numDice: Int!, numSides: Int): [Int] }";

const resolvers = {
  Query: {
    quoteOfTheDay: (root, {headers}, whatevs) => {
      return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
    },
    random: () => {
      return Math.random();
    },
    rollThreeDice: () => {
      return [1,2,3].map(_ => 1+  Math.floor(Math.random() * 6))
    },
    rollDice: (obj, args) => {
      var output = [];
      for (var i = 0; i < args.numDice; i++) {
        output.push(1 + Math.floor(Math.random() * (args.numSides || 6)));
      }
      return output;
    }
  }
};


const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers
});

module.exports.graphql = function(event, context, callback)  {
  const callbackFilter = function(error, output) {
      output.headers['Access-Control-Allow-Origin'] = '*';
      callback(error, output);
  };
  const handler = server.graphqlLambda({ schema: schema });
  
  return handler(event, context, callbackFilter);
};

module.exports.graphiql = server.graphiqlLambda({
  endpointURL: '/dev/graphql'
});

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0!',
      input: event,
    }),
  };
  callback(null, response);
};
