Twit = new TwitMaker({
    consumer_key: 'HHdWfAqUEJbaoG5Z1I17VI8NO'
    , consumer_secret: 'FhmSfkN67MYasBREO1Amsh1XpD3BPH1q7bWtZboZ2wo8iV5FRO'
    , access_token: '255506976-y6QPo53begxQRQ6U1FgicaspcOtzvYiZrQQdIl4A'
    , access_token_secret: '3ogOn4A0KvsSYBcKLL2II4T5bDq8h1V7BGWxVcROSLzzJ'
});

var Syllable = Meteor.npmRequire('syllable');
var Flasch = Meteor.npmRequire('flesch-kincaid');

var countWords = function (text) {
    var words = text.match(/\w+['-']*\w*/g);
    return words ? words.length : 0;
};

var countSentences = function (text) {
    var sentences = text.match(/[^.!?]+/g);
    return sentences ? sentences.length : 0;
};

Meteor.methods({
    getTweets: function (term) {
        console.log('Method call  :' + term);

        var tweetcall = Async.runSync(function (done) {

            Twit.get('statuses/user_timeline', {screen_name: term, count: 50},
                function (err, data) {
                    var total = 0;
                    var min = 10000;
                    var max = -10000;
                    var max_text = "";
                    var min_text = "";
                    var profile_pic_url = "";
                    var id;
                    var name = "";
                    var screen_name = "";

                    if (data) {
                        data.forEach(function (tweet) {

                            if (!tweet.retweeted) {
                                var grade = Flasch({
                                    'sentence': countSentences(tweet.text),
                                    'word': countWords(tweet.text),
                                    'syllable': Syllable(tweet.text)
                                });

                                if (grade > max) {
                                    max = grade;
                                    max_text = tweet.text;
                                }
                                if (grade < min) {
                                    min = grade;
                                    min_text = tweet.text;

                                }
                                total += grade;
                                profile_pic_url = tweet.user.profile_image_url;
                                id = tweet.user.id.toString();
                                name = tweet.user.name;
                                screen_name = tweet.user.screen_name;
                            }
                        });

                        var newscore = {
                            _id: id,
                            profile_pic_url: profile_pic_url,
                            name: name,
                            screen_name: screen_name,
                            average: total / 50,
                            max: max,
                            min: min,
                            min_text: min_text,
                            max_text: max_text,
                            createdAt: new Date()
                        };


                        done(null, newscore);

                    } else {
                        done('not found', null);
                    }

                });

        });

        if (tweetcall.error)
            throw new Meteor.Error(500, 'Error 500: Not found', 'the user is not found');


        var oldscore = TweetQuery.findOne(tweetcall.result._id);
        console.log(tweetcall.result._id);

        if (oldscore) {
            TweetQuery.update(tweetcall.result._id, {
                $set: {
                    average: tweetcall.result.average,
                    max: tweetcall.result.max,
                    min: tweetcall.result.min,
                    max_text: tweetcall.result.max_text,
                    min_text: tweetcall.result.min_text,
                    screen_name: tweetcall.result.screen_name,
                    profile_pic_url: tweetcall.result.profile_pic_url
                }
            });
        } else {
            TweetQuery.insert(tweetcall.result);
        }

        tweetcall.result.position = TweetQuery.find({average: {$gt: tweetcall.result.average}}).count() + 1;

        tweetcall.result.next_player = TweetQuery.findOne(
            {
                _id: {$ne: tweetcall.result._id},
                average: {$gte: tweetcall.result.average}
            }, {
                sort: {average: 1}
            });


        tweetcall.result.previous_player = TweetQuery.findOne(
            {
                _id: {$ne: tweetcall.result._id},
                average: {$lte: tweetcall.result.average}
            },
            {sort: {average: -1}}
        );


        if (tweetcall.result.next_player)
            tweetcall.result.next_player.position = tweetcall.result.position - 1;
        if (tweetcall.result.previous_player)
            tweetcall.result.previous_player.position = tweetcall.result.position + 1;


        return tweetcall.result;

    }
});

Meteor.publish('twitquery', function () {
    return TweetQuery.find({});
});
