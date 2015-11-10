/**
 * Created by andrea.terzani on 10/11/2015.
 */
var originalFunc = Spiderable._urlForPhantom;
Spiderable._urlForPhantom = function (siteAbsoluteUrl, requestUrl) {
    var url = originalFunc("http://twittergrade.codetutorial.io:4044/", requestUrl);
    console.log("Resolved Spiderable request " + requestUrl + " to " + url);
    return url;
};