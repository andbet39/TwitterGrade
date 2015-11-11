
Router.configure({
    layoutTemplate: 'home'
});

Router.configure({
    trackPageView: true
});

Router.map(function() {
    this.route('/', {
        path: '/',
        trackPageView: true,
        waitOn: function() {
            Meteor.isReadyForSpiderable = true;
            return [
                Meteor.subscribe('twitquery')
            ];
        }
    });
});
