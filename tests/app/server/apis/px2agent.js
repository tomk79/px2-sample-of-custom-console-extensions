/**
 * px2agent.js
 */
module.exports = function(opts){
	opts = opts || {};

	return function(req, res, next){
		console.log(req.body);

		var px2proj = require('px2agent').createProject(opts.entryScript);
		if( req.body.PX ){
			/**
			 * PXコマンドを実行する
			 */
			px2proj.px_command(
				req.body.PX,
				'/index.html',
				(req.body.options || {}),
				function(result){
					console.log(result);
					res
						.status(200)
						.set('Content-Type', 'text/json')
						.send( JSON.stringify(result) )
						.end();
				}
			);
			return;
		}else{

		}

		var value = {'test': 'test'};

		res
			.status(200)
			.set('Content-Type', 'text/json')
			.send( JSON.stringify(value) )
			.end();

		return;
	}

}
