/**
 * Created by andrea.terzani on 09/11/2015.
 */


Template.twitterform.events({
    "submit .twitter_name": function (event) {
        event.preventDefault();
        var text = event.target.text.value;

        var clearedtext= text.replace('@','');
        console.log(clearedtext);

        Meteor.call('getTweets',clearedtext, function(error, result){
            if(error){
                console.log(error);
            }

            Session.set('result', result);
        });

        event.target.text.value = "";
    }
});

Template.scoreBoard.helpers({
   scores: function () {
       return TweetQuery.find({},{sort:{average:-1}});
   }

});

Template.twitterform.helpers({
    result: function () {
        return Session.get('result');
    }
});

Template.resultshow.helpers({
    result: function () {
        return Session.get('result');
    }
});


Template.lead_item.helpers({
    average: function () {
        return Number((this.average).toFixed(2));
    }
});

Template.scoreItem.helpers({
    average: function () {
        return Number((this.item.average).toFixed(2));
    },
    myindex:function(){
        return this.index+1
    }
});

Template.socialShareBasic.helpers({
        opts: function() {
            var opts ={
                facebook: true,
                twitter: true,
                shareData: {
                    url: 'http://twittergrade.codetutorial.io',
                    caption:"test"
                }
            };
            return opts;
        }
    });

