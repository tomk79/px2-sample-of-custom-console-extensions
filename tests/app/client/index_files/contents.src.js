const $ = require('jquery');
const it79 = require('iterate79');
const utils79 = require('utils79');
$(window).on('load', function(){
	var params = parseUriParam(window.location.href);
	// console.log(params);
	var $canvas = $('#canvas');
	var customConsoleExtensionId = 'sample';
	var px2all;
	var cceInfo;

	it79.fnc({}, [
		function(it1){
			// get px2all
			$.ajax({
				'url': '/apis/px2agent',
				'method': 'post',
				'data': {
					'PX': 'px2dthelper.get.all',
					'options': {},
				},
				'success': function(res){
					console.log(res);
					px2all = res;
				},
				'complete': function(){
					it1.next();
				}
			});
		},
		function(it1){
			// get extension `sample` info.
			$.ajax({
				'url': '/apis/px2agent',
				'method': 'post',
				'data': {
					'PX': 'px2dthelper.custom_console_extensions.sample',
					'options': {},
				},
				'success': function(res){
					console.log(res);
					cceInfo = res.info;
				},
				'complete': function(){
					it1.next();
				}
			});
		},
		function(it1){
			// フロントのリソースを取得
			$.ajax({
				'url': '/apis/px2agent',
				'method': 'post',
				'data': {
					'PX': 'px2dthelper.custom_console_extensions.'+customConsoleExtensionId+'.client_resources',
					'options': {
						'dist': '../../app/client/client_resources/'
					},
				},
				'success': function(res){
					console.log(res);
					if( !res.result ){
						alert('Undefined Extension. ' + res.message);
						return;
					}
					var resources = res.resources;

					it79.ary(
						resources.css,
						function(it2, row, idx){
							var link = document.createElement('link');
							link.addEventListener('load', function(){
								it2.next();
							});
							$('head').append(link);
							link.rel = 'stylesheet';
							link.href = '/client_resources/'+row;
						},
						function(){
							it79.ary(
								resources.js,
								function(it3, row, idx){
									var script = document.createElement('script');
									script.addEventListener('load', function(){
										it3.next();
									});
									$('head').append(script);
									script.src = '/client_resources/'+row;
								},
								function(){
									it1.next();
								}
							);
						}
					);

				},
				'complete': function(){
					// it1.next();
				}
			});
		},
		function(it1){

			// var watchDir = main.cceWatcher.getWatchDir();
			// // console.log('watchDir:', watchDir);

			// if(!main.utils.isDirectory(watchDir+'async/'+pj.projectInfo.id+'/')){
			// 	main.fs.mkdirSync(watchDir+'async/'+pj.projectInfo.id+'/');
			// }
			// if(!main.utils.isDirectory(watchDir+'broadcast/'+pj.projectInfo.id+'/')){
			// 	main.fs.mkdirSync(watchDir+'broadcast/'+pj.projectInfo.id+'/');
			// }

			px2dthelperCceAgent = new Px2dthelperCceAgent({
				'elm': $('#canvas').get(0),
				'lang': 'ja',
				'appMode': 'web',
				'gpiBridge': function(input, callback){
					// GPI(General Purpose Interface) Bridge

					$.ajax({
						'url': '/apis/px2agent',
						'method': 'post',
						'data': {
							'PX': 'px2dthelper.custom_console_extensions.'+customConsoleExtensionId+'.gpi',
							'options': {
								'request': JSON.stringify(input),
								'appMode': 'web',
								// 'asyncMethod': 'file',
								// 'asyncDir': ''+watchDir+'async/',
								// 'broadcastMethod': 'file',
								// 'broadcastDir': ''+watchDir+'broadcast/',
							},
						},
						'success': function(res){
							// console.log('--- returned(millisec)', (new Date()).getTime() - testTimestamp);
							callback(res);
						},
						'complete': function(){
						}
					});

					return;
				}
			});
			// pj.onCceBroadcast(function(message){
			// 	px2dthelperCceAgent.putBroadcastMessage(message);
			// });
			it1.next();

		} ,
		function(it1){
			// console.log(cceInfo.client_initialize_function+'(px2dthelperCceAgent);');
			eval(cceInfo.client_initialize_function+'(px2dthelperCceAgent);');
			it1.next();
		} ,
		function(it1){
			it1.next();
		},
		function(it1){
			it1.next();
		},
		function(it1){
			console.log('standby.');
			it1.next();
		}
	]);

});

/**
 * GETパラメータをパースする
 */
var parseUriParam = function(url){
	var paramsArray = [];
	parameters = url.split("?");
	if( parameters.length > 1 ) {
		var params = parameters[1].split("&");
		for ( var i = 0; i < params.length; i++ ) {
			var paramItem = params[i].split("=");
			for( var i2 in paramItem ){
				paramItem[i2] = decodeURIComponent( paramItem[i2] );
			}
			paramsArray.push( paramItem[0] );
			paramsArray[paramItem[0]] = paramItem[1];
		}
	}
	return paramsArray;
}
