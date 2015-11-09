
Router.configure({
    layoutTemplate: 'home'
});

Router.map(function() {


    this.route('/', {
        path: '/',
        waitOn: function() {
            return [
                Meteor.subscribe('twitquery')
            ];
        }
    });
});
