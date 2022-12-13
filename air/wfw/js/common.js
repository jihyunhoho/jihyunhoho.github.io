/**
 * (B2B)세션을 유지하기 위한 인터벌 함수 <br>
 * 함수설명: sessionTimeoutSecond 으로 받은시간(초)의 1분(60초)전에 <br>
 * 세션을 갱신하기 위해 서비스를 호출한다.
 * 
 * @param fn:
 *            callback function
 * @param time:
 *            인터벌을 줘야 하는 시간(초) <br>
 *            ex)$k1(xhr).find("statusInfo").find("sessionTimeoutSecond").text();
 */
(function($) {

	$.session = {
		setInterval : function(fn, time) {
			setInterval(fn, (time - 60) * 1000);
		}
	};
})(jQuery);

/**
 * HTML5 DTD에 맞게 iframe의 속성을 Style을 이용하여 작성하였음.<br>
 * 이로인해 HTML4 DTD를 사용하거나, IE7, IE8에서 iframe의 scroll이 생기는 문제 발생<br>
 * Mark-Up 준수 및 Scroll 생성을 막기 위해 동적으로 iframe의 속성을 추가하는 함수.<br>
 * 2014/02/27 mcpark 2014/02/28 hyu 일부 기능이 올바르게 동작 하지 않아 해당 부분 제거<br>
 * 메소드 형태로 변환
 */
function gfn_iframe_noscroll() {

	$k1("iframe").each(function() {
		var copy = $k1(this).clone();
		if (!$k1.util.isNull(copy.attr('id'))) {
			$k1(copy).attr("frameborder", '0');
			$k1(copy).attr("scrolling", 'no');
			$k1(copy).attr("allowtransparency", 'true');
			$k1(copy).replaceAll(this); // hyu 2014-02-28
		}
	});
}

/**
 * 여행사에서 우리 마이그레이션 화면을 iframe으로 링크를 걸때 <br>
 * 마이그레이션 화면에 따라서 자동으로 iframe 높이를 지정해 주는 함수. <br>
 * 사용 방법 : $k1.iframe.autoResize(); <br>
 * 전선희 2014. 3. 14.
 */
(function($) {
	$.iframe = {
		autoResize : function() {
			var $iframe = $k1('iframe[name="_inneriframe"]');
			if ($iframe.length > 0) {
				var resizeUrl = $iframe.attr('src');
				var hpos = resizeUrl.indexOf('?height=');
				if (hpos > 0) {
					resizeUrl = resizeUrl.substring(0, hpos);
				}
				// alert('hpos : ' + hpos + 'url : ' + resizeUrl);
				var height = Math.max(document.body.offsetHeight, document.body.scrollHeight);
				if ($.browser.msie != true) {
					height = Math.max(document.body.offsetHeight, document.body.clientHeight);
				}
				// 여행사에 있는 iframe resize html 링크를 걸어 준다.
				$iframe.attr('src', resizeUrl + '?height=' + height);
			}
		}
	};
})(jQuery);

/**
 * HTML5 DTD에 맞게 iframe의 속성을 Style을 이용하여 작성하였음.<br>
 * 이로인해 HTML4 DTD를 사용하거나, IE7, IE8에서 iframe의 scroll이 생기는 문제 발생<br>
 * Mark-Up 준수 및 Scroll 생성을 막기 위해 동적으로 iframe의 속성을 추가하는 함수.<br>
 * 2014/02/27 mcpark 2014/02/28 hyu 일부 기능이 올바르게 동작 하지 않아 해당 부분 제거 (function($) { $(function() { jQuery("iframe").each(function() { var copy =
 * jQuery(this).clone(); if (!jQuery.util.isNull(copy.attr('id'))) { jQuery(copy).attr("frameborder", '0'); jQuery(copy).attr("scrolling", 'no');
 * jQuery(copy).attr("allowtransparency", 'true'); //jQuery(copy).replaceAll(this); //hyu 2014-02-28 } }); }); })(jQuery);
 */

/**
 * (B2B)사이트메니져 parameter SET
 */
(function($) {
	/**
	 * 사이트 메니져 파라메터를 리턴한다.
	 */
	$.sitemanager = {
		rtnOptparam : function() {

			var gRtnval = "";
			var gOptLength = $k1("input[name='optseqnos']").length;
			if (gOptLength > 0) {
				for ( var index = 0; index < gOptLength; index++) {

					if (index == 0) {

						gRtnval += "optseqnos=" + $k1("input[name='optseqnos']").eq(index).val();
						gRtnval += "&detailseqnos=" + $k1("input[name='detailseqnos']").eq(index).val();
					} else {

						gRtnval += "&optseqnos=" + $k1("input[name='optseqnos']").eq(index).val();
						gRtnval += "&detailseqnos=" + $k1("input[name='detailseqnos']").eq(index).val();
					}
				}
			} else {
				console.log("==gOptLength==>[" + gOptLength + "] 사이트 옵션 없음.");
				return;
			}
			return gRtnval;
		}
	};
})(jQuery);

(function($) {
	$.message = {

		_url_ : "/COM/AAA/COMAAAMSG0100010010.k1",
		_callback_ : null,
		_focusid_ : null,

		/**
		 * Function : $k1.message.forXMLdata(xmlObject, popupType)<br>
		 * 파일설명 : k1xml 호출 시, 메시지처리(AIRINTCOM0100010010 페이지를 호출)<br>
		 * 수정내역 : 2013. 1. 9. / jiseok(jonginseok) / 초기생성
		 * 
		 * @param xmlObject :
		 *            XML데이터 오브젝트
		 * @param popupType :
		 *            메시지타입 (1:alert,2:layout,3:modal,4:winOpen,5:embedded)
		 * @returns {Boolean}
		 */
		forXMLdata : function(xmlObject, popupType, option, preurl) {

			var _type = "2";
			var _url = "/air";
			var statusInfo = {
				status : "",
				returnMessage : "",
				errorCode : "",
				errorMessage : "",
				subErrorCode : "",
				subErrorMessage : "",
				datetime : "",
				sessionId : ""
			};

			// default
			var _option = {

				id : "_msgpop1",
				width : 500,
				height : 200

			};

			if (popupType != null || popupType != undefined) {

				_type = popupType;
			}

			if (option != null || popupType != undefined) {

				_option = option;
			}

			if (preurl != null || preurl != undefined) {

				_url = preurl;
			}

			if ($k1.isEmptyObject(xmlObject)) {

				console.log("전달받은 XML 정보가 없습니다.(XML isEmpty " + $k1.isEmptyObject(xmlObject) + ")");
				return;

			} else {

				$k1($k1.parseXML(xmlToString(xmlObject))).find("statusInfo").each(
						function() {

							statusInfo.status = $k1(this).find("status").text();
							statusInfo.returnMessage = $k1.util.replace($k1.util.replace($k1(this).find("returnMessage").text(), "[CDATA[", ""),
									"]]", "");

							statusInfo.errorCode = $k1(this).find("errorCode").text();
							statusInfo.errorMessage = $k1.util.replace($k1.util.replace($k1(this).find("errorMessage").text(), "[CDATA[", ""), "]]",
									"");

							statusInfo.subErrorCode = $k1(this).find("subErrorCode").text();
							statusInfo.subErrorMessage = $k1.util.replace($k1.util.replace($k1(this).find("subErrorMessage").text(), "[CDATA[", ""),
									"]]", "");

							statusInfo.datetime = $k1(this).find("datetime").text();
							statusInfo.sessionId = $k1(this).find("sessionId").text();
						});

			}

			if ("SUCCESS" == statusInfo.status) {

				// 성공
				// $k1.message.forPopup(statusInfo, _type, _url);
				return true;

			} else if ("FAILURE" == statusInfo.status) {

				// 실패
				$k1.message.forPopup(statusInfo, null, _type, _url, _option);
				return false;

			}
		},
		/**
		 * Function : $k1.message.forPopup(message, type, options)<br>
		 * 파일설명 : 업무공통 메시지 팝업 창을 띄운다.<br>
		 * 수정내역 : 2013. 1. 28. / jiseok(jonginseok) / 초기생성
		 * 
		 * @param message:
		 *            메시지
		 * @param popuptype:
		 *            팝업타입(1:alert,2:layout,3:modal,4:winOpen,5:embedded)
		 * @param options:
		 *            창의넓이와높이 등등... options = { width : 400, height : 150 };// default
		 * @returns {Boolean}
		 */
		forPopup : function(message, focusId, popuptype, preurl, options, callback) {

			if (null != focusId && undefined != focusId && "" != focusId) {
				this._focusid_ = focusId;
			}

			var _parameter_ = new Array();
			var _preurl_ = preurl;
			var _message_ = "";
			var _type_ = popuptype;
			var _function_ = callback;

			if ($k1.util.isNull(message)) {
				console.log("메시지가 없습니다. message=[" + $k1.util.isNull(message) + "]");
				return;
			} else {
				if (typeof (message) === 'string') {
					// string
					_parameter_.returnMessage = message;
					_parameter_.popuptype = popuptype;
					_message_ = message;
				} else if (typeof (message) === 'object') {
					// 배열
					_parameter_.status = message.status;
					_parameter_.returnMessage = message.returnMessage;
					_parameter_.errorCode = message.errorCode;
					_parameter_.errorMessage = message.errorMessage;
					_parameter_.subErrorCode = +message.subErrorCode;
					_parameter_.subErrorMessage = message.subErrorMessage;
					_parameter_.datetime = message.datetime;
					_parameter_.sessionId = message.sessionId;
					_parameter_.popuptype = popuptype;
					_message_ = message.returnMessage;
					_message_ += ((undefined != message.errorMessage) ? "\n" + message.errorMessage : "");
					_message_ += ((undefined != message.subErrorMessage) ? "\n" + message.subErrorMessage : "");
				}
			}

			if ($k1.util.isNull(_preurl_)) {
				_preurl_ = "/air";// default
			}

			if ($k1.util.isNull(_type_)) {
				_type_ = "1";// default
			}

			if ($k1.util.isNull(_function_)) {
				console.log("callback is : " + _function_);
				_function_ = gfn_common_message_forPopup_callbackfunction;
			}

			_message_ = _message_.replace(/<br>/gi, "\n");

			if ("2" == _type_) {
				// close function 이 있는 경우.
				// $k1.popup.modal(_preurl_ + "/compop" + $k1.message._url_, _parameter_, _options_, _function_);
				alert(_message_);

				_function_(true);

			} else if ("3" == _type_) {
				// confirm
				// $k1.popup.modal(_preurl_ + "/compop/COM/AAA/COMAAAMSG0100010020.k1", _parameter_, _options_, _function_);
				_function_(confirm(_message_));

			} else if ("4" == _type_) {
				// winopen
				// $k1.popup.winopen(_preurl_ + "/compop" + $k1.message._url_, _parameter_, _options_, _function_);
				alert(_message_);

				_function_(true);

			} else if ("5" == _type_) {
				// embedded
				$k1.message.forEmbedded(_message_, focusId);

			} else if ("6" == _type_) {
				// affirm
				// $k1.popup.modal(_preurl_ + "/compop/COM/AAA/COMAAAMSG0100010030.k1", _parameter_, _options_, _function_);
				alert(_message_);

				_function_(true);

			} else {
				// alert
				alert(_message_);

				_function_(true);

				return;
			}
		},

		/**
		 * 메시지를 레이어를 이용하여 디스플레이한다.
		 * <h1>함수설명</h1> : common_layer.jsp 페이지를 이용하여 air_messege_layer 이 항목을 이용하여 display 한다.<br>
		 * message.returnMessage<br>
		 * message.errorMessage<br>
		 * message.subErrorMessage 을 세팅하여 자세한 메시지를 처리할수 있다.<br>
		 * </br>수정내역 : 2013. 4. 29. / jiseok(jonginseok) / 초기생성<br>
		 * </br>수정내역 : 2013. 12. 26. / kspark / alert 메시지로 형태 변경
		 */
		forLayer : function(message, focusId, style, blockStyle) {

			console.log("forLayer =>this._focusid_::" + this._focusid_);

			if (focusId != null || focusId != undefined) {
				this._focusid_ = focusId;
			}

			if ($k1.util.isNull(message)) {
				alert('메시지가 없습니다.');
				return;
			} else {

				var airMsg = "";

				if (typeof (message) === 'string') {
					airMsg = message;
				} else if (typeof (message) === 'object') {
					if (!$k1.util.isNull(message.returnMessage)) {
						airMsg = message.returnMessage;
					}

					if (!$k1.util.isNull(message.errorMessage)) {
						if ("" != airMsg) {
							airMsg += "\n";
						}
						airMsg += message.errorMessage;
					}

					if (!$k1.util.isNull(message.subErrorMessage)) {
						if ("" != airMsg) {
							airMsg += "\n";
						}
						airMsg += message.subErrorMessage;
					}
				}

				if ("" != airMsg) {
					alert(airMsg);

					if (null != this._focusid_) {
						if ("div" == $k1("#" + this._focusid_).tagName()) {
							$k1("#" + this._focusid_).attr("tabindex", -1).focus();
						} else {
							$k1("#" + this._focusid_).focus();
						}
					}
					return;
				}
			}
		},
		/**
		 * Function : $k1.message.forEmbedded(elementId, message)<br>
		 * 파일설명 : 메시지를 element 요소에 표현하기 위한 함수.<br>
		 * 수정내역 : 2013. 1. 30. / jiseok(jonginseok) / 초기생성
		 * 
		 * @param elementId
		 * @param code
		 * @returns {Boolean}
		 */
		forEmbedded : function(message, elementId) {

			if ($k1.util.isNull($k1.trim(message))) {

				console.log("elementId 요소가 없습니다. elementId=[" + $k1.util.isNull(elementId) + "]");
			}
			if ($k1.util.isNull($k1.trim(message))) {

				console.log("메시지가 없습니다. message=[" + $k1.util.isNull(message) + "]");
			}

			$k1("#" + elementId).text(message);
		}
	};

})(jQuery);

function gfn_common_message_forPopup_callbackfunction() {
	console.log("forPopup this._focusid_::" + $k1.message._focusid_);

	if (null != $k1.message._focusid_) {
		if ("div" == $k1("#" + $k1.message._focusid_).tagName()) {
			$k1("#" + $k1.message._focusid_).attr("tabindex", -1).focus();
		} else {
			$k1("#" + $k1.message._focusid_).focus();
		}
	}
}

/*--------------------------------------------------------------------*
 *
 * section : 시스템 코드 (syscode: system code)
 *
 * 섹션설명 : 시스템 기초코드를 저장해 놓고 사용한다.
 * 수정내역 : 2013. 03. 03. / 북극성 / 초기생성
 *
 * 제공함수 및 사용예 및 결과:
 *
 * var xmlSysCode=null; // 가져온 xml data를 저장해 놓는 변수
 *
 * $k1.syscode.getSysCodeXml("vof",["N01","N02","N03","A01","A02"],myCallBack);
 *               // param 1. "vof" "air" 등이 필요하다.
 *               // param 2.       가져올 master code를 배열로 나열한다.
 *               // param 3.                                       콜백함수
 *
 * function myCallBack(xml_data)
 * {
 *     xmlSysCode=xml_data;
 *
 *     $k1.syscode.js_fn_mkCombo(xml_data, "N01", "#combo1", "_전체_", ["2"]);
 *               // param 1.	xml_data : xml_data 글로벌변수
 *               // param 2.	"N01" : master code
 *               // param 3.    "#combo1" : 콤보박스 selector
 *               // param 4.    "_전체_" : Optional
 *                              "_선택_" : Mandatory
 *                              "" : 설정안하는 경우
 *               // param 5.    ["2"] : 콤보박스 초기 설정  detail code
 *
 *     $k1.syscode.js_fn_mkCombo(xml_data, "N02", "#combo2", "_선택_", ["3"]);
 *     $k1.syscode.js_fn_mkCombo(xml_data, "N03", "#combo3", "_전체_", [""]);
 *
 *     $k1.syscode.js_fn_mkCombo(xml_data, "A01", "#combo4", "_전체_", ["AVXX"]);
 *     $k1.syscode.js_fn_mkCombo(xml_data, "N02", "#combo5", "_선택_", ["2"]);
 *     $k1.syscode.js_fn_mkCombo(xml_data, "A02", "#combo6", "_전체_", [""]);
 *
 * 제공함수 및 사용예 및 결과 2:
 *
 *     alert($.syscode.getSysCodeName(xmlSysCode,"A02","A02003"));
 *
 *     저장해 놓은 xml을 이용해서, 마스터코드 "A02" 이고, 상세코드 "A02003"인 코드의 이름을 가져온다.
 *     주의: 사용전에 xml이 확보되어 있어야 한다.
 */
