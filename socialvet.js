var Twitter= require('ntwitter')
  , riak = require('riak-js').getClient()
  , conf = require('./conf');

var twitter = new Twitter({
	consumer_key: conf.twit.consumer_key,
	consumer_secret: conf.twit.consumer_secret,
	access_token_key: conf.twit.access_token_key,
	access_token_secret: conf.twit.access_token_secret
});

//var params = { geocode: '42.40115,-82.931671,60mi', rpp: 100};
var params = {}
twitter.verifyCredentials(function (err, data) {
	if (err) {
		console.err("auth failure", err);
		process.exit(1);
	}
	console.log("auth success");
	//setInterval(search, 5000);
	twitStream();
}); // end verify

function twitStream() {
	twitter.stream(
    'statuses/filter',
    { track: ['awesome', 'cool', 'rad', 'gnarly', 'groovy'] },
    function(stream) {
        stream.on('data', function(tweet) {
            console.log(tweet.text);
        });
    }
);
}

function search() {
	twitter.search(conf.track, params, function (err, data) {
		if (err) {
			console.log(err);
		} else {
			console.dir(data);
			data.results.forEach(persist);
		} 
	}); // end search
}

// persist a tweet to riak
function persist(tweet) {

	var key = tweet.id_str,
	  tweetObj = {
		  user: tweet.from_user,
		  tweet: tweet.text,
		  tweeted_at: new Date(tweet.created_at).toISOString(),
      id_str: key
	  },
	  links = [];

	console.log('saving tweet to riak', tweetObj);

	if (tweet.in_reply_to_status_id_str) {
		links.push({
			tag: 'in_reply_to',
			bucket: 'tweets',
			key:tweet.in_reply_to_status_id_str
		});
	}

	riak.save('tweets', key, tweetObj, {links: links}, function (err) {
		if (err) { console.err(err); }
	});
}