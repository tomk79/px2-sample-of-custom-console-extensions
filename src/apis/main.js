module.exports = function(cceAgent){
	console.log('Smaple of "Custom Console Extensions" Started.');

    const px2style = new (require('px2style'))();
	const $ = require('jquery');
	const twig = require('twig');
    const $mainElm = $(cceAgent.elm());

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
		cceAgent.gpi({'command': gpiCmd}, function(res){
			console.info(res);
			alert('done');
		});
	});



	/**
	 * twig テンプレートにデータをバインドする
	 */
	function bindTwig( tpl, data, options ){
		var rtn = '';
		data = data || {};
		try {
			if(templates[tpl]){
				rtn = templates[tpl](data);
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