(function($) {
	//
	// 업무공통 기초코드용 url 과 xmlReader
	//
	var __syscode_url = "/COM/AAA/COMAAASYS010000001001.k1xml";

	// var __xmlReader = [ "gridRoot>listCd111C5mTb", "cdMstr", "cdD2tl", "nm1D2tl" ];
	// 카드 코드의 조건 때문에 "refercd1"추가
	var __xmlReader = [ "proRoot1>vocomcd111", "mastrcd", "detailcd", "detailnm1", "refercd1" ];

	$.syscode = {

		/*
		 * 가져온 xml을 바탕으로 name을 구해주는 함수
		 */
		getSysCodeName : function(xml_data, strMasterCd, strDetailCd) {
			var dap = "Not Found";
			$(xml_data).find(__xmlReader[0]).each(function() {
				var mcode = $(this).find(__xmlReader[1]).text();
				if (mcode == strMasterCd) {
					var code = $(this).find(__xmlReader[2]).text();
					if (code == strDetailCd) {
						var name = $(this).find(__xmlReader[3]).text();
						dap = name;
						return dap;
					}
				}
			});
			return dap;
		},

		/*
		 * system code를 위한 xml을 가져오는 함수를 호출하는 함수
		 */
		getSysCodeXml : function(urlPrefix, arrMasterCd, cbFunc) {
			var arrSysCodeModel = new Array();
			for ( var i = 0, iFin = arrMasterCd.length; i < iFin; i++) {
				arrSysCodeModel[i] = {
					sy_code : arrMasterCd[i]
				};
			}

			var subSystemId = ("vof" != urlPrefix) ? "/" + gTaskType : "";
			var sskey = "";
			if (urlPrefix != "vof") {
				sskey = "?KSESID=" + gSsKey;
			}
			$.syscode._getSysCodeXml("/" + urlPrefix + subSystemId + __syscode_url + sskey, arrSysCodeModel, cbFunc);
		},

		/*
		 * system code를 위한 xml을 가져오는 함수
		 */
		_getSysCodeXml : function(strUrl, arrModel, cbFunc) {
			// error checking
			if ($.util.isNull(strUrl)) {
				console.log($.commonMD.error_001_paramIsNull("syscode", "_getSysCodeXml", "strUrl"));
				return false;
			}
			if ($.util.isNull(arrModel)) {
				console.log($.commonMD.error_001_paramIsNull("syscode", "_getSysCodeXml", "arrModel"));
				return false;
			}
			if (arrModel.length <= 0) {
				console.log($.commonMD.error_002_emptyArray("syscode", "_getSysCodeXml", "arrModel"));
				return false;
			}
			if ($.util.isNull(cbFunc)) {
				console.log($.commonMD.error_001_paramIsNull("syscode", "_getSysCodeXml", "cbFunc"));
				return false;
			}

			// make param
			// var param = "orderby=+sortordr+&mastrcd=xNULLx";
			var param = "mastrcd=xNULLx";
			for ( var i = 0; i < arrModel.length; i++) {
				var obj = arrModel[i];
				param += "`" + obj.sy_code;
			}
			// call ajax
			$.ajax({
				type : "POST",
				dataType : "xml",
				url : strUrl,
				data : param,
				success : function(xml_data) {
					cbFunc(xml_data, arrModel);
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					console.log($.commonMD.error_003_ajaxFailure("syscode", "_getSysCodeXml", textStatus, errorThrown));
				}
			});
		},

		/*
		 * 가져온 xml을 이용해 콤보상자를 만드는 함수
		 */
		js_fn_mkCombo : function(xml_data, strMasterCd, strComboId, strFirstOption, arrInitValue) {

			var target = $(strComboId);
			target.html("");// 콤보를 초기화한다.
			var iTargetLen = target.size();
			if (iTargetLen == 0) {
				console.log($.commonMD.error_006_noSelectedObject("syscode", "js_fn_mkCombo", strComboId));
				return false;
			}

			// 콤보 만들기.(multi select 지원됨)
			for ( var i = 0; i < iTargetLen; i++) {
				if (target[i].tagName != "SELECT") {
					console.log($.commonMD.error_007_noSelectTag("syscode", "js_fn_mkCombo", strComboId, i, target[i].tagName));
					continue;
				}
				var oneTarget = $(target[i]);

				if (strFirstOption == "_전체_") {
					oneTarget.append("<option value='' >_전체_</option>");
				} else if (strFirstOption == "_선택_") {
					oneTarget.append("<option value='' >_선택_</option>");
				}
				$(xml_data).find(__xmlReader[0]).each(function() {
					var mcode = $(this).find(__xmlReader[1]).text();
					if (strMasterCd == mcode) {
						var code = $(this).find(__xmlReader[2]).text();
						var name = $(this).find(__xmlReader[3]).text();

						var refercd1 = "";
						// var refercd2 = "";
						if (!$k1.util.isNull(__xmlReader[4])) {
							refercd1 = $(this).find(__xmlReader[4]).text();// refercd1
						}
						if (!$.util.isNull(arrInitValue[0])) {
							if (code == arrInitValue[0]) {
								oneTarget.append("<option value='" + code + "' selected>" + name + "</option>");
							} else {
								// refercd1만 있을때,
								if (!$.util.isNull(refercd1) && arrInitValue[1]) {
									if (refercd1 == arrInitValue[1]) {
										oneTarget.append("<option value='" + code + "'>" + name + "</option>");
									}
								} else {
									oneTarget.append("<option value='" + code + "'>" + name + "</option>");
								}
							}
						} else {
							oneTarget.append("<option value='" + code + "'>" + name + "</option>");
						}
					}
				});
			}
		},

		/**
		 * 이벤트 콤보 <br>
		 * 함수 설명 :지정한 요소(list)들에 의해 콤보가 만들어지고,<br>
		 * 그 콤보의 체인지에 따라서 특정 요소에 값을 변경한다.<br>
		 * example ) 발권요청-담당자 조회 Combo 에서 사용 <br>
		 * 수정내역 : 2013. 3. 5. / jiseok(jonginseok) / 초기생성
		 * 
		 * @param listObject(필수):
		 *            arrayList 객체
		 * @param selectBoxId(필수):
		 *            콤보박스 id
		 * @param elementId(선택):
		 *            이벤트 적용 id
		 * @param defaultValue(선택):
		 *            기본값
		 * @param optionInital(선택):선택값(_전체_:'',A:'A',
		 *            _선택_, S:'')
		 * @param optionSort(선택):정렬(ASC,DESC)
		 * @returns {Boolean}
		 */
		js_fn_mkComboBylist : function(listObject, selectBoxId, elementId, defaultValue, optionInital, optionSort) {
			try {
				var target = $("#" + selectBoxId);
				target.html("");// 콤보를 초기화한다.
				if ("_전체_" == optionInital) {
					target.append("<option value='' >_전체_</option>");
				} else if ("_선택_" == optionInital || "S" == optionInital) {
					target.append("<option value='' >_선택_</option>");
				} else if ("A" == optionInital) {
					target.append("<option value='A' >_전체_</option>");
				}
				if ($k1.isEmptyObject(listObject)) {
					// alert("Object가 비었습니다.");
					return;
				} else {
					// Sort Method
					function sortFunction(a, b) {
						var optSrt = optionSort.toUpperCase();
						if ("ASC" == optSrt) {
							return a.index - b.index;
						} else if ("DESC" == optSrt) {
							return b.index - a.index;
						} else {
							return a.index - b.index;
						}
					}
					listObject.sort(sortFunction);
					if (elementId != null || typeof (elementId) != "string") {
						for ( var i = 0; i < listObject.length; i++) {
							// 초기 선택값
							if (i == 0) {
								$k1("#" + elementId).val(listObject[i].elementVal);
							}
							if (!$.util.isNull(defaultValue)) {
								if (listObject[i].code == defaultValue) {
									target.append("<option value='" + listObject[i].code + "' selected>" + listObject[i].value + "</option>");
								} else {
									target.append("<option value='" + listObject[i].code + "' >" + listObject[i].value + "</option>");
								}
							} else {
								target.append("<option value='" + listObject[i].code + "' >" + listObject[i].value + "</option>");
							}
						}
						$k1(target).change(function() {
							var chg = $k1(target);
							for ( var j = 0; j < listObject.length; j++) {
								if (listObject[j].code == $k1(chg).val()) {
									$k1("#" + elementId).val(listObject[j].elementVal);
								}
							}
						});
					} else if (typeof (elementId) == 'function') {
					}
				}
				return;
			} catch (err) {
				var txt = "There was an error on this page.\n\n";
				txt += "Error description: " + err.description + "\n\n";
				txt += "Click OK to continue.\n\n";
				alert(txt);
			}
		},

		/**
		 * 이벤트 콤보 <br>
		 * 함수 설명 :지정한 요소(list)들에 의해 콤보가 만들어지고,<br>
		 * 그 콤보의 체인지에 따라서 특정 요소에 값을 변경한다.<br>
		 * example ) 발권요청-담당자 조회 Combo 에서 사용 <br>
		 * 수정내역 : 2013. 3. 5. / jiseok(jonginseok) / 초기생성
		 * 
		 * @param listObject(필수):
		 *            arrayList 객체
		 * @param selectBoxId(필수):
		 *            콤보박스 id
		 * @param elementId(선택):
		 *            이벤트 적용 id
		 * @param defaultValue(선택):
		 *            기본값
		 * @param optionInital(선택):선택값(_전체_:'',A:'A',
		 *            _선택_, S:'')
		 * @param optionSort(선택):정렬(ASC,DESC)
		 * @returns {Boolean}
		 */
		js_fn_mkReComboBylist : function(listObject, selectBoxId, elementId, defaultValue, optionInital, optionSort) {

			try {
				var _optionSort_ = optionSort;
				var target = $("#" + selectBoxId);
				target.html("");// reDraw
				if ("_전체_" == optionInital) {
					target.append("<option value='' >_전체_</option>");
				} else if ("_선택_" == optionInital || "S" == optionInital) {
					target.append("<option value='' >_선택_</option>");
				} else if ("A" == optionInital) {
					target.append("<option value='A' >_전체_</option>");
				}
				if ($k1.isEmptyObject(listObject)) {
					alert("Object가 비었습니다.");
					return false;
				} else {
					// Sort Method
					function sortFunction(a, b) {
						var optSrt = _optionSort_.toUpperCase();
						if ("ASC" == optSrt) {
							return a.index - b.index;
						} else if ("DESC" == optSrt) {
							return b.index - a.index;
						} else {
							return a.index - b.index;
						}
					}

					listObject.sort(sortFunction);

					if (elementId != null || typeof (elementId) != "string") {
						for ( var i = 0; i < listObject.length; i++) {
							// 초기 선택값
							if (i == 0) {
								$k1("#" + elementId).val(listObject[i].elementVal);
							}
							if (!$.util.isNull(defaultValue)) {
								if (listObject[i].code == defaultValue) {
									target.append("<option value='" + listObject[i].code + "' selected>" + listObject[i].value + "</option>");
								} else {
									target.append("<option value='" + listObject[i].code + "' >" + listObject[i].value + "</option>");
								}
							} else {
								target.append("<option value='" + listObject[i].code + "' >" + listObject[i].value + "</option>");
							}
						}
						$k1(target).change(function() {
							var chg = $k1(target);
							for ( var j = 0; j < listObject.length; j++) {
								if (listObject[j].code == $k1(chg).val()) {
									$k1("#" + elementId).val(listObject[j].elementVal);
								}
							}
						}).keyup(function() {
							var chg = $k1(target);
							for ( var j = 0; j < listObject.length; j++) {
								if (listObject[j].code == $k1(chg).val()) {
									$k1("#" + elementId).val(listObject[j].elementVal);
								}
							}
						});
					} else if (typeof (elementId) == 'function') {
					}
				}
				return;
			} catch (err) {
				var txt = "There was an error on this page.\n\n";
				txt += "Error description: " + err.description + "\n\n";
				txt += "Click OK to continue.\n\n";
				alert(txt);
			}
		},

		// BTMS용 결제정보(입금은행, 예금주, 계좌번호) : 동일은행 2개 이상일 경우 선택가능토록
		js_fn_mkComboBylist2 : function(listObject, selectBoxId, elementId, elementId1, elementId2, elementId3, elementId4, defaultValue,
				optionInital, optionSort) {
			var target = $("#" + selectBoxId);
			target.html("");// 콤보를 초기화한다.
			if ("_전체_" == optionInital) {
				target.append("<option value='' >_전체_</option>");
			} else if ("_선택_" == optionInital || "S" == optionInital) {
				target.append("<option value='' >_선택_</option>");
			} else if ("A" == optionInital) {
				target.append("<option value='A' >_전체_</option>");
			}
			try {
				if ($k1.isEmptyObject(listObject)) {
					alert("Object가 비었습니다.");
					return false;
				} else {
					// Sort Method
					function sortFunction(a, b) {
						var optSrt = optionSort.toUpperCase();
						if ("ASC" == optSrt) {
							return a.index - b.index;
						} else if ("DESC" == optSrt) {
							return b.index - a.index;
						} else {
							return a.index - b.index;
						}
					}
					listObject.sort(sortFunction);
					if (elementId != null || typeof (elementId) != "string") {
						for ( var i = 0; i < listObject.length; i++) {
							// 초기 선택값
							if (i == 0) {
								$k1("#" + elementId).text(listObject[i].elementVal); // 예금주
								$k1("#" + elementId1).text(listObject[i].elementVal1); // 계좌번호
								$k1("#" + elementId2).val(listObject[i].code); // 은행코드(Hidden)
								$k1("#" + elementId3).val(listObject[i].elementVal); // 예금주(hidden)
								$k1("#" + elementId4).val(listObject[i].elementVal1); // 계좌번호(hidden)

							}
							if (!$.util.isNull(defaultValue)) {
								// if (listObject[i].code == defaultValue) {
								if (listObject[i].acntseqno == defaultValue) {
									// target.append("<option value='" + listObject[i].code + "' selected>" + listObject[i].value + "</option>");
									target.append("<option value='" + listObject[i].acntseqno + "' selected>" + listObject[i].value + "</option>");
									$k1("#" + elementId).text(listObject[i].elementVal); // 예금주
									$k1("#" + elementId1).text(listObject[i].elementVal1); // 계좌번호
									$k1("#" + elementId2).val(listObject[i].code); // selected된 은행코드 Set
									$k1("#" + elementId3).val(listObject[i].elementVal); // selected된 예금주(hidden)
									$k1("#" + elementId4).val(listObject[i].elementVal1); // selected된 계좌번호(hidden)
								} else {
									// target.append("<option value='" + listObject[i].code + "' >" + listObject[i].value + "</option>");
									target.append("<option value='" + listObject[i].acntseqno + "' >" + listObject[i].value + "</option>");
								}
							} else {
								// target.append("<option value='" + listObject[i].code + "' >" + listObject[i].value + "</option>");
								target.append("<option value='" + listObject[i].acntseqno + "' >" + listObject[i].value + "</option>");
							}
						}

						$k1(target).change(function() {
							var chg = $k1(target);
							for ( var j = 0; j < listObject.length; j++) {
								// if (listObject[j].code == $k1(chg).val()) {
								if (listObject[j].acntseqno == $k1(chg).val()) {
									$k1("#" + elementId).text(listObject[j].elementVal);
									$k1("#" + elementId1).text(listObject[j].elementVal1);
									$k1("#" + elementId2).val(listObject[j].code);
									$k1("#" + elementId3).val(listObject[j].elementVal); // selected된 예금주(hidden)
									$k1("#" + elementId4).val(listObject[j].elementVal1); // selected된 계좌번호(hidden)

								}
							}
						}).keyup(function() {
							var chg = $k1(target);
							for ( var j = 0; j < listObject.length; j++) {
								// if (listObject[j].code == $k1(chg).val()) {
								if (listObject[j].acntseqno == $k1(chg).val()) {
									$k1("#" + elementId).text(listObject[j].elementVal);
									$k1("#" + elementId1).text(listObject[j].elementVal1);
									$k1("#" + elementId2).val(listObject[j].code);
									$k1("#" + elementId3).val(listObject[j].elementVal); // selected된 예금주(hidden)
									$k1("#" + elementId4).val(listObject[j].elementVal1); // selected된 계좌번호(hidden)
								}
							}
						});
						;
					} else if (typeof (elementId) == 'function') {
					}
				}
				return;
			} catch (err) {
				var txt = "There was an error on this page.\n\n";
				txt += "Error description: " + err.description + "\n\n";
				txt += "Click OK to continue.\n\n";
				alert(txt);
			}
		},
		/*
		 * 가져온 xml을 이용해 라디오버튼 만드는 함수
		 */
		/**
		 * 이벤트 라디오 <br>
		 * 함수 설명 :지정한 요소(list)들에 의해 라디오가 만들어지고,<br>
		 * 그 콤보의 체인지에 따라서 특정 요소에 값을 변경한다.<br>
		 */
		js_fn_mkRadio : function(xml_data, strMasterCd, strComboId, strFirstOption, arrInitValue, eventFnc) {
			var target = $($(strComboId)[0]);
			var targetName = target.attr("name");
			var iTargetLen = target.size();
			if (iTargetLen == 0) {
				console.log($.commonMD.error_006_noSelectedObject("syscode", "js_fn_mkRadio", strComboId));
				return false;
			}
			var i = 0;
			var bFirst = true;
			$(xml_data).find(__xmlReader[0]).each(function() {
				var mcode = $(this).find(__xmlReader[1]).text();
				var classtxt = "input_radio";
				if (strMasterCd == mcode) {
					var strValue = $(this).find(__xmlReader[2]).text();
					var strText = $(this).find(__xmlReader[3]).text();
					if (i > 0) {
						classtxt = "input_radio k1_ml15";
					}

					// step 1-1. 라디오 버튼 준비하기
					var objRadio = $("<input>").attr({
						id : targetName + "_" + i,
						name : targetName,
						type : "radio",
						value : strValue,
						"class" : classtxt

					}).click(function() {

					}).change(function() {
						eventFnc(this);

					});
					// step 1-2. 라디오 버튼 초기값 처리
					if ((bFirst && arrInitValue[0] == "") || (strText == arrInitValue[0])) {
						objRadio.attr("checked", "checked");
					}
					// step 1-3. 라디오 버튼용 레이블 레이블 준비하기
					var objLabel = $("<label>").attr({
						"for" : targetName + "_" + i
					});
					// step 1-4. 라디오 버튼용 레이블 값 처리하기
					objLabel[0].innerHTML = " " + strText;

					// step 1-5. 붙이기
					target.before(objRadio.after(objLabel));
					i++;
					bFirst = false;
				}

			});
			// step 2. 삭제하기 <input id="xx" name="xx" type="radio" />
			target.remove(); // 위치 지정용 radio 삭제
		}
	};
})(jQuery);

