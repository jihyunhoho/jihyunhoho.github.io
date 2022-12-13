$(document).ready(function(){
	$(".k1_dimm_wrap").css({"left":"-100%"});
	
	// menu
	$(".menu_btn").click(function(){
		ftnFixHeight("open");
		$(".k1_slide_blind").show();
		$(".k1_dimm_wrap").animate({"left":"0"}, 300);
		return false;
	});
	$(".k1_menu_close").click(function(){
		ftnFixHeight("close");
		$(".k1_slide_blind").hide();
		$(".k1_dimm_wrap").animate({"left":"-100%"}, 300);
		return false;
	});

	// calendar
	$(".k1_calendar_btn").click(function(){
		$(".k1_slide_blind").show();
		$(".k1_calendar_wrap").show();
	});
	$(".k1_calendar_close").click(function(){
		$(".k1_slide_blind").hide();
		$(".k1_calendar_wrap").hide();
	});

	// mask(blind) hide
	$(".k1_slide_blind").click(function(){
		hideLayer();
		hidePopup();
		hideMask();
	});

	// condition tabview
	$(".tab01_view_btn").click(function(){
		hideTabview();
		removeTabClass()
		$(".k1_tabview.tab01").show();
		$(".k1_tab li.tab01").addClass("active");
	});
	$(".tab02_view_btn").click(function(){
		hideTabview();
		removeTabClass()
		$(".k1_tabview.tab02").show();
		$(".k1_tab li.tab02").addClass("active");
	});
	$(".tab03_view_btn").click(function(){
		hideTabview();
		removeTabClass()
		$(".k1_tabview.tab03").show();
		$(".k1_tab li.tab03").addClass("active");
	});
	$(".tab04_view_btn").click(function(){
		hideTabview();
		removeTabClass()
		$(".k1_tabview.tab04").show();
		$(".k1_tab li.tab04").addClass("active");
	});
	$(".tab05_view_btn").click(function(){
		hideTabview();
		removeTabClass()
		$(".k1_tabview.tab05").show();
		$(".k1_tab li.tab05").addClass("active");
	});

	// condition option content close
	$(".k1_tabview .close_btn").click(function(){
		hideTabview();
		$(".k1_tab li").removeClass("active");
	});

	// popup close
	$(".k1_pop h3 .close_btn").click(function(){
		hidePopup();
		hideMask();
	});

	// accordion fold
	$(".k1_accordion h3.unfold").click(function(){
		id = $(this).attr("data-id");
		$(this).removeClass("unfold");
		$(this).addClass("fold");
		$("#accd-" + id).css({
			"display": "block"	
		});
	});
});

function removeTabClass(){
	$(".k1_tab li").removeClass("active");
}

function hideTabview(){
	$(".k1_tabview.tab01").hide();
	$(".k1_tabview.tab02").hide();
	$(".k1_tabview.tab03").hide();
	$(".k1_tabview.tab04").hide();
}

function hidePopup(){
	$(".k1_pop_wrap").hide();
}

function chkPatten(field, patten){
	var engNameCheck = /^[a-zA-Z_\.\-\s]{0,30}$/;
	var mailCheck = /^([a-zA-Z0-9_\.\-\+])+$/;
	var NumCheck =/^[0-9]+$/;

	patten = eval(patten);

	if(!patten.test($("input[name="+field+"]").val())){
		return false;
	}else{
		return true;
	}
}

function ftnFixHeight(strState){
	if (strState == "open"){
		$(".k1_container").css({"overflow":"hidden","height":$(window).height()});
		$("body").css({"overflow":"hidden","height":$(window).height()});
	} else if (strState == "close"){
		$(".k1_container").css({"overflow":"visible","height":"auto"});
		$("body").css({"overflow":"visible","height":"auto"});
	}
}

function hideLayer(){
	$(".k1_dimm_wrap").animate({"left":"-100%"}, 300);
	$(".k1_calendar_wrap").hide();
}

function hideMask(){
	$(".k1_slide_blind").hide();
}