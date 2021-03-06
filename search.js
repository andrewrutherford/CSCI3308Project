
function getsearch(city, term){
    var auth = {
        consumerKey : "UoGBVX22_FMoL5fHbUbGhw",
        consumerSecret : "DokjouooPd4zppGDrfPLOwqEaMc",
        accessToken : "S0OwEEVViv59ZDTByVx-wjAsm5CrRL7u",
        accessTokenSecret : "a1BEN4Qqxwil8gxw4OPMEEpSjrM",
        serviceProvider : {
            signatureMethod : "HMAC-SHA1"
        }
    }

    var terms = term
    var near = city

    var accessor = {
        consumerSecret : auth.consumerSecret,
        tokenSecret : auth.accessTokenSecret
    }

    parameters = [];
    parameters.push(['term', terms]);
    parameters.push(['location', near]);
    parameters.push(['callback', 'cb']);
    parameters.push(['oauth_consumer_key', auth.consumerKey]);
    parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
    parameters.push(['oauth_token', auth.accessToken]);
    parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

    var message = {
        'action' : 'http://api.yelp.com/v2/search',
        'method' : 'GET',
        'parameters' : parameters
    };

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);

    var parameterMap = OAuth.getParameterMap(message.parameters);
    console.log(parameterMap);

    $.ajax({
        'url' : message.action,
        'data' : parameterMap,
        'dataType' : 'jsonp',
        'jsonpCallback' : 'cb',
        'success' : function(data, textStats, XMLHttpRequest) {
            $('#confirm').text("It worked!" + " Searched for " + $('#city').val() + "  " + $('#term').val())
            var str = "Results: " + "<br>"
            _.forEach(data.businesses, function(d){  
                str += ("Name: " + d.name + "<br>" + "Address: " + d.location.address + "<br>" + "Rating: " + getstar(d.rating) + "<br><br><br>") 
            })
            document.getElementById("results").innerHTML = str
            document.getElementById("yelplogo").src = "assets/yelp-logo-large.png"
            console.log(data)
            var map = createmap('map', [data.region.center.latitude, data.region.center.longitude], 12, data)
        }
    })
}