(function($) {
	//
	// 업무공통 기초코드용 url 과 xmlReader
	//
	var __syscode_url = "/COM/AAA/COMAAASYS010000002001.k1xml";
	var __xmlReader = [ 'tbComCd315_DaoProcess_VO', 'mastrCd', 'detailCd', 'detailNm1' ];

	$.syscode1 = {

		/*
		 * 가져온 xml을 바탕으로 name을 구해주는 함수
		 */
		getSysCodeName : function(xml_data, strMasterCd, strDetailCd) {
			// 임시
			var dap = "Not Found";
			$(xml_data).find(__xmlReader[0]).each(function() {
				var mcode = $(this).find(__xmlReader[1]).text();
				if (mcode == strMasterCd) {
					var code = $(this).find(__xmlReader[2]).text();
					if (code == strDetailCd) {
						var name = $(this).find(__xmlReader[3]).text();
						dap = name;
						return dap;
					}
					;
				}
				;
			});
			return dap;
		},

		/*
		 * system code를 위한 xml을 가져오는 함수를 호출하는 함수
		 */
		getSysCodeXml : function(urlPrefix, arrMasterCd, cbFunc) {
			var arrSysCodeModel = new Array();
			for ( var i = 0, iFin = arrMasterCd.length; i < iFin; i++) {
				arrSysCodeModel[i] = {
					sy_code : arrMasterCd[i]
				};
			}

			var subSystemId = ("vof" != urlPrefix) ? '/' + gTaskType : "";

			$.syscode1._getSysCodeXml('/' + urlPrefix + subSystemId + __syscode_url, arrSysCodeModel, cbFunc);
		},

		/*
		 * system code를 위한 xml을 가져오는 함수
		 */
		_getSysCodeXml : function(strUrl, arrModel, cbFunc) {
			// error checking
			if ($.util.isNull(strUrl)) {
				alert("%getSysCodeXml Error: getSysCodeXml Error : URL 정보가 없습니다.");
				return;
			}
			;
			if ($.util.isNull(arrModel) || arrModel.length == 0) {
				alert("%getSysCodeXml Error : Model 정보가 없습니다.");
				return;
			}
			;
			if ($.util.isNull(cbFunc)) {
				alert("%getSysCodeXml Error : callBackFunction 정보가 없습니다.");
				return;
			}
			;

			// make param
			/*
			 * var param = "cdMstr=.in."; for ( var i = 0; i < arrModel.length; i++) { var obj = arrModel[i]; param += "`" + obj.sy_code; } ;
			 */

			var param = "";

			param += "agtCd=" + arrModel[0].sy_code;
			param += "&bcncCd=" + arrModel[1].sy_code;
			param += "&bplcCd=" + arrModel[2].sy_code;
			param += "&mastrCd=" + arrModel[3].sy_code;
			param += "&referCd1=" + arrModel[4].sy_code;

			// call ajax
			$.ajax({
				type : "POST",
				dataType : "text",
				url : strUrl,
				data : param,
				success : function(xml_data) {
					cbFunc(xml_data, arrModel);
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					alert("%getSysCodeXml Error with ajax Function: " + textStatus + " " + errorThrown);
				}
			});
		},

		/*
		 * 가져온 xml을 이용해 콤보상자를 만드는 함수
		 */
		js_fn_mkCombo : function(xml_data, strComboId, strFirstOption, arrInitValue) {
			var target = $($(strComboId)[0]);
			target.html("");// 콤보를 초기화한다.

			/*
			 * 2013-12-06 FirstOption 기능 개선 : 전한휴
			 */

			// AS-IS
			// if (strFirstOption == "_전체_") {
			// oneTarget.append("<option value='' >_전체_</option>");
			// } else if (strFirstOption == "_선택_") {
			// oneTarget.append("<option value='' >_선택_</option>");
			// }
			// TO-BE
			if (strFirstOption != "" && strFirstOption != null) {
				oneTarget.append("<option value='' >" + strFirstOption + "</option>");
			}

			$(xml_data).find(__xmlReader[0]).each(function() {
				// var mcode = $(this).find(__xmlReader[1]).text();
				var code = $(this).find(__xmlReader[2]).text();
				var name = $(this).find(__xmlReader[3]).text();
				if (!$.util.isNull(arrInitValue[0])) {
					if (code == arrInitValue[0]) {
						target.append("<option value='" + code + "' selected>" + name + "</option>");
					} else {
						target.append("<option value='" + code + "'>" + name + "</option>");
					}
				} else {
					target.append("<option value='" + code + "'>" + name + "</option>");
				}
			});
		}

	};
})(jQuery);

(function($) {
	//
	// 업무공통 기초코드용 url 과 xmlReader
	//
	var __syscode_url = "/COM/AAA/COMAAASYS010000003001.k1xml";
	var __xmlReader = [ 'tbComCd320_DaoProcess_VO', 'bplcCd', 'bplcNm' ];

	$.syscode2 = {

		/*
		 * 가져온 xml을 바탕으로 name을 구해주는 함수
		 */
		getSysCodeName : function(xml_data, strCode) {
			// 임시
			var dap = "Not Found";
			$(xml_data).find(__xmlReader[0]).each(function() {
				var code = $(this).find(__xmlReader[1]).text();
				if (code == strCode) {
					var name = $(this).find(__xmlReader[3]).text();
					dap = name;
					return dap;
				}
				;
			});
			return dap;
		},

		/*
		 * system code를 위한 xml을 가져오는 함수를 호출하는 함수
		 */
		getSysCodeXml : function(urlPrefix, arrMasterCd, cbFunc) {
			var arrSysCodeModel = new Array();
			for ( var i = 0, iFin = arrMasterCd.length; i < iFin; i++) {
				arrSysCodeModel[i] = {
					sy_code : arrMasterCd[i]
				};
			}

			var subSystemId = ("vof" != urlPrefix) ? '/' + gTaskType : "";

			$.syscode2._getSysCodeXml('/' + urlPrefix + subSystemId + __syscode_url, arrSysCodeModel, cbFunc);
		},

		/*
		 * system code를 위한 xml을 가져오는 함수
		 */
		_getSysCodeXml : function(strUrl, arrModel, cbFunc) {
			// error checking
			if ($.util.isNull(strUrl)) {
				alert("%getSysCodeXml Error: getSysCodeXml Error : URL 정보가 없습니다.");
				return;
			}
			;
			if ($.util.isNull(arrModel) || arrModel.length == 0) {
				alert("%getSysCodeXml Error : Model 정보가 없습니다.");
				return;
			}
			;
			if ($.util.isNull(cbFunc)) {
				alert("%getSysCodeXml Error : callBackFunction 정보가 없습니다.");
				return;
			}
			;

			// make param
			/*
			 * var param = "cdMstr=.in."; for ( var i = 0; i < arrModel.length; i++) { var obj = arrModel[i]; param += "`" + obj.sy_code; } ;
			 */

			var param = "";

			param += "agtCd=" + arrModel[0].sy_code;
			param += "&bcncCd=" + arrModel[1].sy_code;
			// call ajax
			$.ajax({
				type : "POST",
				dataType : "text",
				url : strUrl,
				data : param,
				success : function(xml_data) {
					cbFunc(xml_data, arrModel);
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					alert("%getSysCodeXml Error with ajax Function: " + textStatus + " " + errorThrown);
				}
			});
		},

		/*
		 * 가져온 xml을 이용해 콤보상자를 만드는 함수
		 */
		js_fn_mkCombo : function(xml_data, strComboId, strFirstOption, arrInitValue) {
			var target = $($(strComboId)[0]);
			target.html("");// 콤보를 초기화한다.

			/*
			 * 2013-12-06 FirstOption 기능 개선 : 전한휴
			 */

			// AS-IS
			// if (strFirstOption == "_전체_") {
			// oneTarget.append("<option value='' >_전체_</option>");
			// } else if (strFirstOption == "_선택_") {
			// oneTarget.append("<option value='' >_선택_</option>");
			// }
			// TO-BE
			if (strFirstOption != "" && strFirstOption != null) {
				oneTarget.append("<option value='' >" + strFirstOption + "</option>");
			}

			$(xml_data).find(__xmlReader[0]).each(function() {
				var code = $(this).find(__xmlReader[1]).text();
				var name = $(this).find(__xmlReader[2]).text();
				if (!$.util.isNull(arrInitValue[0])) {
					if (code == arrInitValue[0]) {
						target.append("<option value='" + code + "' selected>" + name + "</option>");
					} else {
						target.append("<option value='" + code + "'>" + name + "</option>");
					}
				} else {
					target.append("<option value='" + code + "'>" + name + "</option>");
				}
			});
		}

	};
})(jQuery);

/**
 * Function : getTimeStamp()<br>
 * 파일설명 : 현재 년월일시분초를 가져온다.<br>
 * 수정내역 :
 * 
 * @param
 * @returns (String)
 */
function getTimeStamp() {
	var d = new Date();
	var month = d.getMonth() + 1;
	var date = d.getDate();
	var hour = d.getHours();
	var minute = d.getMinutes();
	var second = d.getSeconds();

	month = (month < 10 ? "0" : "") + month;
	date = (date < 10 ? "0" : "") + date;
	hour = (hour < 10 ? "0" : "") + hour;
	minute = (minute < 10 ? "0" : "") + minute;
	second = (second < 10 ? "0" : "") + second;

	var s = d.getFullYear() + month + date + hour + minute + second;

	return s;
}

/**
 * 파일설명 : 팝업윈도우 리사이징<br>
 * 수정내역 : 2014. 4. 30. / kspark / 초기생성
 * 
 * @param pObjId(optional)
 */
function gfn_resizePopup(pObjId) {
	window.setTimeout(function() {
		var strObjId = "k1_pop_wrap";
		if (undefined != pObjId) {
			strObjId = pObjId;
		}

		var nWidth = 0;
		var nHeight = 0;
		var nMenuWidth = 0;
		var nMenuHeight = 0;
		var nScrollWidth = 18;
		if (window.outerHeight) {
			nMenuWidth = window.outerWidth - window.innerWidth;
			nMenuHeight = window.outerHeight - window.innerHeight + 1;
		} else {
			// ie8 and earlier
			var nDocWidth = $k1(document).outerWidth();
			var nDocHeight = $k1(document).outerHeight();

			window.resizeTo(nDocWidth, nDocHeight);

			nMenuWidth = nDocWidth - $k1(window).width() - 16; // ie8이하 스크롤바 width(16px)제외
			nMenuHeight = nDocHeight - $k1(window).height();
		}

		nWidth = $k1("#" + strObjId).outerWidth() + nMenuWidth;
		nHeight = $k1("#" + strObjId).outerHeight() + nMenuHeight;
		self.resizeTo(nWidth, nHeight);

		// 리사이즈 후 자동으로 스크롤이 생긴 경우 화면 늘리기
		console.log($k1(document).height() + " > " + $k1(window).height());
		if ($k1(document).height() > $k1(window).height()) {
			console.log(nWidth + " + " + nScrollWidth + " = " + (nWidth + nScrollWidth));
			self.resizeTo(nWidth + nScrollWidth, nHeight);
		}

		var nLeft = (opener.window.screenLeft) ? opener.window.screenLeft : opener.window.screenX;
		var nTop = (opener.window.screenTop) ? opener.window.screenTop : opener.window.screenY;
		var D = opener.document;
		var nMidWidth = ((D.documentElement.clientWidth) ? D.documentElement.clientWidth : D.body.clientWidth) / 2;
		var nMidHeight = ((D.documentElement.clientHeight) ? D.documentElement.clientHeight : D.body.clientHeight) / 2;
		self.moveTo(nLeft + nMidWidth - (nWidth / 2), nTop + nMidHeight - (nHeight / 2));
	});
}

/**
 * Function : var map = new Map()<br>
 * 파일설명 : 값을 Map 에 담는다. 집어넣을때[map.put(key, value)] 가져올때 [map.get(key)]<br>
 * 수정내역 :
 * 
 * @param
 * @returns (Map)
 */
Map = function() {
	this.map = new Object();
};
Map.prototype = {
	put : function(key, value) {
		this.map[key] = value;
	},
	get : function(key) {
		return this.map[key];
	},
	containsKey : function(key) {
		return key in this.map;
	},
	containsValue : function(value) {
		for ( var prop in this.map) {
			if (this.map[prop] == value) {
				return true;
			}
		}
		return false;
	},
	isEmpty : function(key) {
		return (this.size() == 0);
	},
	clear : function() {
		for ( var prop in this.map) {
			delete this.map[prop];
		}
	},
	remove : function(key) {
		delete this.map[key];
	},
	keys : function() {
		var keys = new Array();
		for ( var prop in this.map) {
			keys.push(prop);
		}
		return keys;
	},
	values : function() {
		var values = new Array();
		for ( var prop in this.map) {
			values.push(this.map[prop]);
		}
		return values;
	},
	size : function() {
		var count = 0;
		for ( var prop in this.map) {
			count++;
			prop;
		}
		return count;
	}
};

/**
 * Function : var al = new ArrayList()<br>
 * 파일설명 : 값을 ArrayList 에 담는다. 집어넣을때[al.add(obj)] 가져올때 [al.get(index)]<br>
 * 수정내역 :
 * 
 * @param
 * @returns (Map)
 */
function ArrayList() {
	this.array = new Array();
	this.add = function(obj) {
		this.array[this.array.length] = obj;
	};
	this.iterator = function() {
		return new Iterator(this);
	};
	this.length = function() {
		return this.array.length;
	};
	this.get = function(index) {
		return this.array[index];
	};
	this.addAll = function(obj) {
		if (obj instanceof Array) {
			for ( var i = 0; i < obj.length; i++) {
				this.add(obj[i]);
			}
		} else if (obj instanceof ArrayList) {
			for ( var i = 0; i < obj.length(); i++) {
				this.add(obj.get(i));
			}
		}
	};
}

function Iterator(arrayList) {
	this.arrayList;
	this.index = 0;
	this.hasNext = function() {
		return this.index < this.arrayList.length();
	};
	this.next = function() {
		return this.arrayList.get(index++);
	};
}

/*--------------------------------------------------------------------*
 *
 * division : console
 * 디비젼설명 : 디버깅용 콘솔 오브젝트
 *
 * section : log
 * 섹션설명 : 로그를 출력 또는 무력화
 *
 * 수정내역 : 2013. 03. 03. / 북극성 / 초기생성
 *
 * 제공함수 및 사용예 및 결과:
 */
if (typeof console == "undefined") {
	// alert("IE의 디버깅모드가 아니므로 console 없어서 대체함. console.log를 널함수로 대체");
	console = new Object();
	console.log = function(param) {
		// alert(param);
	};
}

/*--------------------------------------------------------------------*
 *
 * section : 메세지자료 (commonMD:common message data)
 *
 * 섹션설명 : 메세지를 저장해 놓고 사용한다.
 * 수정내역 : 2013. 03. 03. / 북극성 / 초기생성
 *
 * 제공함수 및 사용예 및 결과:
 *
 *       alert($k1.commonMD.error_001_paramIsNull("commonBCD","getJsonData","fncCallBack"));
 *
 *       메세지 "#ERROR-[commonBCD/getJsonData]: 파라메터  arrServiceName 널류로 확인되었습니다."가 출력된다.
 */
