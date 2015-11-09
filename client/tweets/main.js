/**
 * Created by andrea.terzani on 09/11/2015.
 */


Template.twitterform.events({
    "submit .twitter_name": function (event) {
        event.preventDefault();
        var text = event.target.text.value;

     Meteor.call('getTweets',text, function(error, result){
            if(error){
                console.log(error);
            }
            console.log(result);
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
        return Number((this.average).toFixed(4));
    }
});




Template.scoreItem.helpers({
    average: function () {
        return Number((this.item.average).toFixed(4));
    },
    myindex:function(){
        return this.index+1
    }
});


if(Meteor.isClient) {
    Template.socialShareBasic.helpers({
        opts: function() {
            var opts ={
                facebook: true,
                twitter: true,
                pinterest: false,
                shareData: {
                    url: 'http://twitgrade.codetutorial.io'
                }
            };
            return opts;
        }
    });
}