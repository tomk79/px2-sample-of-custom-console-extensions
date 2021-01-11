<?php
/**
 * Sample of Custom Console Extensions
 */
namespace tomk79\pickles2\sampleOfCustoomConsoleExtensions;

/**
 * main.php
 */
class main{

	/** Picklesオブジェクト */
	private $px;

	/** px2dthelper */
	private $px2dthelper;

	/** Config JSON */
	private $json;

	/**
	 * Constructor
	 *
	 * @param object $px $pxオブジェクト
	 * @param object $json プラグイン設定オブジェクト
	 * @param object $px2dthelper $px2dthelperオブジェクト
	 */
	public function __construct( $px, $json, $px2dthelper ){
		$this->px = $px;
		$this->json = $json;
		$this->px2dthelper = $px2dthelper;
	}

}
