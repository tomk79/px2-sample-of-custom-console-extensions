module.exports = function(cceAgent){
    const px2style = new (require('px2style'))();
    const $mainElm = $(cceAgent.elm());
	const $ = require('jquery');
	const twig = require('twig');
	console.log('Smaple of "Custom Console Extensions" Started.');

	var templates = {
		'index': require('../templates/index.html.twig'),
	};

	cceAgent.onBroadcast(function(message){
		console.info('Broadcast recieved:', message);
		alert(message.message);
	});

	var $body = $(bindTwig('index'));
	$mainElm.html('')
		.append($body)
	;
	$body.find('[data-gpi-request]').on('click', function(){
		var gpiCmd = $(this).attr('data-gpi-request');
		cceAgent.gpi({'command': gpiCmd});
	});



	/**
	 * twig テンプレートにデータをバインドする
	 */
	function bindTwig( tpl, data, options ){
		var rtn = '';
		data = data || {};
		try {
			if( templates[tpl] ){
				tpl = templates[tpl];
				rtn = tpl(data);
			}else{
				rtn = new twig.twig({
					'data': tpl
				}).render(data);
			}
		} catch (e) {
			var errorMessage = 'TemplateEngine "Twig" Rendering ERROR.';
			console.log( errorMessage );
			rtn = errorMessage;
		}

		return rtn;
	}
}
