##socialvet
So, I took my dog to the vet today, and my vet always likes to quiz me on tech stuff when I'm there.  He says he wants to try to utilize social media better to expand his business.

I've been playing with [node.js](http://nodejs.org) and [Riak](http://basho.com/products/riakcs/) lately.  I thought it would be interesting to build something that captures all tweets in our geographic area that mention keywords related to his business (e.g. vet, cat, dog, etc.)

Shortly thereafter, this script emerged.  It starts a live twitter stream restricted to a bounding box in my area, filters on tweets that have vet-related text, and stores it in Riak.

Perhaps I will configure it to email him a weekly CSV with the results.  

####Is it useful?
I don't know, but it is fun.

#####How to run it
Pre-requisites: Install node and Riak

* Get a [dev key](http://dev.twitter.com/apps/new) from Twitter for a new app
* `cp conf.js.sample conf.js`
* Add Twitter keys to `conf.js`
* Make sure Riak is started
* `npm install`
* node socialvet.js
