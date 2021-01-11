module.exports = function(cceAgent){
    const px2style = new (require('px2style'))();
    const $mainElm = $(cceAgent.elm());
	console.log('Smaple CCE "tomk79CmsToolsSample" Started.');

	cceAgent.onBroadcast(function(message){
		console.info('Broadcast recieved:', message);
		alert(message.message);
	});

	$mainElm.html('')
		.append($('<p>')
			.text('Smaple of Custom Console Extension.')
		)
	;
}
