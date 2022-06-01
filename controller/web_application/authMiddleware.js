exports.redirectIfNotLoggedIn = function (request, response, next){
    if(request.session.isLoggedIn) next()
    else if(request.url == '/' || request.url == '/account/login' || request.url == '/account/signup' || request.url == '/about' || request.url == '/contacts') next()
    else response.redirect('/') 
}