(function($) {
	$.commonMD = {

		//
		// 에러 메세지
		//
		error_001_paramIsNull : function(strSectionName, strFuncName, strParamName) {
			return "#ERROR-[" + strSectionName + "/" + strFuncName + "]: 파라메터  " + strParamName + "의 데이터 값이 전달되지 않았습니다.";
		},
		error_002_emptyArray : function(strSectionName, strFuncName, strParamName) {
			return "#ERROR-[" + strSectionName + "/" + strFuncName + "]: 배열파라메터  " + strParamName + "의 데이터 값이 없습니다.";
		},
		error_003_ajaxFailure : function(strSectionName, strFuncName, textStatus, errorThrown) {
			return "#ERROR-[" + strSectionName + "/" + strFuncName + "]: ajax 호출에 실패하였습니다. (textStatus:" + textStatus + ") (errorThrown:"
					+ errorThrown + ")";
		},
		error_004_unknownService : function(strSectionName, strFuncName, strServiceName) {
			return "#ERROR-[" + strSectionName + "/" + strFuncName + "]: 서비스명 " + strServiceName + "이(가) 제공되지 않았습니다.";
		},
		error_005_statusFailure : function(strSectionName, strFuncName, strErrorMessage, strSubErrorMessage) {
			if ($.util.isNull(strErrorMessage)) {
				return "#ERROR-[" + strSectionName + "/" + strFuncName + "]: ajax 호출 후, 실패 값이 회신되었습니다. (errorMessage:" + strErrorMessage
						+ ") (subErrorMessage: " + strSubErrorMessage + ")";
			}
		},
		error_006_noSelectedObject : function(strSectionName, strFuncName, strSelectorName) {
			return "#ERROR-[" + strSectionName + "/" + strFuncName + "]: 쎌렉터" + strSelectorName + "은 선택한 것이 없습니다.";
		},
		error_007_noSelectTag : function(strSectionName, strFuncName, strSelectorName, iIndex, strTagName) {
			return "#ERROR-[" + strSectionName + "/" + strFuncName + "]: 쎌렉터" + strSelectorName + "[" + iIndex + "]은 <" + strTagName
					+ "> 을 쎌렉트 했지만, 콤보박스를 만들려면 <SELECT> 가 필요합니다.)";
		},
		error_008_variableIsNull : function(strSectionName, strFuncName, strVariableName) {
			return "#ERROR-[" + strSectionName + "/" + strFuncName + "]: 변수(오브젝트)  " + strVariableName + "의 데이터 값이 없습니다.";
		},
		error_009_xmlWithFailure : function(strSectionName, strFuncName, strUrl, objStatusInfo) {
			// BEGIN: block me after developping
			console.log("#ATTENTION: 아래 코드는 개발 완료 후 막아주십시요(debuging 용)");
			console.log(objStatusInfo);
			// END: block me after developping
			return "#ERROR-[" + strSectionName + "/" + strFuncName + "]: " + strUrl + " 호출 후 실패값이 회신되었습니다.";
		},
		error_010_DoubleCalled : function(strSectionName, strFuncName, strOthers) {
			if ($.util.isNull(strOthers)) {
				return "#ERROR-[" + strSectionName + "/" + strFuncName + "]: 두 번 이상 호출 되었습니다.";
			} else {
				return "#ERROR-[" + strSectionName + "/" + strFuncName + "]: " + strOthers + " 이 두 번 이상 호출되었습니다.";
			}
		},

		//
		// 정보 메세지
		//
		info_001_Test : function(strSectionName, strFuncName) {
			return "#INFO-[" + strSectionName + "/" + strFuncName + "]: 에서 정보를 드립니다.";
		},

		//
		// 백오피스 알림 메세지
		//
		alertVof_001_ClickedDisabledButton : function(strSectionName, strFuncName, strButtonName) {
			return "클릭한 [" + strButtonName + "] 버튼은 지금 사용할 수 없습니다.";
		},
		alertVof_002_InformationForGridUpdate : function(strSectionName, strFuncName) {
			return "데이터 수정이 필요한 항목(셀)을 클릭하세요.";
		},
		alertVof_003_SavedWithNoChangedValue : function(strSectionName, strFuncName) {
			return "변경된 데이터가 없습니다. 데이터 변경 후 다시 진행하세요.";
		},
		alertVof_004_ErrorWithSave : function(strSectionName, strFuncName, strOtherMessage) {
			return "데이터 저장중에 오류가 발생하였습니다.\n오류 메세지:" + strOtherMessage;
		},
		alertVof_005_ProcessedWithSuccess : function(strSectionName, strFuncName) {
			return "정상적으로 처리되었습니다.";
		},
		alertVof_006_DeletedWithNoSelectedRow : function(strSectionName, strFuncName) {
			return "삭제할 데이터(행)를 미리 선택하여 주세요.";
		},
		alertVof_007_ConfirmForDeletion : function(strSectionName, strFuncName) {
			return "데이터를 삭제 하시겠습니까?";
		},
		alertVof_008_ErrorWithDelete : function(strSectionName, strFuncName, strOtherMessage) {
			return "삭제 작업중에 오류가 발생하였습니다.\n오류 메세지:" + strOtherMessage;
		},
		alertVof_009_DeletedWithSuccess : function(strSectionName, strFuncName) {
			return "정상적으로 삭제되었습니다.";
		},
		alertVof_010_InsertedWithNoSelectedRow : function(strSectionName, strFuncName) {
			return "등록할 데이터(행)을 미리 선택하여 주십시오.";
		},
		alertVof_011_DoneLogout : function(strSectionName, strFuncName) {
			return "정상적으로 로그 아웃 되었습니다.";
		},
		alertVof_012_ErrorWithProcess : function(strSectionName, strFuncName, strOtherMessage) {
			return "작업처리중에 처리 중에 오류가 발생하였습니다.\n오류 메세지:" + strOtherMessage;
		},
		alertVof_013_ConfirmForLogout : function(strSectionName, strFuncName) {
			return "프로그램종료(로그아웃)하시겠습니까?";
		},
		alertVof_014_LoginFailure : function(strSectionName, strFuncName) {
			return "로그인에 실패하였습니다. 사용자ID/비밀번호/회사코드를 확인하세요.";
		},
		alertVof_015_sessionExpired : function(strSectionName, strFuncName) {
			return "로그인 되지 않았거나 일정 시간이 경과하여 세션이 종료되었습니다.\n다시 로그인 하세요.";
		},
		alertVof_016_accessWithoutAuth : function(strSectionName, strFuncName) {
			return "권한이 없는 페이지에 접근 시도를 하셨습니다. 권한 필요시 관리자에게 문의하세요";
		},
		alertVof_017_ErrorWithSaveDuplication : function(strSectionName, strFuncName, strOtherMessage) {
			return "중복 데이이터가 존재합니다.\n오류 메세지:" + strOtherMessage;
		},
		alertVof_018_ErrorWithDeleteDuplication : function(strSectionName, strFuncName, strOtherMessage) {
			return "관련된 하위 데이터가 존재하므로 삭제할 수 없습니다. 하위 데이터 먼저 삭제 후 작업 진행하세요\n오류 메세지:" + strOtherMessage;
		},
		alertVof_019_InsertBtmsWithDate : function(strSectionName, strFuncName, strOtherMessage) {
			return "출장기간이 잘못되었습니다.";
		},
		alertVof_020_ProcessedWithSuccessForMessage : function(strSectionName, strFuncName, strOtherMessage) {
			return "정상적으로 처리되었습니다.\n" + strOtherMessage;
		},
		alertVof_021_ConfirmForPnrUpdate : function(strSectionName, strFuncName) {
			return "업데이트를 진행 하시겠습니까?";
		},
		alertVof_022_InitInputForm : function(strSectionName, strFuncName) {
			return "항목이 초기화 되었습니다.";
		},
		alertVof_023_ErrorWithUpdateStatus : function(strSectionName, strFuncName, strOtherMessage) {
			return "상태를 변경 할 수 없는 데이터가  있습니다. 다시 확인 후 진행해주세요\n오류 메세지:" + strOtherMessage;
		},
		alertVof_024_CheckProgress : function(strSectionName, strFuncName) {
			return "선택하신 기능이 가능하지 않은 예약데이터 입니다.";
		},
		end_of_section : null
	};
})(jQuery);

/*--------------------------------------------------------------------*
 *
 * section : 공통업무코드자료(commonBCD:common business code data)
 *
 * 섹션설명 : 공통업무코드자료를 가지고 온다.
 * 수정내역 : 2013. 03. 03. / 북극성 / 초기생성
 *
 *
 * 제공함수 및 사용예:
 *
 *       var gJsonCommonBCD=null;
 *       $k1.commonBCD.getJsonData("vof",["판매형태","담당자","항공사","도시"], myCallBack);
 *       function myCallBack(json_data [,url] )
 *       {
 *           gJsonCommonBCD=json_data; // 별도로 저장하여 확보해 놓을 때만 사용
 *
 *           $k1.commonBCD.js_fn_mkCombo(json_data, "판매형태", "#combo1", "_전체_", ["2"]);
 *           $k1.commonBCD.js_fn_mkCombo(json_data, "담당자", "#combo2", "_선택_", ["3"]);
 *           $k1.commonBCD.js_fn_mkCombo(json_data, "항공사", "#combo3", "_전체_", [""]);
 *           $k1.commonBCD.js_fn_mkCombo(json_data, "도시", "#combo4", "_전체_", [""],["nacd","jp"]);
 *       };
 *
 * 제공함수 및 사용예: 자료가 확보된 것이 확실하다면, 아래의 예제도 가능하다.
 *       $k1.commonBCD.js_fn_mkCombo(gJsonCommonBCD, "판매형태", "#combo1", "_전체_", ["2"]);
 *
 * 제공함수 및 사용예: 자료가 확보된 것이 확실하다면, 아래의 예제도 가능하다.
 *        var arrObject=$k1.commonBCD._js_fn_mkArrayPair(gJsonCommonBCD, "항공사");
 *        설명: 항공사 관련 코드를 쉽게 꺼내 쓸 수 있다.
 *              갯수: n=arrObject.length;
 *              각각의 label과 value:
 *                    arrObject[0].label, arrObject[0].value
 *                    arrObject[1].label, arrObject[1].value
 *                    arrObject[n-1].label, arrObject[n-1].value
 *
 * 제공함수 및 사용예: 동적인 조건(dynamic condition) 을 가지고 질의를 할때
 *
 *       $k1.commonBCD.getJsonData("vof",[ {
 *          key : "공급자호텔코드",
 *          dCon_htlmastrcd : "USHNL001" // HTL_MASTR_CD
 *       }], myCallBack77);
 *       function myCallBack77(json_data [,url] )
 *       {
 *           $k1.commonBCD.js_fn_mkCombo(json_data, "공급자호텔코드", "#combo77", "_전체_", [""]);
 *       };
 *
 **************************************************************************************
 **************************************************************************************
 **************************************************************************************
 *
 * 가나다순 목록(2013년 6월 14일 버젼)
 * -------------------------------
 *		"개인/단체구분"				[ "N13" ]	// BasisCodeDetail_Service(cc111)
 *		"거래처"									// BusinessConnection_Service(cc310)(주의:agency_code는 login 에 따른 세션정보에서 가지고 옵니다.)- // cc310
 *		"거래처별_출장목적"			[ "N03" ]	// BusinessConnectionBasisCodeDetail_Service(cc315)(주의:agency_code는 login 에 따른 세션정보에서 가지고 옵니다.)
 *		"거래처별_출장부서"			[ "N02" ]	// BusinessConnectionBasisCodeDetail_Service(cc315)(주의:agency_code는 login 에 따른 세션정보에서 가지고 옵니다.)
 *		"거래처별_출장직급"			[ "N01" ]	// BusinessConnectionBasisCodeDetail_Service(cc315)(주의:agency_code는 login 에 따른 세션정보에서 가지고 옵니다.)
 *		"거래처직원"								// BusinessConnectionEmployee_Service(cc311)
 *		"결재란"					[ "N91" ]   // BasisCodeDetail_Service(cc111)
 *		"게시판이름"								// Board_Service(vb100)
 *		"결제방법"					[ "N48" ]	// BasisCodeDetail_Service(cc111)
 *		"결제상태"					[ "D02" ]	// BasisCodeDetail_Service(cc111)
 *		"결제요청결제방법구분"		[ "N89" ]	// BasisCodeDetail_Service(cc111)
 *		"공급자"						[ "N62" ]	// BasisCodeDetail_Service(cc111)
 * 		"관리결재란"					[ "K15" ]	// BasisCodeDetail_Service(cc111)
 *		"관계"						[ "N16" ]	// BasisCodeDetail_Service(cc111)
 *		"구분"						[ "N14" ]	// BasisCodeDetail_Service(cc111)
 *		"기내식"						[ "N10" ]	// BasisCodeDetail_Service(cc111)
 *
 *		"담당자"						[ "담당" ]	// User_Service(cc810)(주의:agency_code/brancd_code는 login 에 따른 세션정보에서 가지고 옵니다.)
 *		"도시"									// CityCode_Service(cc130)
 *		"동행자관계"					[ "N63" ]	// BasisCodeDetail_Service(cc111)
 *
 *		"렌터카체인"					[ "R02" ]	// BasisCodeDetail_Service(cc111)
 *
 *		"발권상태"					[ "D01" ]	// BasisCodeDetail_Service(cc111)
 *		"발권자"						[ "발권" ]	// User_Service(cc810)(주의:agency_code/brancd_code는 login 에 따른 세션정보에서 가지고 옵니다.)
 *		"변경요청상태코드"			[ "N70" ]   // BasisCodeDetail_Service(cc111)
 *		"예약요청상태"			[ "N71" ]   // BasisCodeDetail_Service(cc111)
 *		"본지점"									// TravelAgencyBranch_Service(cc109)(주의:agency_code는 login 에 따른 세션정보에서 가지고 옵니다.)
 *
 *		"사업장"									// Workplace_Service(cc320)(주의:agency_code는 login 에 따른 세션정보에서 가지고 옵니다.)
 *		"선호좌석"					[ "N35" ]	// BasisCodeDetail_Service(cc111)
 *		"렌터카예약상태"					[ "N34" ]	// BasisCodeDetail_Service(cc111)
 *		"성별"						[ "N05" ]	// BasisCodeDetail_Service(cc111)
 *
 *
 *		"이니시스가맹구분				[ "N65" ]	// BasisCodeDetail_Service(cc111)
 *		"세금계산서					[ "N72" ]	// BasisCodeDetail_Service(cc111)
 *		"거래처유형구분				[ "NB5" ]	// BasisCodeDetail_Service(cc111)
 *
 *		"숙박가능박수"				[ "H07" ]	// BasisCodeDetail_Service(cc111)ㅓ
 *
 *		"호텔예약변경이력"			[ "H31" ]	// BasisCodeDetail_Service(cc111)ㅓ
 *		"실시간여부"				["N25" ]	// BasisCodeDetail_Service(cc111)
 *		"여부"					[ "N73" ]	// BasisCodeDetail_Service(cc111)
 *		"여정형태구분"				[ "C10" ]	// BasisCodeDetail_Service(cc111)
 *		"증빙서류구분"				[ "C18" ]	// BasisCodeDetail_Service(cc111)
 *		"여행사"									// TravelAgencyBureauMaster_Service(cc100)(주의:agency_code는 login 에 따른 세션정보에서 가지고 옵니다.)
 *		"예약내역게시"				[ "N41" ]	// BasisCodeDetail_Service(cc111)
 *		"예약상태"					[ "N07" ]	// BasisCodeDetail_Service(cc111)
 *		"예약확정상태"				[ "H08" ]	// BasisCodeDetail_Service(cc111)
 *		"요금확정"					[ "C13" ]	// BasisCodeDetail_Service(cc111)
 *		"요청사항"					[ "H23" ]	// BasisCodeDetail_Service(cc111)
 *		"유효기간연도"				[ "N17" ]	// BasisCodeDetail_Service(cc111)
 *		"유효기간월"					[ "N18" ]	// BasisCodeDetail_Service(cc111)
 *		"입금구분"					[ "C28" ]	// BasisCodeDetail_Service(cc111)
 *		"입금계좌구분"				[ "N84" ]	// BasisCodeDetail_Service(cc111)
 *
 *		"입금세부구분"				[ "N85" ]	// BasisCodeDetail_Service(cc111)
 *		"입금여부"					[ "N58" ]	// BasisCodeDetail_Service(cc111)
 *		"입금여부2"				[ "N45" ]	// BasisCodeDetail_Service(cc111)
 *		"수수료구분"				[ "N46" ]	// BasisCodeDetail_Service(cc111)
 *		"은행코드"					[ "N85" ]	// BasisCodeDetail_Service(cc111)
 *		"운임코드"					[ "N15" ]	// BasisCodeDetail_Service(cc111)
 *		"SMS이메일업무구분"			[ "N82" ]	// BasisCodeDetail_Service(cc111)
 *
 *		"자동발권"					[ "N37" ]	// BasisCodeDetail_Service(cc111)
 *		"전화번호/지역번호"			[ "N21" ]	// BasisCodeDetail_Service(cc111)
 * 		"전송자료"					[ "NC2" ]	// BasisCodeDetail_Service(cc111)
 * 		"비자지급상태"				[ "NC4" ]	// BasisCodeDetail_Service(cc111)
 *		"제출방법"					[ "N22" ]	// BasisCodeDetail_Service(cc111)
 *		"좌석상태"					[ "C14" ]	// BasisCodeDetail_Service(cc111)
 *		"좌석선택" 					[ "C04" ]	// BasisCodeDetail_Service(cc111)
 *		"증빙종류"					[ "N77" ]	// BasisCodeDetail_Service(cc111)
 *		"지역노선"								// AreaCode_Service(cc112)
 *		"지역노선1"								// AreaCode_Service(cc112)*
 *		"직급구분"					[ "C01" ]	// BasisCodeDetail_Service(cc111)
 *
 *		"출장자프로필"				[ "N77" ]	[ 중복된것: 사용하지 마시기 바랍니다. "증빙종류"들 사용 ]
 *		"출장적용구분"				[ "N32" ]	// BasisCodeDetail_Service(cc111)
 *
 *		"취소사유"					[ "N43" ]	// BasisCodeDetail_Service(cc111)
 *
 *		"카드소유"					[ "N16" ]	[ 중복된것: 사용하지 마시기 바랍니다. "관계"를 사용 ]
 *		"카드종류"					[ "C29" ]	// BasisCodeDetail_Service(cc111)
 *		"카드구분"					[ "C32" ]	// BasisCodeDetail_Service(cc111)
 *
 *		"캐빈클래스구분"				[ "C04" ]	// BasisCodeDetail_Service(cc111)
 *
 *		"판매자"						[ "판매" ]	// User_Service(cc810)(주의:agency_code/brancd_code는 login 에 따른 세션정보에서 가지고 옵니다.)
 *		"판매형태"					[ "N66" ]	// BasisCodeDetail_Service(cc111)
 *
 *		"할부기간"					[ "N19" ]	// BasisCodeDetail_Service(cc111)
 *		"항공사"									// AirmanCode_Service(cc140)
 *		"핸드폰번호/앞3자리"			[ "N20" ]	// BasisCodeDetail_Service(cc111)
 *		"가입상태코드"				[ "N90" ]	// BasisCodeDetail_Service(cc111)
 *
 *		"호텔결제상태"				[ "H09" ]	// BasisCodeDetail_Service(cc111)
 *		"호텔예약가능상태"			[ "H20" ]	// BasisCodeDetail_Service(cc111)
 *		"호텔체인정보"				[ "H11" ]	// BasisCodeDetail_Service(cc111)
 *
 *		"호텔국가코드"							// NationCode_Service(cc120)
 *		"호텔도시코드"							// HotelCityCode_Service(cc500)
 *		"화폐단위"					[ "N36" ]	// BasisCodeDetail_Service(cc111)
 *		"환불상태"					[ "H15" ]	// BasisCodeDetail_Service(cc111)
 *		"환불상태2"					[ "N39" ]	// BasisCodeDetail_Service(cc111)
 *
 *		"ADM처리상태"				[ "N55" ]   // BasisCodeDetail_Service(cc111)
 *		"ADM처리결과"				[ "N56" ]   // BasisCodeDetail_Service(cc111)
 *		"ANO테이블자료구분"			[ "N99" ]	// BasisCodeDetail_Service(cc111)
 *
 *      "수수료종류"				[ "NA2" ]	// BasisCodeDetail_Service(cc111)
 *		"고객구분"					[ "NA3" ]	// BasisCodeDetail_Service(cc111)
 *		"고객취미"					[ "NA4" ]	// BasisCodeDetail_Service(cc111)
 *		"고객종교"					[ "NA5" ]	// BasisCodeDetail_Service(cc111)
 *		"고객직종"					[ "NA6" ]	// BasisCodeDetail_Service(cc111)
 *		"고객업종"					[ "NA7" ]	// BasisCodeDetail_Service(cc111)
 *		"고객성별"					[ "NA8" ]	// BasisCodeDetail_Service(cc111)
 *		"고객가족관계"				[ "NA9" ]	// BasisCodeDetail_Service(cc111)
 *		"비자타입"   				[ "NB6" ]	// BasisCodeDetail_Service(cc111)
 * 		"비자종류"   				[ "NB7" ]	// BasisCodeDetail_Service(cc111)
 * 		"RULETRIPTYPE"   		[ "NB8" ]	// BasisCodeDetail_Service(cc111)
 * 		"RULEFARETYPE"   		[ "NB9" ]	// BasisCodeDetail_Service(cc111)
 * 		"수수료설정구분"   			[ "NC1" ]	// BasisCodeDetail_Service(cc111)
 * 		"수수료수익기준"   			[ "NC5" ]	// BasisCodeDetail_Service(cc111)
 *  	"수요성격"   			[ "NF8" ]	// BasisCodeDetail_Service(cc111)
 *		"GDS"					[ "C37" ]	// BasisCodeDetail_Service(cc111)
 *		"회계차대"					[ "K01" ]	// BasisCodeDetail_Service(cc111)
 *		"회계BSPL"					[ "K02" ]	// BasisCodeDetail_Service(cc111)
 *		"회계계정등급"					[ "K03" ]	// BasisCodeDetail_Service(cc111)
 *		"회계분류1"					[ "K04" ]	// BasisCodeDetail_Service(cc111)
 *		"회계분류2"					[ "K05" ]	// BasisCodeDetail_Service(cc111)
 *		"회계분류3"					[ "K06" ]	// BasisCodeDetail_Service(cc111)
 *		"회계분개코드"					[ "K07" ]	// BasisCodeDetail_Service(cc111)
 *  	"계좌용도"					[ "K12" ]	// BasisCodeDetail_Service(cc111)
 * 		"발행구분"					[ "K13" ]	// BasisCodeDetail_Service(cc111)
 * 		"사용자구분"					[ "K16" ]	// BasisCodeDetail_Service(cc111)
 *
 **************************************************************************************
 **************************************************************************************
 **************************************************************************************
 *
 *		새로 추가 하시게 되면 [위의, 가나다순 목록]에서
 *
 *       1) 꼭.... 한글코드명 중복이 없는 것을 확인하시고,
 *       2) 가나다순 목록, 에도 한 줄 추가해 주시면 감사하겠습니다.
 *
 *       *) cc111 코드의 경우 cc110 테이블의 이름을 참고하셔서 생성하시기를 권해드립니다.
 *
 **************************************************************************************
 **************************************************************************************
 **************************************************************************************
 **/
