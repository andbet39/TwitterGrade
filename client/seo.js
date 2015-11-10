/**
 * Created by andreaterzani on 09/11/15.
 */
Meteor.startup(function() {
    if (Meteor.isClient) {
        return SEO.config({
            title: 'Twitter grade by CODETutorial.io',
            meta: {
                'description': 'Twitter grade by CODETuroial.io! Check your and other twitter users text grade...'
            },
            og: {
                'image': 'https://www.codetutorial.io/wordpress/wp-content/uploads/2015/07/logoCodenew.png',
                'title':'Twitter grade by CODETutorial.io',
                'site_name':'Twitter Grade',
                'type':'website',
                'url':'http://twittergrade.codetutorial.io'
            }
        });
    }
});
