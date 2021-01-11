/**
 * server.js
 */
var conf = require('config');
var urlParse = require('url-parse');
var bodyParser = require('body-parser');
conf.originParsed = new urlParse(conf.origin);
conf.originParsed.protocol = conf.originParsed.protocol.replace(':','');
if(!conf.originParsed.port){
	conf.originParsed.port = (conf.originParsed.protocol=='https' ? 443 : 80);
}
conf.px2server.originParsed = new urlParse(conf.px2server.origin);
conf.px2server.originParsed.protocol = conf.px2server.originParsed.protocol.replace(':','');
if(!conf.px2server.originParsed.port){
	conf.px2server.originParsed.port = (conf.originParsed.protocol=='https' ? 443 : 80);
}
console.log(conf);

var fs = require('fs');
var path = require('path');
var px2agent = require('px2agent');
var utils79 = require('utils79');
var express = require('express'),
	app = express();
var server = require('http').Server(app);
var session = require('express-session');
console.log('port number is '+conf.originParsed.port);
console.log('Pickles 2 preview server port number is '+conf.px2server.originParsed.port);

var entryScript = path.resolve(__dirname, '../../testdata/standard/.px_execute.php');

var px2proj = px2agent.createProject(entryScript);

px2proj.get_config(function(px2conf){
	// console.log(px2conf);

	app.use( bodyParser({"limit": "1024mb"}) );
	var mdlWareSession = session({
		secret: "pickles2webtool",
		cookie: {
			httpOnly: false
		}
	});
	app.use( mdlWareSession );

	app.use( '/apis/px2agent', require('./apis/px2agent.js')({
		'entryScript': entryScript,
	}) );

	app.use( express.static( __dirname+'/../client/' ) );

	// {conf.port}番ポートでLISTEN状態にする
	server.listen( conf.originParsed.port, function(){
		console.log('server-standby');
	} );
});




// Pickles2 preview server
var expressPickles2 = require('express-pickles2');
var appPx2 = express();
appPx2.use( require('body-parser')({"limit": "1024mb"}) );
var mdlWareSession = session({
	secret: "pickles2webtool",
	cookie: {
		httpOnly: false
	}
});
appPx2.use( mdlWareSession );

appPx2.use( '/*', expressPickles2(
	entryScript,
	{
		// 'liveConfig': function(callback){
		// 	var pj = px.getCurrentProject();
		// 	var realpathEntryScript = path.resolve(pj.get('path'), pj.get('entry_script'));
		// 	callback(
		// 		realpathEntryScript,
		// 		{}
		// 	);
		// },
		'processor': function(bin, ext, callback){
			if( ext == 'html' ){
				bin += (function(){
					var fin = '';
						// fin += '<script data-broccoli-receive-message="yes">'+"\n";
						// // fin += 'console.log(window.location);'+"\n";
						// fin += 'window.addEventListener(\'message\',(function() {'+"\n";
						// fin += 'return function f(event) {'+"\n";
						// // fin += 'console.log(event.origin);'+"\n";
						// // fin += 'console.log(event.data);'+"\n";
						// fin += 'if(!event.data.scriptUrl){return;}'+"\n";
						// fin += 'if(window.location.origin!=\''+conf.px2server.origin+'\'){alert(\'Unauthorized access.\');return;}'+"\n";
						// fin += 'var s=document.createElement(\'script\');'+"\n";
						// fin += 'document.querySelector(\'body\').appendChild(s);s.src=event.data.scriptUrl;'+"\n";
						// fin += 'window.removeEventListener(\'message\', f, false);'+"\n";
						// fin += '}'+"\n";
						// fin += '})(),false);'+"\n";
						// fin += '</script>'+"\n";
					return fin;
				})();
			}
			callback(bin);
			return;
		}
	}
) );
appPx2.listen(conf.px2server.originParsed.port);
