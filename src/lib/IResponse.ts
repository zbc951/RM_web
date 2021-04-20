/**
 * {
    status: true | false, //狀態
    msg: "", //錯誤訊息
    data: any  //回傳資料，any為任何型別 
}
 * client接收結構
 */
export interface ResponseData {
	/**
	 * 回傳狀態(新版下注使用)
	 */
	err: boolean;
	/**
	 * 回傳訊息
	 */
	err_msg: any;
	/**
	 * 回傳資料
	 */
	ret: any;


}