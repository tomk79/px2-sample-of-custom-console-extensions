<?php
/**
 * Sample of Custom Console Extensions
 */
namespace tomk79\pickles2\sampleOfCustomConsoleExtensions;

/**
 * main.php
 */
class main{

	/** Picklesオブジェクト */
	private $px;

	/** cceAgent */
	private $cceAgent;

	/** Config JSON */
	private $json;

	/**
	 * Constructor
	 *
	 * @param object $px $pxオブジェクト
	 * @param object $json プラグイン設定オブジェクト
	 * @param object $cceAgent $cceAgentオブジェクト
	 */
	public function __construct( $px, $json, $cceAgent ){
		$this->px = $px;
		$this->json = $json;
		$this->cceAgent = $cceAgent;
	}

	/**
	 * 機能拡張の名前を取得する
	 */
	public function get_label(){
		return 'Custom Console Extension 開発サンプル';
	}

	/**
	 * 機能拡張のクライアントサイド資材のベースディレクトリパスを取得する
	 */
	public function get_client_resource_base_dir(){
		return __DIR__.'/../dist/';
	}

	/**
	 * 機能拡張のクライアントサイド資材一覧を取得する
	 */
	public function get_client_resource_list(){
		$rtn = array();
		$rtn['css'] = array('sample-of-custom-console-extensions.css');
		$rtn['js'] = array('sample-of-custom-console-extensions.js');
		return $rtn;
	}

	/**
	 * クライアントサイドの初期化関数名を取得する
	 */
	public function get_client_initialize_function(){
		return 'window.sampleOfCustomConsoleExtensions';
	}

	/**
	 * General Purpose Interface
	 */
	public function gpi( $request ){
		switch( $request->command ){
			case 'async-demo':
				$this->cceAgent->async(array(
					'type'=>'gpi',
					'request' => array(
						'command' => 'broadcast-demo',
					),
				));
				return array(
					'result' => true,
					'message' => 'OK',
				);
				break;
			case 'broadcast-demo':
				$this->cceAgent->broadcast(array(
					'message' => 'Welcome! Broadcast!',
				));
				return array(
					'result' => true,
					'message' => 'OK',
				);
				break;
			case 'pickles2-clearcache';
				$stdout = $this->px->internal_sub_request(
					'/?PX=clearcache',
					array('output' => 'json')
				);
				return array(
					'result' => true,
					'message' => 'OK',
					'stdout' => $stdout,
				);
				break;
		}
		return false;
	}

}