(function($) {
	$.commonBCD = {
		/**
		 * 변수설명 : 내부적으로 사용할 변수들을 저장한다.<br>
		 * 수정내역 : 2013. 3. 5. / 북극성 / 초기생성<br>
		 */
		_url : "/COM/AAA/COMAAASYS010000001002.k1jsn",

		_serviceMap : {

			// BasisCodeDetail_Service(cc111)

			// **************************************************************************************
			// **************************************************************************************
			// **************************************************************************************
			// *
			// * 새로 추가 하시게 되면 [위의, 가나다순 목록]에서
			// *
			// * 1) 꼭.... 한글코드명 중복이 없는 것을 확인하시고,
			// * 2) 가나다순 목록, 에도 한 줄 추가해 주시면 감사하겠습니다.
			// *
			// * *) cc111 코드의 경우 cc110 테이블의 이름을 참고하셔서 생성하시기를 권해드립니다.
			// *
			// **************************************************************************************
			// **************************************************************************************
			// **************************************************************************************
			// Cxx 코드 (알파벳순서 및 번호순서 대로 입력해 주십시오.)
			"부서" : {
				svc : "basisCodeDetail",
				other : "A03"
			},
			"직급구분" : {
				svc : "basisCodeDetail",
				other : "C01"
			},
			"좌석선택" : {
				svc : "basisCodeDetail",
				other : "C04",
				_readerMap : { // 아래쪽 "캐빈클래스구분"과 동일한 [C04] 코드 이지만, _readerMap을 독자적으로 사용하고 싶을 때 설정한다.
					value : [ "detailcd" ],
					text : [ "detailnm2" ]
				}
			},
			"캐빈클래스구분" : {
				svc : "basisCodeDetail",
				other : "C04"
			},
			"변경요청구분" : {
				svc : "basisCodeDetail",
				other : "C07"
			},
			"변경요청상태" : {
				svc : "basisCodeDetail",
				other : "C08"
			},
			"여정형태구분" : {
				svc : "basisCodeDetail",
				other : "C10"
			},
			"요금확정" : {
				svc : "basisCodeDetail",
				other : "C13"
			},
			"좌석상태" : {
				svc : "basisCodeDetail",
				other : "C14"
			},
			"증빙서류구분" : {
				svc : "basisCodeDetail",
				other : "C18"
			},
			"체류기간구분" : {
				svc : "basisCodeDetail",
				other : "C19"
			},
			"체류지형태구분" : {
				svc : "basisCodeDetail",
				other : "C20"
			},
			"예약상태2" : {
				svc : "basisCodeDetail",
				other : "C25"
			},
			"입금구분" : {
				svc : "basisCodeDetail",
				other : "C28"
			},
			"카드종류" : {
				svc : "basisCodeDetail",
				other : "C29"
			},
			"현금영수증종류" : {
				svc : "basisCodeDetail",
				other : "C30"
			},
			"카드구분" : {
				svc : "basisCodeDetail",
				other : "C32"
			},
			"현금영수증용도" : {
				svc : "basisCodeDetail",
				other : "C34"
			},
			"GDS" : {
				svc : "basisCodeDetail",
				other : "C37"
			},
			"환불상태" : {
				svc : "basisCodeDetail",
				other : "C39"
			},
			// "환불종류" : {
			// svc : "basisCodeDetail",
			// other : "C42"
			// },
			"항공결제방법" : {
				svc : "basisCodeDetail",
				other : "C52"
			},

			// **************************************************************************************
			// **************************************************************************************
			// **************************************************************************************
			// *
			// * 새로 추가 하시게 되면 [위의, 가나다순 목록]에서
			// *
			// * 1) 꼭.... 한글코드명 중복이 없는 것을 확인하시고,
			// * 2) 가나다순 목록, 에도 한 줄 추가해 주시면 감사하겠습니다.
			// *
			// * *) cc111 코드의 경우 cc110 테이블의 이름을 참고하셔서 생성하시기를 권해드립니다.
			// *
			// **************************************************************************************
			// **************************************************************************************
			// **************************************************************************************
			// Dxx 코드 (알파벳순서 및 번호순서 대로 입력해 주십시오.)
			"발권상태" : {
				svc : "basisCodeDetail",
				other : "D01"
			},
			"결제상태" : {
				svc : "basisCodeDetail",
				other : "D02"
			},

			// **************************************************************************************
			// **************************************************************************************
			// **************************************************************************************
			// *
			// * 새로 추가 하시게 되면 [위의, 가나다순 목록]에서
			// *
			// * 1) 꼭.... 한글코드명 중복이 없는 것을 확인하시고,
			// * 2) 가나다순 목록, 에도 한 줄 추가해 주시면 감사하겠습니다.
			// *
			// * *) cc111 코드의 경우 cc110 테이블의 이름을 참고하셔서 생성하시기를 권해드립니다.
			// *
			// **************************************************************************************
			// **************************************************************************************
			// **************************************************************************************
			// Hxx 코드 (알파벳순서 및 번호순서 대로 입력해 주십시오.)
			"객실수" : {
				svc : "basisCodeDetail",
				other : "H03"
			},
			"호텔등급" : {
				svc : "basisCodeDetail",
				other : "H04"
			},
			"요금정책적용구분" : {
				svc : "basisCodeDetail",
				other : "H05"
			},
			"숙박가능박수" : {
				svc : "basisCodeDetail",
				other : "H07"
			},
			"예약확정상태" : {
				svc : "basisCodeDetail",
				other : "H08"
			},
			"호텔결제상태" : {
				svc : "basisCodeDetail",
				other : "H09"
			},
			"호텔예약가능상태" : {
				svc : "basisCodeDetail",
				other : "H20"
			},
			"호텔체인정보" : {
				svc : "basisCodeDetail",
				other : "H11"
			},
			"카드 종류(1A)" : {
				svc : "basisCodeDetail",
				other : "H12",
				_readerMap : {
					value : [ "detailcd" ],
					text : [ "detailnm2" ]
				}
			},
			"결제타입" : {
				svc : "basisCodeDetail",
				other : "H13"
			},
			"호텔환불상태" : {
				svc : "basisCodeDetail",
				other : "H15"
			},
			"인상할인" : {
				svc : "basisCodeDetail",
				other : "H16"
			},
			"요금정책적용방식" : {
				svc : "basisCodeDetail",
				other : "H17"
			},
			"호텔평점" : {
				svc : "basisCodeDetail",
				other : "H18"
			},
			"체류목적" : {
				svc : "basisCodeDetail",
				other : "H19"
			},
			"호텔도시매핑" : {
				svc : "basisCodeDetail",
				other : "H22"
			},
			"요청사항" : {
				svc : "basisCodeDetail",
				other : "H23"
			},
			"커미션적용방식" : {
				svc : "basisCodeDetail",
				other : "H24"
			},
			"호텔예약변경이력" : {
				svc : "basisCodeDetail",
				other : "H31"
			},

			"회계차대" : {
				svc : "basisCodeDetail",
				other : "K01"
			},

			"회계BSPL" : {
				svc : "basisCodeDetail",
				other : "K02"
			},

			"회계계정등급" : {
				svc : "basisCodeDetail",
				other : "K03"
			},

			"회계분류1" : {
				svc : "basisCodeDetail",
				other : "K04"
			},

			"회계분류2" : {
				svc : "basisCodeDetail",
				other : "K05"
			},

			"회계분류3" : {
				svc : "basisCodeDetail",
				other : "K06"
			},

			"회계분개코드" : {
				svc : "basisCodeDetail",
				other : "K07"
			},

			"회계결의분개코드" : {
				svc : "basisCodeDetail",
				other : "K08"
			},

			"회계전표구분코드" : {
				svc : "basisCodeDetail",
				other : "K09"
			},

			"가입경로" : {
				svc : "basisCodeDetail",
				other : "K11"
			},

			"계좌용도" : {
				svc : "basisCodeDetail",
				other : "K12"
			},

			"발행구분" : {
				svc : "basisCodeDetail",
				other : "K13"
			},
			"관리결재란" : {
				svc : "basisCodeDetail",
				other : "K15",
				_readerMap : {
					value : [ "detailcd" ],
					text : [ "detailnm1" ]
				}
			},

			"사용자구분" : {
				svc : "basisCodeDetail",
				other : "K16"
			},
			// **************************************************************************************
			// **************************************************************************************
			// **************************************************************************************
			// *
			// * 새로 추가 하시게 되면 [위의, 가나다순 목록]에서
			// *
			// * 1) 꼭.... 한글코드명 중복이 없는 것을 확인하시고,
			// * 2) 가나다순 목록, 에도 한 줄 추가해 주시면 감사하겠습니다.
			// *
			// * *) cc111 코드의 경우 cc110 테이블의 이름을 참고하셔서 생성하시기를 권해드립니다.
			// *
			// **************************************************************************************
			// **************************************************************************************
			// **************************************************************************************
			// Nxx 코드 (알파벳순서 및 번호순서 대로 입력해 주십시오.)
			"성별" : {
				svc : "basisCodeDetail",
				other : "N05"
			},
			"예약상태" : {
				svc : "basisCodeDetail",
				other : "N07"
			},
			"기내식" : {
				svc : "basisCodeDetail",
				other : "N10"
			},
			"개인/단체구분" : {
				svc : "basisCodeDetail",
				other : "N13"
			},
			"구분" : {
				svc : "basisCodeDetail",
				other : "N14"
			},
			"관계" : {
				svc : "basisCodeDetail",
				other : "N16"
			},
			"카드소유" : { // 중복코드
				svc : "basisCodeDetail", // --------> "관계"를 사용해 주십시오.
				other : "N16" //
			}, //
			"유효기간연도" : {
				svc : "basisCodeDetail",
				other : "N17"
			},
			"유효기간월" : {
				svc : "basisCodeDetail",
				other : "N18"
			},
			"할부기간" : {
				svc : "basisCodeDetail",
				other : "N19"
			},
			"핸드폰번호/앞3자리" : {
				svc : "basisCodeDetail",
				other : "N20"
			},
			"전화번호/지역번호" : {
				svc : "basisCodeDetail",
				other : "N21"
			},
			"전송자료" : {
				svc : "basisCodeDetail",
				other : "NC2"
			},
			"비자지급상태" : {
				svc : "basisCodeDetail",
				other : "NC4"
			},
			"제출방법" : {
				svc : "basisCodeDetail",
				other : "N22"
			},
			"실시간여부" : {
				svc : "basisCodeDetail",
				other : "N25"
			},
			"변경요청구분" : {
				svc : "basisCodeDetail",
				other : "N26"
			},
			"커미션구분" : {
				svc : "basisCodeDetail",
				other : "N27"
			},
			"상담구분" : {
				svc : "basisCodeDetail",
				other : "N30"
			},
			"상담분류" : {
				svc : "basisCodeDetail",
				other : "N31"
			},
			"출장적용구분" : {
				svc : "basisCodeDetail",
				other : "N32"
			},
			"렌터카예약상태" : {
				svc : "basisCodeDetail",
				other : "N34"
			},
			"선호좌석" : {
				svc : "basisCodeDetail",
				other : "N35"
			},
			"화폐단위" : {
				svc : "basisCodeDetail",
				other : "N36"
			},
			"자동발권" : {
				svc : "basisCodeDetail",
				other : "N37"
			},
			"본지점구분" : {
				/* 이코드는 사용하지 말아주세요. 해당코드는 출장대상구분입니다. */
				svc : "basisCodeDetail",
				other : "N38"
			},
			"출장대상구분" : {
				svc : "basisCodeDetail",
				other : "N38"
			},
			"증빙여부" : { // 한글코드 중복: 원래 환불상태가 H15로 기존 코드가 있어서, 환불상태2로 바꾸었습니다. 증비 여부 임..
				svc : "basisCodeDetail",
				other : "N39"
			},
			"예약내역게시" : {
				svc : "basisCodeDetail",
				other : "N41"
			},
			"Tax업데이트" : {
				svc : "basisCodeDetail",
				other : "N42"
			},
			"취소사유" : {
				svc : "basisCodeDetail",
				other : "N43"
			},
			"입금여부2" : {
				svc : "basisCodeDetail",
				other : "N45"
			},
			"수수료구분" : {
				svc : "basisCodeDetail",
				other : "N46"
			},
			"결제방법" : {
				svc : "basisCodeDetail",
				other : "N48"
			},
			"ADM처리상태" : {
				svc : "basisCodeDetail",
				other : "N55"
			},
			"ADM처리결과" : {
				svc : "basisCodeDetail",
				other : "N56"
			},
			"입금여부" : {
				svc : "basisCodeDetail",
				other : "N58"
			},
			"공급자" : {
				svc : "basisCodeDetail",
				other : "N62"
			},
			"동행자관계" : {
				svc : "basisCodeDetail",
				other : "N63"
			},
			"이니시스가맹구분" : {
				svc : "basisCodeDetail",
				other : "N65"
			},
			"출장목적" : {
				svc : "basisCodeDetail",
				other : "N64"
			},
			"판매형태" : {
				svc : "basisCodeDetail",
				other : "N66"
			},
			"항공사연합체(BTMS보완)" : {
				svc : "basisCodeDetail",
				other : "N68"
			},
			"호텔체인코드" : {
				svc : "basisCodeDetail",
				other : "H11" // 2013-09-23 변경 N69 => H11
			},
			"변경요청상태코드" : {
				svc : "basisCodeDetail",
				other : "N70"
			},
			"예약요청상태" : {
				svc : "basisCodeDetail",
				other : "N71"
			},
			"세금계산서" : {
				svc : "basisCodeDetail",
				other : "N72"
			},
			"여부" : {
				svc : "basisCodeDetail",
				other : "N73"
			},
			"출장상태" : {
				svc : "basisCodeDetail",
				other : "N74"
			},
			"출장상태2" : {
				svc : "basisCodeDetail",
				other : "N74",
				_readerMap : {
					value : [ "detailcd" ],
					text : [ "detailnm2" ]
				}
			},
			"출장개별상태" : {
				svc : "basisCodeDetail",
				other : "N75"
			},
			"출장개별상태2" : {
				svc : "basisCodeDetail",
				other : "N75",
				_readerMap : {
					value : [ "detailcd" ],
					text : [ "detailnm2" ]
				}
			},
			"출장예약구분" : {
				svc : "basisCodeDetail",
				other : "N76"
			},
			"증빙종류" : {
				svc : "basisCodeDetail",
				other : "N77"
			},
			"출장자프로필" : { // 중복 코드
				svc : "basisCodeDetail", // --------> "증빙종류"를 사용해 주십시오.
				other : "N77" //
			}, //
			"RULEITEMS" : {
				svc : "basisCodeDetail",
				other : "N78"
			},
			"은행코드" : {
				svc : "basisCodeDetail",
				other : "N85"
			},
			"운임코드" : {
				svc : "basisCodeDetail",
				other : "N15"
			},
			"운임코드2" : {
				svc : "basisCodeDetail",
				other : "N15",
				_readerMap : { // 아래쪽 "캐빈클래스구분"과 동일한 [C04] 코드 이지만, _readerMap을 독자적으로 사용하고 싶을 때 설정한다.
					value : [ "detailcd" ],
					text : [ "detailnm2" ]
				}
			},
			"탑승자취소상태" : {
				svc : "basisCodeDetail",
				other : "N81"
			},
			"SMS이메일업무구분" : {
				svc : "basisCodeDetail",
				other : "N82",
				_readerMap : { // 아래쪽 "캐빈클래스구분"과 동일한 [C04] 코드 이지만, _readerMap을 독자적으로 사용하고 싶을 때 설정한다.
					value : [ "detailcd" ],
					text : [ "detailnm2" ]
				}
			},
			"입금계좌구분" : {
				svc : "basisCodeDetail",
				other : "N84"
			},
			"입금세부구분" : {
				svc : "basisCodeDetail",
				other : "N85"
			},
			"업무구분" : {
				svc : "basisCodeDetail",
				other : "N87"
			},
			"국내국제구분" : {
				svc : "basisCodeDetail",
				other : "N88"
			},
			"결제요청결제방법구분" : {
				svc : "basisCodeDetail",
				other : "N89"
			},
			"가입상태코드" : {
				svc : "basisCodeDetail",
				other : "N90"
			},
			"결재란" : {
				svc : "basisCodeDetail",
				other : "N91",
				_readerMap : {
					value : [ "detailcd" ],
					text : [ "detailnm1" ]
				}
			},
			"발권티켓카드거래방식" : {
				svc : "basisCodeDetail",
				other : "N92"
			},
			"달력월영문변환" : {
				svc : "basisCodeDetail",
				other : "N94",
				_readerMap : {
					value : [ "detailcd" ],
					text : [ "detailnm2" ]
				}
			},
			"VOID" : {
				svc : "basisCodeDetail",
				other : "N95"
			},
			"ANO테이블자료구분" : {
				svc : "basisCodeDetail",
				other : "N99"
			},
			"항공서비스구분" : {
				svc : "basisCodeDetail",
				other : "NA1"
			},
			"수수료종류" : {
				svc : "basisCodeDetail",
				other : "NA2"
			},
			"고객구분" : {
				svc : "basisCodeDetail",
				other : "NA3"
			},
			"고객취미" : {
				svc : "basisCodeDetail",
				other : "NA4"
			},
			"고객종교" : {
				svc : "basisCodeDetail",
				other : "NA5"
			},
			"고객직종" : {
				svc : "basisCodeDetail",
				other : "NA6"
			},
			"고객업종" : {
				svc : "basisCodeDetail",
				other : "NA7"
			},
			"고객성별" : {
				svc : "basisCodeDetail",
				other : "NA8"
			},
			"고객가족관계" : {
				svc : "basisCodeDetail",
				other : "NA9"
			},
			"자동발권제한지역분류" : {
				svc : "basisCodeDetail",
				other : "NB1"
			},
			"WEBTTL일자구분" : {
				svc : "basisCodeDetail",
				other : "NB2"
			},
			"WEBTTLBASE구분" : {
				svc : "basisCodeDetail",
				other : "NB3"
			},
			"거래처유형구분" : {
				svc : "basisCodeDetail",
				other : "NB5"
			},
			"비자타입" : {
				svc : "basisCodeDetail",
				other : "NB6"
			},
			"비자종류" : {
				svc : "basisCodeDetail",
				other : "NB7"
			},
			"RULETRIPTYPE" : {
				svc : "basisCodeDetail",
				other : "NB8"
			},
			"RULEFARETYPE" : {
				svc : "basisCodeDetail",
				other : "NB9"
			},
			"수수료설정구분" : {
				svc : "basisCodeDetail",
				other : "NC1"
			},
			"수수료수익기준" : {
				svc : "basisCodeDetail",
				other : "NC5"
			},
			"통계일자구분" : {
				svc : "basisCodeDetail",
				other : "NC6"
			},
			"통계기준" : {
				svc : "basisCodeDetail",
				other : "NC7"
			},
			"실적기준" : {
				svc : "basisCodeDetail",
				other : "NC9"
			},
			"호텔통계기준" : {
				svc : "basisCodeDetail",
				other : "ND1"
			},
			"호텔통계실적기준" : {
				svc : "basisCodeDetail",
				other : "ND3"
			},
			"권한그룹" : {
				svc : "basisCodeDetail",
				other : "ND4"
			},
			"메뉴레벨" : {
				svc : "basisCodeDetail",
				other : "ND5"
			},
			"그룹코드구분" : {
				svc : "basisCodeDetail",
				other : "ND6"
			},
			"티켓등록종류" : {
				svc : "basisCodeDetail",
				other : "ND7"
			},
			"발권환불상태" : {
				svc : "basisCodeDetail",
				other : "ND8"
			},
			"출장요청승인상태" : {
				svc : "basisCodeDetail",
				other : "NE2"
			},
			"CNJ" : {
				svc : "basisCodeDetail",
				other : "NE4"
			},
			"적용제외여부" : {
				svc : "basisCodeDetail",
				other : "NE5"
			},
			"빌링주기" : {
				svc : "basisCodeDetail",
				other : "NE7"
			},
			"해외출발구분" : {
				svc : "basisCodeDetail",
				other : "NE8"
			},
			"시분초(시)" : {
				svc : "basisCodeDetail",
				other : "NF1"
			},
			"시분초(분)" : {
				svc : "basisCodeDetail",
				other : "NF2"
			},
			"프로그램권한설정" : {
				svc : "basisCodeDetail",
				other : "NF4"
			},
			"카드증빙종류" : {
				svc : "basisCodeDetail",
				other : "NF5"
			},
			"귀국일적용구분" : {
				svc : "basisCodeDetail",
				other : "NF6"
			},
			"수요성격" : {
				svc : "basisCodeDetail",
				other : "NF8"
			},
			"운임종류" : {
				svc : "basisCodeDetail",
				other : "NG1"
			},
			"캐빈클래스(프로모션)" : {
				svc : "basisCodeDetail",
				other : "NG2"
			},
			"부킹클래스" : {
				svc : "basisCodeDetail",
				other : "NG5"
			},

			// **************************************************************************************
			// **************************************************************************************
			// **************************************************************************************
			// *
			// * 새로 추가 하시게 되면 [위의, 가나다순 목록]에서
			// *
			// * 1) 꼭.... 한글코드명 중복이 없는 것을 확인하시고,
			// * 2) 가나다순 목록, 에도 한 줄 추가해 주시면 감사하겠습니다.
			// *
			// * *) cc111 코드의 경우 cc110 테이블의 이름을 참고하셔서 생성하시기를 권해드립니다.
			// *
			// **************************************************************************************
			// **************************************************************************************
			// **************************************************************************************
			// Rxx 코드 (알파벳순서 및 번호순서 대로 입력해 주십시오.)
			"렌터카체인" : {
				svc : "basisCodeDetail",
				other : "R02"
			},

			// **************************************************************************************
			// **************************************************************************************
			// **************************************************************************************
			// *
			// * 새로 추가 하시게 되면 [위의, 가나다순 목록]에서
			// *
			// * 1) 꼭.... 한글코드명 중복이 없는 것을 확인하시고,
			// * 2) 가나다순 목록, 에도 한 줄 추가해 주시면 감사하겠습니다.
			// *
			// * *) cc111 코드의 경우 cc110 테이블의 이름을 참고하셔서 생성하시기를 권해드립니다.
			// *
			// **************************************************************************************
			// **************************************************************************************
			// **************************************************************************************
			// Sxx 코드 (알파벳순서 및 번호순서 대로 입력해 주십시오.)
			"게시판분류" : {
				svc : "basisCodeDetail",
				other : "S01"
			},

			// **************************************************************************************
			// **************************************************************************************
			// **************************************************************************************
			// *
			// * 새로 추가 하시게 되면 [위의, 가나다순 목록]에서
			// *
			// * 1) 꼭.... 한글코드명 중복이 없는 것을 확인하시고,
			// * 2) 가나다순 목록, 에도 한 줄 추가해 주시면 감사하겠습니다.
			// *
			// **************************************************************************************
			// **************************************************************************************
			// **************************************************************************************

			// 별도테이블코드(TB명의 알파벳순서 및 번호순서대로 입력해 주십시오.)

			// TravelAgencyBureauMaster_Service(cc100)(주의:agency_code는 login 에 따른 세션정보에서 가지고 옵니다.)
			"여행사" : {
				svc : "travelAgencyBureauMaster"
			},

			// TravelAgencyBranch_Service(cc109)(주의:agency_code는 login 에 따른 세션정보에서 가지고 옵니다.)
			"본지점" : {
				svc : "travelAgencyBranch"
			},

			// AreaCode_Service(cc112)
			"지역노선" : {
				svc : "areaCode"
			},

			"지역노선1" : {
				svc : "areaCode",
				_readerMap : {
					value : [ "areacd" ],
					text : [ "areakornm" ]
				}
			},

			// NationCode_Service(cc120)
			"호텔국가코드" : {
				svc : "nationCode"
			},

			// CityCode_Service(cc130)
			"도시" : {
				svc : "cityCode"
			},
			"도시2" : {
				svc : "cityCode",
				_readerMap : {
					value : [ "citycd" ],
					text : [ "citykornm" ]
				}
			},
			"도시3" : {
				svc : "cityCode",
				_readerMap : {
					value : [ "citycd" ],
					text : [ "cityengnm" ]
				}
			},

			// AirmanCode_Service(cc140)
			"항공사" : {
				svc : "airmanCode"
			},

			"항공사숫자코드" : {
				svc : "airmanCode",
				_readerMap : {
					value : [ "airnocd" ],
					text : [ "airkornm" ]
				}
			},

			"마일리지항공사" : {
				svc : "airmanCode",
				_readerMap : {
					value : [ "aircd" ],
					text : [ "airkornm" ]
				}
			},

			"항공사2" : {
				svc : "airmanCode",
				_readerMap : {
					value : [ "aircd" ],
					text : [ "airkornm" ]
				}
			},
			// BusinessConnection_Service(cc310)(주의:agency_code는 login 에 따른 세션정보에서 가지고 옵니다.)- // cc310
			"거래처" : {
				svc : "businessConnection"
			},
			"거래처2" : {
				svc : "businessConnection",
				_readerMap : {
					value : [ "bcnccd" ],
					text : [ "bcncnm" ]
				}
			},
			"여행사별계좌번호" : {
				svc : "travelAgencyAccount"
			},
			"여행사별계좌번호2" : {
				svc : "travelAgencyAccount",
				_readerMap : {
					value : [ "acntseqno", "branchflag" ],
					text : [ "acntno", "banknm", "dpstrnm" ]
				}
			},
			// BusinessConnectionEmployee_Service
			"거래처직원" : { // cc311
				svc : "businessConnectionEmployee"
			},
			// TravelAgencyBranch_Service
			// "여행사지점" : { // cc109
			// svc : "agtBranch"
			// },
			// BusinessConnectionBasisCodeDetail_Service(주의:agency_code는 login 에 따른 세션정보에서 가지고 옵니다.)
			"거래처별_출장직급" : { // cc315
				svc : "businessConnectionBasisCodeDetail",
				other : "N01"
			},
			"거래처별_출장부서" : {
				svc : "businessConnectionBasisCodeDetail",
				other : "N02"
			},
			"거래처별_출장목적" : {
				svc : "businessConnectionBasisCodeDetail",
				other : "N03"
			},
			"사업장_출장부서" : { // 사업장을 세션에서 받아 오지 않고 거래처 전체 출장 부서를 가져 온다. by sunny
				svc : "businessConnectionBasisCodeDetailWork",
				other : "N02"
			},
			// Workplace_Service(cc320)(주의:agency_code는 login 에 따른 세션정보에서 가지고 옵니다.)
			"사업장" : {
				svc : "workplace"
			},

			// HotelCityCode_Service(cc500)
			"호텔도시코드" : {
				svc : "hotelCityCode"
			},

			// HotelSupplyCompany_Service(cc600)
			"호텔공급자" : {
				svc : "hotelSupplyCompany"
			},

			// HotelSupplyCompanyMaster_Service(cc660)
			"공급자호텔코드" : {
				svc : "hotelSupplyCompanyMaster"
			},

			// User_Service(cc810)(주의:agency_code/brancd_code는 login 에 따른 세션정보에서 가지고 옵니다.)
			"담당자" : {
				svc : "user",
				other : "담당"
			},
			"발권자" : {
				svc : "user",
				other : "발권"
			},
			"판매자" : {
				svc : "user",
				other : "판매"
			},
			// BusinessConnectionGroup_Service(cc330)
			"거래처그룹" : {
				svc : "businessConnectionGroup"
			},

			// AuthUserGroup_Service(cc840)
			"여행사권한그룹" : {
				svc : "authUserGroup"
			},

			// Board_Service(vb100)
			"게시판이름" : {
				svc : "board"
			},
			// AccountingAccounts_Service(vof_ac901)
			"계정코드" : {
				svc : "accountCode"
			},
			// AccountingAccountsSubject_Service
			"회계계정과목코드" : {
				svc : "accountTitleCode"
			},
			// TravelAgencyAccount_Service
			"여행사별은행" : {
				svc : "travelAgencyAccount",
				_readerMap : {
					value : [ "bankcd" ],
					text : [ "banknm" ]
				}
			},
			// TravelAgencyAccount_Service
			"여행사별은행D" : {
				svc : "travelAgencyAccountByDstinct",
				_readerMap : {
					value : [ "bankcd" ],
					text : [ "banknm" ]
				}
			},
			// TravelAgencyAccount_Service
			"여행사별은행계좌" : {
				svc : "travelAgencyAccount",
				_readerMap : {
					value : [ "acntno" ],
					text : [ "acntno" ]
				}
			},
			"통합은행계좌" : {
				svc : "travelAgencyClientAccount",
				_readerMap : {
					value : [ "acntno" ],
					text : [ "banknm", "acntno" ]
				}
			}

		// **************************************************************************************
		// **************************************************************************************
		// **************************************************************************************
		// *
		// * 새로 추가 하시게 되면 [위의, 가나다순 목록]에서
		// *
		// * 1) 꼭.... 한글코드명 중복이 없는 것을 확인하시고,
		// * 2) 가나다순 목록, 에도 한 줄 추가해 주시면 감사하겠습니다.
		// *
		// **************************************************************************************
		// **************************************************************************************
		// **************************************************************************************
		},

		//
		// json reader Map
		//
		_readerMap : {

			// "agtBranch" : {
			// value : [ "branchflag" ],
			// text : [ "branchnm" ]
			// },
			"airmanCode" : {
				value : [ "aircd", "airnocd" ],
				text : [ "airkornm", "airengnm" ]
			},
			"areaCode" : {
				value : [ "areacd", "diflag" ], // <option value="areacd-diflag">areakornm-areaengnm</option>
				text : [ "areakornm", "areaengnm" ]
			},
			"authUserGroup" : {
				value : [ "authgrpcd" ], // agtcd 는 로그인세션에서 자동으로 들어간다. by sykim
				text : [ "authgrpnm" ]
			},
			"basisCodeDetail" : {
				value : [ "detailcd" ],
				text : [ "detailnm1" ]
			},
			"businessConnection" : {
				value : [ "agtcd", "bcnccd" ],
				text : [ "bcncnm" ]
			},
			"travelAgencyAccount" : {
				value : [ "acntseqno" ],
				text : [ "acntno", "banknm", "dpstrnm" ]
			},
			"travelAgencyAccountByDstinct" : {
				value : [ "bankcd" ],
				text : [ "banknm" ]
			},
			"businessConnectionGroup" : {
				value : [ "bcncgrpcd" ], // agtcd 는 로그인세션에서 자동으로 들어간다. by sykim
				text : [ "bcncgrpnm" ]
			},
			"board" : {
				value : [ "bbscd" ],
				text : [ "bbsnm" ]
			},
			"accountCode" : {
				value : [ "useacntcd" ],
				text : [ "useacntcd", "acntnm" ]
			},
			"accountTitleCode" : {
				value : [ "acnttitlecd" ],
				text : [ "acnttitlecd", "acnttitlenm" ]
			},
			"businessConnectionBasisCodeDetail" : {
				value : [ "detailcd" ],
				text : [ "detailnm1" ]
			},
			"businessConnectionBasisCodeDetailWork" : {
				value : [ "detailcd" ],
				text : [ "detailnm1" ]
			},
			"businessConnectionEmployee" : {
				value : [ "empid" ],
				text : [ "empnm" ]
			},
			"cityCode" : {
				value : [ "citycd" ],
				text : [ "citykornm" ]
			},
			"hotelCityCode" : {
				value : [ "htlcitycd" ],
				text : [ "citykornm" ]
			},
			"hotelSupplyCompany" : {
				value : [ "htlsuplycpnycd" ],
				text : [ "htlsuplycpnynm" ]
			},
			"hotelSupplyCompanyMaster" : {
				value : [ "htlsuplycpnycd", "htlsuplycpnyhtlcd" ],
				text : [ "htlsuplycpnyhtlengnm" ]
			},
			"nationCode" : {
				value : [ "nacd" ],
				text : [ "nakornm" ]
			},
			"travelAgencyBranch" : {
				value : [ "branchflag" ], // agtcd 는 로그인세션에서 자동으로 들어간다. by sykim
				text : [ "branchnm" ]
			},
			"travelAgencyBureauMaster" : {
				value : [ "agtcd" ],
				text : [ "cpnynm" ]
			},
			"user" : {
				value : [ "usrid" ],
				text : [ "usrnm" ]
			},
			"workplace" : {
				// value : [ "agtcd", "bplccd" ],
				value : [ "bplccd" ],
				text : [ "bplcnm" ]
			},
			"travelAgencyClientAccount" : {
				value : [ "acntno" ],
				text : [ "acntno" ]
			}
		},

		/**
		 * 함수설명 : 지정한 서비스명들의 json 자료를 가지고 온후 fncCallBack을 호출한다.<br>
		 * 수정내역 : 2013. 3. 5. / 북극성 / 초기생성<br>
		 * 
		 * @param strUrlPrefix(필수):
		 *            문자열 ex) "vof"
		 * @param arrServiceKey(필수):
		 *            문자열배열 ex) ["판매형태","담당자","항공사"]
		 * @param fncCallBack(필수):
		 *            함수 ex) function(json_data){}
		 * @param strParam(선택):
		 *            파라미터 ex) "agencycd=" + airAgtCd + "&bcnccd=" + airBcncCd
		 * @returns boolean
		 */
		getJsonData : function(strUrlPrefix, arrServiceKey, fncCallBack, strParam) {

			//
			// step 1. check parameter
			if ($.util.isNull(strUrlPrefix)) {
				console.log($.commonMD.error_001_paramIsNull("commonBCD", "getJsonData", "strUrlPrefix"));
				return false;
			}

			if ($.util.isNull(arrServiceKey)) {
				console.log($.commonMD.error_001_paramIsNull("commonBCD", "getJsonData", "arrServiceKey"));
				return false;
			}
			if (arrServiceKey.length <= 0) {
				console.log($.commonMD.error_002_emptyArray("commonBCD", "getJsonData", "arrServiceKey"));
				return false;
			}
			if ($.util.isNull(fncCallBack)) {
				console.log($.commonMD.error_001_paramIsNull("commonBCD", "getJsonData", "fncCallBack"));
				return false;
			}

			//
			// step 2. reMapping service name
			for ( var i = 0, iFin = arrServiceKey.length; i < iFin; i++) {
				var oneServiceKey = arrServiceKey[i];
				// if (oneServiceKey == "환불상태") {
				// console.log("변경안내---[환불상태:N39] 는 기존코드 [환불상태:H15]와 중복되어 [환불상태2:N39]로 바꾸었습니다.");
				// }
				var oneType = typeof oneServiceKey;
				if (oneType == "string") {
					var strKey = oneServiceKey;
					var objValue = $.commonBCD._serviceMap[strKey];
					if ($.util.isNull(objValue)) { // not found
						console.log($.commonMD.error_004_unknownService("commonBCD", "getJsonData", strKey));
						return false;
					}
					// found: remapping
					objValue.key = strKey;
					arrServiceKey[i] = objValue;
				} else if (oneType == "object") {
					var strKey = oneServiceKey.key;
					var objValue = $.commonBCD._serviceMap[strKey];
					if ($.util.isNull(objValue)) { // not found
						console.log($.commonMD.error_004_unknownService("commonBCD", "getJsonData", strKey));
						return false;
					}
					// found: remapping
					for ( var leftValue in oneServiceKey) {
						var rightValue = oneServiceKey[leftValue];
						objValue[leftValue] = rightValue;
					}
					arrServiceKey[i] = objValue;
				} else { // bad ServiceKey 방어
					arrServiceKey.splice(i, 1);
					iFin--;
					i--;
				}
			}

			var params = "";
			if (strUrlPrefix == "vof") {
				if (!$.util.isNull(strParam)) {
					params += "?" + strParam;
				}
			} else {
				params = "?KSESID=" + gSsKey;
				if (!$.util.isNull(strParam)) {
					params += "&" + strParam;
				}
			}

			var subSystemId = ("vof" != strUrlPrefix) ? '/' + gTaskType.toLowerCase() : "";

			//
			// step 3. call inner function
			$.commonBCD._getJsonData("/" + strUrlPrefix + subSystemId + $.commonBCD._url + params, arrServiceKey, fncCallBack);
		},

		/**
		 * 함수설명 : 가져온 json_data를 이용해 콤보상자를 만드는 함수<br>
		 * 수정내역 : 2013. 3. 5. / 북극성 / 초기생성<br>
		 * 
		 * @param json_data(필수):
		 *            오브젝트 ex) json_data
		 * @param strServiceKey(필수):
		 *            문자열 ex) "판매형태"
		 * @param strSelector(필수):
		 *            문자열 ex) "#combo1"
		 * @param strFirstOption(필수):
		 *            문자열 ex) "_전체_" 또는 "_선택_" 또는 ""
		 * @param arrInitValue(필수):
		 *            문자열배열 ex) ["2"]
		 * @param arrCondition(선택):
		 *            문자열배열 ex) ["keycondition 1","value 1",..."keycondition n","value n"]
		 * @returns boolean
		 */
		js_fn_mkCombo : function(json_data, strServiceKey, strSelector, strFirstOption, arrInitValue, arrCondition) {
			// check selector
			var target = $(strSelector);
			var iTargetLen = target.size();
			if (iTargetLen == 0) {
				console.log($.commonMD.error_006_noSelectedObject("commonBCD", "js_fn_mkCombo", strSelector));
				return false;
			}

			// 핵심 data 가져오기.
			var arrObj = $.commonBCD._js_fn_mkArrayPair(json_data, strServiceKey, arrCondition);

			// 콤보 만들기.(multi select 지원됨)
			for ( var j = 0; j < iTargetLen; j++) {
				if (target[j].tagName != "SELECT") {
					console.log($.commonMD.error_007_noSelectTag("commonBCD", "js_fn_mkCombo", strSelector, j, target[j].tagName));
					continue;
				}

				var oneTarget = $(target[j]);
				oneTarget.html(""); // 콤보를 초기화한다.

				/*
				 * 2013-12-06 FirstOption 기능 개선 : 전한휴
				 */

				// AS-IS
				// if (strFirstOption == "_전체_") {
				// oneTarget.append("<option value='' >_전체_</option>");
				// } else if (strFirstOption == "_선택_") {
				// oneTarget.append("<option value='' >_선택_</option>");
				// }
				// TO-BE
				if (strFirstOption != "" && strFirstOption != null) {
					oneTarget.append("<option value='' >" + strFirstOption + "</option>");
				}

				var iFin = arrObj.length;

				for ( var i = 0; i < iFin; i++) {
					var one = arrObj[i];
					var strValue = one.value;
					var strText = one.label;

					// 콤보 만들기 계속
					if (arrInitValue == null) {
						var strTargetValue = oneTarget.attr('_value');
						if (strValue == strTargetValue) { // strText로 잘못되어 있는 것을 바꿈
							oneTarget.append("<option value='" + strValue + "' selected>" + strText + "</option>");
						} else {
							oneTarget.append("<option value='" + strValue + "'>" + strText + "</option>");
						}
					} else if (!$.util.isNull(arrInitValue[0])) {
						if (strValue == arrInitValue[0]) { // strText로 잘못되어 있는 것을 바꿈
							oneTarget.append("<option value='" + strValue + "' selected>" + strText + "</option>");
						} else {
							oneTarget.append("<option value='" + strValue + "'>" + strText + "</option>");
						}
					} else {
						oneTarget.append("<option value='" + strValue + "'>" + strText + "</option>");
					}
				}
			}
		},

		/**
		 * 함수설명 : 가져온 json_data를 이용해 라디오단추를 만드는 함수<br>
		 * 수정내역 : 2013. 3. 5. / 북극성 / 초기생성<br>
		 * 
		 * @param json_data(필수):
		 *            오브젝트 ex) json_data
		 * @param strServiceKey(필수):
		 *            문자열 ex) "판매형태"
		 * @param strSelector(필수):
		 *            문자열 ex) "#radio1"
		 * @param arrInitValue(필수):
		 *            문자열배열 ex) ["2"]
		 * @param arrCondition(선택):
		 *            문자열배열 ex) ["keycondition 1","value 1",..."keycondition n","value n"]
		 * @returns boolean
		 */
		js_fn_mkRadio : function(json_data, strServiceKey, strSelector, arrInitValue, arrCondition) {
			var target = $($(strSelector)[0]);
			var targetName = target.attr("name");

			// 핵심 data 가져오기.
			var arrObj = $.commonBCD._js_fn_mkArrayPair(json_data, strServiceKey, arrCondition);

			var bFirst = true;
			for ( var i = 0, iFin = arrObj.length; i < iFin; i++) {
				var one = arrObj[i];
				var strValue = one.value;
				var strText = one.label;

				// step 1-1. 라디오 버튼 준비하기
				var objRadio = $("<input>").attr({
					id : targetName + "_" + i,
					name : targetName,
					type : "radio",
					value : strValue,
					"class" : "k1_radio" // "k1_radio k1_m120"
				});
				// step 1-2. 라디오 버튼 초기값 처리
				if ((bFirst && arrInitValue[0] == "") || (strText == arrInitValue[0])) {
					objRadio.attr("checked", "checked");
				}
				// step 1-3. 라디오 버튼용 레이블 레이블 준비하기
				var objLabel = $("<label>").attr({
					"for" : targetName + "_" + i
				});
				// step 1-4. 라디오 버튼용 레이블 값 처리하기
				objLabel[0].innerHTML = strText;

				// step 1-5. 붙이기
				target.before(objRadio.after(objLabel));

				// <input id="xx_j" name="xx" type="radio" class="k1_radio" checked="checked" value="값(strValue)" />
				// <label for="xx_j">텍스트(strText)</label>

				bFirst = false;
			}

			// step 2. 삭제하기 <input id="xx" name="xx" type="radio" />
			target.remove(); // 위치 지정용 radio 삭제
		},

		/**
		 * 함수설명 : 가져온 json_data를 이용해 그리드에서 사용하는 콤보스트링을 만드는 함수<br>
		 * 수정내역 : 2013. 3. 5. / 북극성 / 초기생성<br>
		 * 
		 * @param json_data(필수):
		 *            오브젝트 ex) json_data
		 * @param strServiceKey(필수):
		 *            문자열 ex) "판매형태"
		 * @param arrInitValue(선택):
		 *            문자열배열 ex) ["2"]
		 * @returns String
		 */
		js_fn_mkComboString4grid : function(json_data, strServiceKey, strFirstOption, arrCondition) {
			var target = "";

			if (strFirstOption == "_전체_") {
				target += ":_전체_;";
			} else if (strFirstOption == "_선택_") {
				target += ":_선택_;";
			} else if (strFirstOption == "__") {
				target += ":;";
			}

			// 핵심 data 가져오기.
			var arrObj = $.commonBCD._js_fn_mkArrayPair(json_data, strServiceKey, arrCondition);

			for ( var i = 0, iFin = arrObj.length; i < iFin; i++) {
				var one = arrObj[i];
				var strValue = one.value;
				var strText = one.label;

				// step 1. 만들기
				target += strValue + ":" + strText + ";";
			}

			// step 2. delete last semi colon(;)
			var iLen = target.length;
			if (iLen > 0 && target.charAt(iLen - 1) == ";") {
				target = target.substring(0, iLen - 1);
			}
			// console.log("target=" + target);
			return target; // "1:aaa;2:bbb;3:ccc"
		},

		/**
		 * 함수설명 : 가져온 json_data를 Autocomplete에서 필요로 하는 json String으로 변형<br>
		 * 수정내역 : 2013. 3. 5. / 중국성 / 초기생성<br>
		 * 
		 * @param json_data(필수):
		 *            오브젝트 ex) json_data
		 * @param strServiceKey(필수):
		 *            문자열 ex) "판매형태"
		 * @param arrInitValue(선택):
		 *            문자열배열 ex) ["2"]
		 * @returns String
		 */
		js_fn_mkAutocompleteJson : function(json_data, strServiceKey) {
			var target = "[";

			// step 0.
			var myData = json_data.data[strServiceKey];
			if ($.util.isNull(myData)) {
				console.log($.commonMD.error_008_variableIsNull("commonBCD", "js_fn_mkAutocompleteJson", "myData"));
				return false;
			}
			var myServiceMap = $.commonBCD._serviceMap[strServiceKey];
			if ($.util.isNull(myServiceMap)) {
				console.log($.commonMD.error_008_variableIsNull("commonBCD", "js_fn_mkAutocompleteJson", "myServiceMap"));
				return false;
			}
			var myReaderMap = myServiceMap._readerMap;
			if ($.util.isNull(myReaderMap)) {
				myReaderMap = $.commonBCD._readerMap[myData.serviceName];
			}
			// step 1-0.

			// step 1-1.
			// var arrValueKey = new Array();
			var arrValueKey = [];
			var arrValue = myReaderMap.value;
			var len1 = arrValue.length;
			var data1 = myData.idxHeader;
			// for ( var i = 0, iFin = arrValue.length; i < iFin; i++) {
			// arrValueKey[i] = myData.idxHeader[arrValue[i]];
			// }
			for ( var i = 0; i < len1; i++) {
				arrValueKey[i] = data1[arrValue[i]];
			}
			// step 1-2.
			// var arrTextKey = new Array();
			var arrTextKey = [];
			var arrText = myReaderMap.text;
			var len2 = arrText.length;
			// for ( var i = 0, iFin = arrText.length; i < iFin; i++) {
			// arrTextKey[i] = myData.idxHeader[arrText[i]];
			// }
			for ( var i = 0; i < len2; i++) {
				arrTextKey[i] = data1[arrText[i]];
			}
			// step 2.
			var count = 1;
			var data2 = myData.arr2DimData;
			var len3 = data2.length;
			for ( var j = 0; j < len3; j++) {
				var one = data2[j];
				// step 2-1.
				var strValue = "";
				var len4 = arrValueKey.length;
				for ( var i = 0; i < len4; i++) {
					if (i != 0) {
						strValue += "-";
					}
					strValue += one[arrValueKey[i]];
				}
				// step 2-2.
				var strText = "";
				var len5 = arrTextKey.length;
				for ( var i = 0; i < len5; i++) {
					if (i != 0) {
						strText += "-";
					}
					strText += one[arrTextKey[i]];
				}
				// step 2-3.
				if (len3 == count) { // 마지막 "," 제거
					target += "{\"label\":\"" + strText + "\",\"value\":\"" + strValue + "\"}";
				} else {
					target += "{\"label\":\"" + strText + "\",\"value\":\"" + strValue + "\"},";
					count++;
				}
			}
			// for ( var j = 0, jFin = myData.arr2DimData.length; j < jFin; j++) {
			// var one = myData.arr2DimData[j];
			// // step 2-1.
			// var strValue = "";
			// for ( var i = 0, iFin = arrValueKey.length; i < iFin; i++) {
			// if (i != 0) {
			// strValue += "-";
			// }
			// strValue += one[arrValueKey[i]];
			// }
			// // step 2-2.
			// var strText = "";
			// for ( var i = 0, iFin = arrTextKey.length; i < iFin; i++) {
			// if (i != 0) {
			// strText += "-";
			// }
			// strText += one[arrTextKey[i]];
			// }
			// // step 2-3.
			// if (myData.arr2DimData.length == count) { // 마지막 "," 제거
			// target += "{\"label\":\"" + strText + "\",\"value\":\"" + strValue + "\"}";
			// } else {
			// target += "{\"label\":\"" + strText + "\",\"value\":\"" + strValue + "\"},";
			// count++;
			// }
			// }
			target += "]";

			// console.log("js_fn_mkAutocompleteJson >>" + target);
			return target;
		},

		/**
		 * 함수설명 : js_fn_mkXXXXX 의 inner function<br>
		 * 세부설명 : 가져온 json_data를 일반쌍(label:xx,value:yy)의 array로 변형<br>
		 * 수정내역 : 2013. 3. 5. / 북극성 / 초기생성<br>
		 * 
		 * @param json_data(필수):
		 *            오브젝트 ex) json_data
		 * @param strServiceKey(필수):
		 *            문자열 ex) "판매형태"
		 * @returns arrayObj 어레이오브렉트형 ex) [ {label:xx_1,value:yy_1},{label:xx_2,value:yy_2}...,{label:xx_n,value:yy_n} ]
		 */
		_js_fn_mkArrayPair : function(json_data, strServiceKey, arrCondition) {
			// step 0.
			var myData = null;
			try {
				myData = json_data.data[strServiceKey];
			} catch (e) {
				console.log("_js_fn_mkArrayPair error + " + strServiceKey);
			}

			if ($.util.isNull(myData)) {
				console.log($.commonMD.error_008_variableIsNull("commonBCD", "_js_fn_mkArrayPair", "myData : " + strServiceKey));
				return false;
			}
			var myServiceMap = $.commonBCD._serviceMap[strServiceKey];
			if ($.util.isNull(myServiceMap)) {
				console.log($.commonMD.error_008_variableIsNull("commonBCD", "_js_fn_mkArrayPair", "myServiceMap"));
				return false;
			}
			var myReaderMap = myServiceMap._readerMap;
			if ($.util.isNull(myReaderMap)) {
				myReaderMap = $.commonBCD._readerMap[myData.serviceName];
			}
			// step 1-0.

			// step 1-1.
			var arrValueKey = new Array();
			var arrValue = myReaderMap.value;
			for ( var i = 0, iFin = arrValue.length; i < iFin; i++) {
				arrValueKey[i] = myData.idxHeader[arrValue[i]];
			}
			// step 1-2.
			var arrTextKey = new Array();
			var arrText = myReaderMap.text;
			for ( var i = 0, iFin = arrText.length; i < iFin; i++) {
				arrTextKey[i] = myData.idxHeader[arrText[i]];
			}
			// step 1-3.
			var arrConditionKey = new Array();
			if (!$.util.isNull(arrCondition)) {
				for ( var k = 0, kFin = arrCondition.length; k < kFin; k += 2) {
					arrConditionKey[k] = myData.idxHeader[arrCondition[k]];
				}
			}

			// step 2.
			var arrayObj = new Array();
			for ( var j = 0, jFin = myData.arr2DimData.length; j < jFin; j++) {
				var one = myData.arr2DimData[j];

				// step 2-0. 별도 조건을 판단하여 continue(skip)할 것인지를 결정한다.
				if (!$.util.isNull(arrCondition)) {
					var bDoContinue = false;
					for ( var k = 0, kFin = arrCondition.length; k < kFin; k += 2) {
						// newVersion +
						var strInValue = arrCondition[k + 1];
						var arrInValue = strInValue.split("`");
						var bOrCondition = false;
						for ( var l = 0, lFin = arrInValue.length; l < lFin; l++) {
							bOrCondition = bOrCondition || (one[arrConditionKey[k]] == arrInValue[l]);
						}
						bDoContinue = bDoContinue || !bOrCondition;
						// newVersion -
						// oldVersion: bDoContinue = bDoContinue || (one[arrConditionKey[k]] != arrCondition[k + 1]);
						// console.log(bDoContinue + ":" + one[arrConditionKey[k]] + "," + arrCondition[k + 1]);
					}
					if (bDoContinue) {
						continue;
					}
				}

				// step 2-1.
				var strValue = "";
				for ( var i = 0, iFin = arrValueKey.length; i < iFin; i++) {
					if (i != 0) {
						strValue += "-";
					}
					strValue += one[arrValueKey[i]];
				}
				// step 2-2.
				var strText = "";
				for ( var i = 0, iFin = arrTextKey.length; i < iFin; i++) {
					if (i != 0) {
						strText += "-";
					}
					strText += one[arrTextKey[i]];
				}
				// step 2-3.
				arrayObj.push({
					label : strText,
					value : strValue
				});
			}

			return arrayObj;
		},

		/**
		 * 함수설명 : getJsonData의 inner function<br>
		 * 수정내역 : 2013. 3. 5. / 북극성 / 초기생성<br>
		 */
		_getJsonData : function(strUrl, arrServiceKey, fncCallBack) {
			// step 1. make param
			var jsonString = $.util._2Json(arrServiceKey);
			var param = "jsonroot=" + encodeURIComponent(jsonString);

			// step 2. call ajax
			$.ajax({
				type : "POST",
				dataType : "json",
				url : strUrl,
				data : param,
				success : function(json_data) {
					// 만약 성공했다면
					if (json_data.statusInfo.status != "FAILURE") {
						//
						// step 1. json 내부의 스트링 json을 풀어서 재세팅 한다.
						var objTmp = json_data.data;
						for ( var property in objTmp) {
							var value = objTmp[property];
							var jsonResultStr = value["jsonResult"];
							// console.log(jsonResultStr);
							var objImsi = null;
							eval("objImsi=" + jsonResultStr);
							// console.log(objImsi);
							objTmp[property] = objImsi; // $.parseJSON(jsonResultStr);
						}
						// 윗줄에서, 에러가 발생한다면, 서비스에서 생성하는 json에 문제가 있는 것이다.
						// 보통은 data에 작은따옴표(')가 있는 경우 발생했었다(이 문제는 방어된 상태)
						//
						// step 2. call back 함수를 호출한다.
						fncCallBack(json_data, strUrl);
					} else // 실패했다면
					{
						console.log($.commonMD.error_005_statusFailure("commonBCD", "_getJsonData", json_data.statusInfo.errorMessage,
								json_data.statusInfo.subErrorMessage));
						return false;
					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					console.log($.commonMD.error_003_ajaxFailure("commonBCD", "_getJsonData", textStatus, errorThrown));
					return false;
				}
			});
		},
		/**
		 * 함수설명 : getJsonData의 inner function<br>
		 * 수정내역 : 2013. 6. 5. / 북극성 / 초기생성<br>
		 */
		js_fn_mkCombo4value : function(json_data, strServiceKey, strSelector, strFirstOption, arrInitValue, arrCondition) {
			// check selector
			var target = $(strSelector);
			target.html("");// 콤보를 초기화한다.
			var iTargetLen = target.size();
			if (iTargetLen == 0) {
				console.log($.commonMD.error_006_noSelectedObject("commonBCD", "js_fn_mkCombo", strSelector));
				return false;
			}

			// 핵심 data 가져오기.
			var arrObj = $.commonBCD._js_fn_mkArrayPair(json_data, strServiceKey, arrCondition);

			// 콤보 만들기.(multi select 지원됨)
			for ( var i = 0; i < iTargetLen; i++) {
				var oneTarget = $(target[i]);
				if (strFirstOption == "_전체_") {
					oneTarget.append("<option value='' >_전체_</option>");
				} else if (strFirstOption == '_선택_') {
					oneTarget.append("<option value='' >_선택_</option>");
				}
				for ( var i = 0, iFin = arrObj.length; i < iFin; i++) {
					var one = arrObj[i];
					var strValue = one.value;
					var strText = one.label;

					// 콤보 만들기 계속
					if (!$.util.isNull(arrInitValue[0])) {
						if (strValue == arrInitValue[0]) {
							oneTarget.append("<option value='" + strValue + "' selected>" + strText + "</option>");
						} else {
							oneTarget.append("<option value='" + strValue + "'>" + strText + "</option>");
						}
					} else {
						oneTarget.append("<option value='" + strValue + "'>" + strText + "</option>");
					}
				}
			}

			// console.log(strServiceKey + ' : ' + oneTarget.html());
		},
		end_of_section : null
	};
})(jQuery);

/*--------------------------------------------------------------------*
 *
 * section : util 함수 확장(To Json)
 *
 * 섹션설명 : 임시로 util 함수를 확장한다.
 * 수정내역 : 2013. 03. 03. / 북극성 / 초기변경
 *
 * 제공함수 및 사용예:
 *
 *      사용방법 : var jsonString=$k1.util._2Json(objCoreOrginal);<br>
 *      되돌리기 : eval("objCoreTarget="+jsonString);<br>
 *
 *      서버로 보낼때 : var encodeJson=encodeURIComponent(jsonString);<br>
 *                    var url="....k1?jsonroot="+encodeJson;
 */
(function($) {
	$.util._2Json = function(obj) {
		switch (typeof obj) {
		case "undefined":
			return '"_undefined_"';
		case "boolean":
		case "number":
			return obj.toString();
		case "function":
			return obj.toString();
		case "string":
			return '"' + obj.toString().replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
		case "object":
			break;
		default:
			return '""';
		}
		// 여기부터 case "object"
		if (obj == null) {
			return "null";
		}
		// case "array"
		if (typeof (obj.length) != "undefined") {
			var results = [];
			for ( var i = 0, iLen = obj.length; i < iLen; i++) {
				var one = obj[i];
				results.push($.util._2Json(one));
			}
			return "[" + results.join(", ") + "]";
		}
		// case "object"
		var results = [];
		for ( var property in obj) {
			var one = $.util._2Json(obj[property]);
			results.push(property + " : " + one);
		}
		return "{" + results.join(", ") + "}";
	};

})(jQuery);

/*--------------------------------------------------------------------*
 *
 * section : util 함수 확장( _getParam)
 *
 * 섹션설명 : 임시로 util 함수를 확장한다.
 * 수정내역 : 2013. 03. 03. / 전한휴 / 초기변경
 *
 * 제공함수 및 사용예:
 *
 *      사용방법 : var value=$k1.util._getParam("aaa");<br>
 */
(function($) {
	$.util._getParam = function(strParamName) {
		var queryString = $.util._getQueryString();
		var arrMap = queryString.split("&");
		for ( var i = 0, iFin = arrMap.length; i < iFin; i++) {
			var arrPair = arrMap[i].split("=");
			if (arrPair[0] == strParamName) {
				return arrPair[1];
			}
		}
		return "";
	};
})(jQuery);

/*--------------------------------------------------------------------*
 *
 * section : util 함수 확장( _getQueryString)
 *
 * 섹션설명 : 임시로 util 함수를 확장한다.
 * 수정내역 : 2013. 03. 03. / 전한휴 / 초기변경
 *
 * 제공함수 및 사용예:
 *
 *      사용방법 : var strQueryString=$k1.util._getQueryString();<br>
 */
(function($) {
	$.util._getQueryString = function() {
		var url = window.location.toString();
		var arrUrl = url.split("?");
		// var pureUrl = arrUrl[0];
		var queryString = "";
		if (arrUrl.length == 2) {
			queryString = arrUrl[1];
		}
		return queryString;
	};
})(jQuery);

/*--------------------------------------------------------------------*
 *
 * section : util 함수 확장( _getPureUrl)
 *
 * 섹션설명 : 임시로 util 함수를 확장한다.
 * 수정내역 : 2013. 03. 03. / 전한휴 / 초기변경
 *
 * 제공함수 및 사용예:
 *
 *      사용방법 : var strUrl=$k1.util._getPureUrl();<br>
 */
(function($) {
	$.util._getPureUrl = function() {
		var url = window.location.toString();
		var arrUrl = url.split("?");
		var pureUrl = arrUrl[0];
		// var queryString = "";
		// if (arrUrl.length == 2) {
		// queryString = arrUrl[1];
		// }
		return pureUrl;
	};
})(jQuery);

/*--------------------------------------------------------------------*
 *
 * section : util 함수 확장( _getProgramId)
 *
 * 섹션설명 : 임시로 util 함수를 확장한다.
 * 수정내역 : 2013. 03. 03. / 전한휴 / 초기변경
 *
 * 제공함수 및 사용예:
 *
 *      사용방법 : var strUrl=$k1.util._getProgramId();<br>
 */
(function($) {
	$.util._getProgramId = function() {
		var url = window.location.toString();
		var REG_PROGRAM_ID = "[/]([A-Za-z0-9]*)[.]k1";

		return url.match(new RegExp(REG_PROGRAM_ID))[1];
	};
});
/* 2014-05-30 hyu */
/* IE8 Object.keys 기능 방어 코드 */
/* 근거 http://stackoverflow.com/questions/18912932/object-keys-not-working-in-internet-explorer */
if (!Object.keys) {
	Object.keys = function(obj) {
		var keys = [];

		for ( var i in obj) {
			if (obj.hasOwnProperty(i)) {
				keys.push(i);
			}
		}

		return keys;
	};
}