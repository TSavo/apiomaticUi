var services;
var jsonPath="/Orchestration/services/"
var currentUrl = $(location).attr('href');
var serviceName="";
var mainUrl=""
//Search function
function fnSearchAndFilter()
{
	$("#search-query").keyup(function(){
		$("#services-table").find("tr").hide();
		var data = this.value.split(" ");
		var jo = $("#services-table").find("tr");
		$.each(data, function(i, v)
		{
			jo = jo.filter(function(index){
				return ($(this).children(":first").text().indexOf(data)==0);
			});
		});
		jo.show();
	}).focus(function(){
		  this.value="";
		  $(this).css({"color":"black"});
		  $(this).unbind('focus');
	}).css({"color":"#C0C0C0"});

}

//function to return the type + href for methods
function fnReturnType(obj){
	for(i in obj){
		switch(obj[i]){
			case "string":
			case "int":
				return(obj[i]);
			break;
			case "array":
				for(j in obj){
					if(j=="nestedType"){
						var ref = obj[j];
						for(k in ref){	
							if(ref[k].indexOf("com")>=0){					
								return ("Type is an array of <a href=\"#"+ref[k].replace(/\./g,"-")+"\">"+ref[k]+"</a>");
							}else{
								return ("Type is an array of "+ref[k]);
							}
						}
					}
				}
				
			break;
			default:
				return("Type is <a href=\"#"+obj[i].replace(/\./g,"-")+"\">"+ obj[i]+"</a>");
			break;
		}
		
	}
}
//Display services page
function fnDisplayService(){
	window.location=currentUrl.substring(0,currentUrl.indexOf("?controller"));
}
//Display api details
function fnDisplayApiDetails(url){
//Hide services
	$("#indexdisplay").addClass("hide");
	$("#apiDisplay").removeClass("hide");
	
	//Controller
	var directive = {
		'div#mainurl b':'urls',		
		'div#controllerdoc':'documentation',
	}
	//Method
	directiveMethod = {
		'tbody':{
			'method<-methods':{
				"tr td.consumes": "#{method.consumes}",
				'tr.rowconsumes@class':function(arg){
					return arg.item.consumes=="" ? "hide" : "";
				},
				'tr td.headers': "#{method.headers}",
				'tr.rowheaders@class':function(arg){
					return arg.item.headers=="" ? "hide" : "";
				},
				'tr td.produces': "#{method.produces}",
				'tr.rowproduces@class':function(arg){
					return arg.item.produces=="" ? "hide" : "";
				},			
				'tr td.urls a': function(arg){
					return (mainUrl+arg.item.urls);
				},
				'tr td.urls a@href+': function(arg){
					return(String(arg.item.urls)).replace(/\{/g,"-").replace(/\}/g,"-").replace(/\//g,"-").replace(/\--/g,"-");					
				},
				'tr td.urls@id': function(arg){
					return(String(arg.item.urls)).replace(/\{/g,"-").replace(/\}/g,"-").replace(/\//g,"-").replace(/\--/g,"-");
				},
				
				'tr td.documentation': "#{method.documentation}",
				'tr.rowdoc@class':function(arg){
					return (arg.item.documentation=="" || arg.item.documentation==undefined) ? "hide" : "";
				},
				'tr td.apibody' : function(arg){
					return (fnReturnType(arg.item.body))
				},
				'tr.rowbody@class':function(arg){
					return (arg.item.body=="" || arg.item.body==undefined) ? "hide" : "";
				},	
				'tr td.methods': "#{method.methods}",
				'tr.rowmethods@class':function(arg){
					return arg.item.methods=="" ? "hide" : "";
				},	
				'tr td.params': "#{method.params}",	
				'tr.rowparams@class':function(arg){
					return arg.item.params=="" ? "hide" : "";
				},	
				'tr td.response' : function(arg){
					return (fnReturnType(arg.item.response))
				},
				'tr.rowresponse@class':function(arg){
					return (arg.item.response=="" || arg.item.response==undefined) ? "hide" : "";
				}

			}
		}
	};
	//Type Definition
	directiveMD={
		'div.repdiv':{
			'method<-typeDefinitions':{
				'div.type b a':function(arg){
					if(arg.item.abstractClass==true || arg.item.abstractClass=="true"){
						return (arg.item.type+" [ABSTRACT]");
					}else{
						return (arg.item.type);
					}
				},
				'div.type b a@href+':function(arg){
					return ((arg.item.type).replace(/\./g,"-"));
				},
				"div.type@id":function(arg){
					return (arg.item.type).replace(/\./g,"-");
				},
				"div.pane@style":function(arg){
					return ('display:none');
				},
														
				'table tr td.doc':"#{method.documentation}",
				'table tr.rowdoc@class':function(arg){
					return (arg.item.documentation=="" || arg.item.documentation==undefined) ? "hide" : "";
				},
				'table tr.rowprops@class':function(arg){
					return (arg.item.properties=="" || arg.item.properties==undefined) ? "hide" : "";
				},
				'table tr.properties':{
					"property <- method.properties" : {						
						"tr td.name+":function(arg){
							switch(arg.item.type)
							{
								case "string":
								case "int":
								case "boolean":
									return ("<b>"+arg.item.name+"</b> is of type "+arg.item.type);
								break;
								case "array": 
									var refObj = arg.item;
										for(j in refObj){
											if(j=="nestedType"){
												var ref = refObj[j];
												for(k in ref){
													return ("<b>"+ arg.item.name+"</b> is of  type "+"Array of <a href=\"#"+ref[k].replace(/\./g,"-")+"\">"+ref[k]+"</a>");
												}}}			
								break;
								default:
									return ("<b>"+arg.item.name+"</b> is of type "+"<a href=\"#"+(arg.item.type).replace(/\./g,"-")+"\">"+arg.item.type+"</a>");
								break;
							}
						},
						"tr td.name span.required@class":function(arg){
							if(arg.item.optional==false || arg.item.optional=="false"){
								return "required";
							}else{
								return "hide";
							}
						},
						"tr td.name div.alert": function(arg){
							if(arg.item.optional==false || arg.item.optional=="false"){
								return "Required value:" + arg.item.requiredValue;
							}else{
								return "";
							}
						 }
					}
				},
				'table tr td.subclass':function(arg){
					var str = "";
					var obj = arg.item.subclasses
					if(obj !="")
					{
						for(j in obj ){
							var ref = obj[j];
							for(k in ref){
								str += "<a href=\"#"+ref[k].replace(/\./g,"-")+"\">"+ref[k]+"</a>, ";
							}
						}
					}				
					return str;
				},
				'table tr.rowsub@class':function(arg){
					return (arg.item.subclasses=="") ? "hide" : "";
					
				}			
			}
		}
	};	
	//Load the api json
	$.getJSON(url, function(json) {
		$('div#apiTable').render(json, directive);
		if(json.urls != undefined){
			mainUrl = json.urls;
		}
		$('table#methodTemplate').render(json, directiveMethod);
		$('div#typeDefinition').render(json, directiveMD);
		if(serviceName.indexOf("#")>=0){
			//scroll to the type definition
			$(window.location.hash).ScrollTo();
			//Expand the type definition
			$(window.location.hash).next().css("display","block");
			if(!($(window.location.hash).parent().hasClass("rowurls"))){
				$(window.location.hash).removeClass('expandimg').addClass('collapseimg')
			}
			//Remove #id from the URL
			serviceName = serviceName.substring(0,serviceName.indexOf("#"));			
		}
		//API for ...
		$("#apititle").html(serviceName);
		//Hover for !	
		$(".required").hover(
			function () {
				$(this).next().removeClass('hide');
			},
			function () {
				$(this).next().addClass('hide');
			}
		);
		//Expand/collapse for type definition
		$(".type").click(function(){
			$(this).next().toggle(100, function(){
				if($(this).prev().hasClass('expandimg')){
					$(this).prev().removeClass('expandimg').addClass('collapseimg');
				}else{
					$(this).prev().removeClass('collapseimg').addClass('expandimg');
				}
			});
		});
		//On click expand the type definition
		$("table#methodTemplate tr td a[href]").click(function(e){
			var targetID = $(e.target).attr('href').replace(/\./g,"-");
			$(targetID).next().css("display","block");
			if(!($(targetID).parent().hasClass("rowurls"))){
				$(targetID).removeClass('expandimg').addClass('collapseimg');
			}
		})
		//Type definition properties
		$("tr.properties td a[href]").click(function(e){
			var targetID = $(e.target).attr('href').replace(/\./g,"-");
			$(targetID).next().css("display","block");
			$(targetID).removeClass('expandimg').addClass('collapseimg');
		})
		//Type definition subclass
		$("table#typeTemplate tr td a[href]").click(function(e){
			var targetID = $(e.target).attr('href').replace(/\./g,"-");
			$(targetID).next().css("display","block");
			$(targetID).removeClass('expandimg').addClass('collapseimg')
		})
	});
}

$(document).ready(function() {
	//check the url for ?controller
	if(currentUrl.indexOf("?controller")>=0){
		serviceName = currentUrl.substring(currentUrl.indexOf("=")+1,String(currentUrl).length);		
		var url = jsonPath+serviceName;
		fnDisplayApiDetails(url);
	}else{		
		var directive = {
			'tbody tr':{
				'services<-services':{
					"td.name a": "#{services.name}",
					"td.baseURL": "#{services.baseUrl}",
					"td.documentation": "#{services.documentation}"
				}
			}
		};	
		$.getJSON(jsonPath, function(json) {
			var jsObj = null;
			jsObj = {"services":json};
			$('table#services-table').render(jsObj, directive);
			fnSearchAndFilter();
			//define the click function for service name
			$('td.name a').click(function(){
				serviceName = $(this).html();
				window.location=currentUrl+"?controller="+$(this).html();			
			});		
		});
	}	
	
});