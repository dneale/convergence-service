'use strict';
var superagent = require('superagent');

var filterWords = (words) => {
  return words.filter((wordObj) => {
    const word = wordObj.word;
    if (!wordObj.tags || !wordObj.tags.includes('n') || wordObj.tags.includes('prop') || word.includes(' ')) {
      return false;
    }
    return true;
  });
}

module.exports.play = (event, context, callback) => {
  console.log(`Play made with '${event.pathParameters.word1}' and '${event.pathParameters.word2}'`)
  superagent.get(`https://api.datamuse.com/words?ml=${event.pathParameters.word1}+${event.pathParameters.word2}`)
    .end((err, res) => {
      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        },
        body: JSON.stringify({
          word1: event.pathParameters.word1,
          word2: event.pathParameters.word2,
          words: filterWords(JSON.parse(res.text)),
        }),
      };
      callback(null, response);
    });
};
