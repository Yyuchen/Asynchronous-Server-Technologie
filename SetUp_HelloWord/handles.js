const url = require('url')
const qs = require('querystring')

module.exports = {
  serverHandle: function (req, res) {
  	  const route = url.parse(req.url)
	  const path = route.pathname 
	  const params = qs.parse(route.query)

      res.writeHead(200, {'Content-Type': 'text/plain'});
      if(path ==='/'){
	  	res.write('Ma présentation est caché sous mon prénom :). Avce url /hello?name=MonPrenon')
      }
      else if (path === '/hello' && 'name' in params) {
          if(params['name']==='yuchen'){
              res.write('Bonjour, Je suis Yuchen, 23ans, Je vie a Paris dans le 19eme et je suis une etudiante Ingenieur.' )
            }
            else res.write('Hello ' + params['name']+ ' Bienvenue :)')
        }
        else {
	    res.write('Error 404. Url non trouvé, esseyer encord :).')
	  }

	  res.end();
  } 
}