var Twitter= require('ntwitter')
  , riak = require('riak-js').getClient()
  , conf = require('./conf');

var twitter = new Twitter({
  consumer_key: conf.twit.consumer_key,
  consumer_secret: conf.twit.consumer_secret,
  access_token_key: conf.twit.access_token_key,
  access_token_secret: conf.twit.access_token_secret
});

// login to twitter
twitter.verifyCredentials(function (err, data) {
  if (err) {
    console.err("auth failure", err);
    process.exit(1);
  }
  console.log("auth success...waiting for tweets...");
  // bounding box around my vet's area
  var params = {locations:'-82.983731,42.340229,-82.81825,42.504963'}
  twitStream(params);
}); 


// live stream tweets
function twitStream(params) {
  twitter.stream(
    'statuses/filter',
	params,
	function(stream) {
	  stream.on('data', function(tweet) {
	    //console.dir(tweet);
	    //can't combine twitter stream + search so use regex to filter
	    if(tweet.text.match(/vet|dog|cat/)) {
	      persist(tweet);
	    }
	  });
    }
  );
}


// persist a tweet to riak
function persist(tweet) {
  var key = tweet.id_str,
    tweetObj = {
      user: tweet.user.screen_name,
      tweet: tweet.text,
      tweeted_at: new Date(tweet.created_at).toISOString(),
      id_str: key },
	links = [];
    console.log('saving tweet to riak', tweetObj);
    if (tweet.in_reply_to_status_id_str) {
    links.push({
      tag: 'in_reply_to',
      bucket: 'tweets',
      key:tweet.in_reply_to_status_id_str});
    }

    riak.save('tweets', key, tweetObj, {links: links}, function (err) {
      if (err) { console.err(err); }
    });
}