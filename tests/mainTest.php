<?php
/**
 * Test
 */

class mainTest extends PHPUnit_Framework_TestCase{

	/**
	 * setup
	 */
	public function setup(){
		set_time_limit(60);
		$this->fs = new \tomk79\filesystem();
	}

	/**
	 * 疎通確認テスト
	 */
	public function testPing(){

		$this->assertSame( 1, 1 );

	} // testPing()

}
