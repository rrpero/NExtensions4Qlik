define( [

	'jquery',
	'qlik',
	'ng!$q',
	'ng!$http',
	'../messages'


], function ($, qlik, $q, $http) {
    'use strict';
	//Define the current application

	var showTo =  function (a,d){
				if(a.indexOf(d.polar) >=0)
					return true;
				return false;
	};	
	var show={};	
	
	//var language="pt-BR";
	//var language="en-US";
	var language = navigator.language || navigator.userLanguage; 
	language = language.replace("-","_");

	if(language!="pt_BR" && language!="en_US")
		language = "en_US";
	
	
	var app = qlik.currApp();

	var maxDimensions=2;
	var maxMeasures = 20;
    // *****************************************************************************
    // Dimensions & Measures
    // *****************************************************************************
    var dimensions = {
        uses: "dimensions",
        min: 0,
        max: 5,
		show:function(d){
			console.log(d);
		}
    };

	
	show['measures']={};
	show['measures']['showHProgress']=["hprogress"];
	var showHProgress = {
									//type: "string",
									ref: "qDef.showHProgress",
									label: messages[language].TEXT_COA_HPROGRESS,
									type: "string",
									component: "dropdown",
									options: [{
										value: "hprogress",
										label: messages[language].HPROGRESS
									}, {
										value: "circleArrow",
										label: messages[language].CIRCLE_ARROW
									}, {
										value: "text",
										label: messages[language].TEXT
									}],
									defaultValue: "text",
									show: function (d,a){
										//console.log(d);
										//console.log(a);
										
										return showTo(show['measures']['showHProgress'],a.layout);

									}
						};

	show['measures']['cellFontColor']=["hprogress"];						
	var cellFontColor = {
									type: "string",
									//ref: "qDef.cellFontColor",
									ref: "qAttributeExpressions.0.qExpression",									
									label: messages[language].CELL_FONT_COLOR,
									component:"expression",
									expressionType:"measure",									
									defaultValue: "='black'",
									show: function (d,a){
										//console.log(d);
										//console.log(a);
										
										return showTo(show['measures']['cellFontColor'],a.layout)&& !(d.qDef.showHProgress=="hprogress");

									}
						};	

	show['measures']['circleArrow']=["hprogress"];						
	var circleArrow = {
									type: "string",
									//ref: "qDef.circleArrow",
									ref: "qAttributeExpressions.1.qExpression",									
									label: messages[language].CIRCLE_OR_ARROW,
									component:"expression",
									expressionType:"measure",									
									defaultValue: "='circle'",
									show: function (d,a){
										//console.log(d);
										//console.log(a);
										
										return showTo(show['measures']['circleArrow'],a.layout)&& (d.qDef.showHProgress=="circleArrow");

									}
						};						
						
	show['measures']['minHProgress']=["hprogress"];						
	var minHProgress = {
			type: "string",
			label: messages[language].MIN,
			component:"expression",
			expressionType:"measure",			
			//ref: "qDef.minHProgress",
			ref: "qAttributeExpressions.0.qExpression",
			//component:"color-picker",
			expression: "always",
			defaultValue: "0",
			show: function (d,a) {
				//console.log(d.qDef);
				//console.log(a);
				//return showTo(show['measures']['minHProgress'],a.layout);
				return d.qDef.showHProgress=="hprogress";
			}				
			
	};

	show['measures']['maxHProgress']=["hprogress"];						
	var maxHProgress = {
			type: "string",
			label: messages[language].MAX,
			component:"expression",
			expressionType:"measure",			
			//ref: "qDef.maxHProgress",
			ref: "qAttributeExpressions.1.qExpression",
			//component:"color-picker",
			expression: "optional",
			defaultValue: "1",
			show: function (d,a) {
				//return showTo(show['measures']['maxHProgress'],a.layout);
				return d.qDef.showHProgress=="hprogress";
			}				
			
	};

	show['measures']['segment1']=["hprogress"];						
	var segment1 = {
			type: "string",
			label: messages[language].SEGMENT_1,
			component:"expression",
			expressionType:"measure",			
			//ref: "qDef.segment1",
			ref: "qAttributeExpressions.2.qExpression",
			//component:"color-picker",
			expression: "optional",
			defaultValue: "0.2",
			show: function (d,a) {
				//return showTo(show['measures']['segment1'],a.layout);
				return d.qDef.showHProgress=="hprogress";
			}				
			
	};

	show['measures']['segment1Color']=["hprogress"];						
	var segment1Color = {
			type: "string",
			component:"expression",
			expressionType:"measure",
			label: messages[language].SEGMENT_1_COLOR,
			//ref: "qDef.segment1Color",
			ref: "qAttributeExpressions.3.qExpression",
			//component:"color-picker",
			expression: "optional",
			defaultValue: "='red'",
			show: function (d,a) {
				//return showTo(show['measures']['segment1Color'],a.layout);
				return d.qDef.showHProgress=="hprogress";
			}				
			
	};	
	
	show['measures']['segment2']=["hprogress"];						
	var segment2 = {
			type: "string",
			label: messages[language].SEGMENT_2,
			component:"expression",
			expressionType:"measure",			
			//ref: "qDef.segment2",
			ref: "qAttributeExpressions.4.qExpression",
			//component:"color-picker",
			expression: "optional",
			defaultValue: "0.4",
			show: function (d,a) {
				//return showTo(show['measures']['segment2'],a.layout);
				return d.qDef.showHProgress=="hprogress";
			}				
			
	};
	
	show['measures']['segment2Color']=["hprogress"];						
	var segment2Color = {
			type: "string",
			label: messages[language].SEGMENT_2_COLOR,
			component:"expression",
			expressionType:"measure",			
			//ref: "qDef.segment2Color",
			ref: "qAttributeExpressions.5.qExpression",
			//component:"color-picker",
			expression: "optional",
			defaultValue: "='yellow'",
			show: function (d,a) {
				//return showTo(show['measures']['segment2Color'],a.layout);
				return d.qDef.showHProgress=="hprogress";
			}				
			
	};	

	show['measures']['segment3']=["hprogress"];						
	var segment3 = {
			type: "string",
			label: messages[language].SEGMENT_3,
			component:"expression",
			expressionType:"measure",			
			//ref: "qDef.segment3",
			ref: "qAttributeExpressions.6.qExpression",
			//component:"color-picker",
			expression: "optional",
			defaultValue: "1",
			show: function (d,a) {
				//return showTo(show['measures']['segment3'],a.layout);
				return d.qDef.showHProgress=="hprogress";
			}				
			
	};	
	
	show['measures']['segment3Color']=["hprogress"];						
	var segment3Color = {
			type: "string",
			label: messages[language].SEGMENT_3_COLOR,
			component:"expression",
			expressionType:"measure",			
			//ref: "qDef.segment3Color",
			ref: "qAttributeExpressions.7.qExpression",
			//component:"color-picker",
			expression: "optional",
			defaultValue: "='green'",
			show: function (d,a) {
				//return showTo(show['measures']['segment3Color'],a.layout);
				return d.qDef.showHProgress=="hprogress";
			}				
			
	};	
	
    var measures = {
        uses: "measures",
        min: 0,
        max: 20,
		items: {
			showHProgress:showHProgress,
			minHProgress:minHProgress,
			maxHProgress:maxHProgress,
			segment1:segment1,
			segment1Color:segment1Color,
			segment2:segment2,
			segment2Color:segment2Color,
			segment3:segment3,
			segment3Color:segment3Color,
			cellFontColor:cellFontColor,
			circleArrow:circleArrow
			
					}
		/*,
		items: {
			labelColor: {
                        type: "string",
                        ref: "qDef.labelColor",
                        label: "Label color",
                        expression: "always",
                        defaultValue: "#545352"
                    }
		}
		*/
    };

    // *****************************************************************************
    // Appearance Section
    // *****************************************************************************
    var appearanceSection = {
        uses: "settings"
    };
	
	// *****************************************************************************
    // Sorting Section
    // *****************************************************************************
    var sortingSection = {
        uses: "sorting"
    };
	
	// *****************************************************************************
    // Options Section
    // *****************************************************************************



	

	show['options']={};
	show['options']['rotateType']=["wordCloudChart"];
	
	var rotateType = {
			type: "string",
			component: "dropdown",
			label: messages[language].ROTATE_TYPE,
			
			//label:app.GetLocaleInfo().qReturn.qCollation,
			ref: "rotateType",
			options: [{
				value: "random2",
				label: messages[language].RANDOM2
			}, 
			{
				value: "random7",
				label: messages[language].RANDOM7
			},
			{
				value: "fixed1",
				label: messages[language].FIXED1
			},
			{
				value: "fixed2",
				label: messages[language].FIXED2
			},
			{
				value: "fixed3",
				label: messages[language].FIXED3
			},
			{
				value: "fixed4",
				label: messages[language].FIXED4
			},
			{
				value: "fixed5",
				label: messages[language].FIXED5
			},
			{
				value: "fixed7",
				label: messages[language].FIXED7
			}
			],
			defaultValue: "random2",
			show: function (d){
				return showTo(show['options']['rotateType'],d);

			}				
	};

	show['options']['factor']=["radar","funnel","polar"];
	var factor = {
			type: "integer",
			label: messages[language].FACTOR,
			ref: "factor",
			//component: "slider",
			min: 0,
			//max: 200,
			//step: 1,			
			//expression: "always",
			defaultValue: 0,
			show: function (d){
				return showTo(show['options']['factor'],d);

			}
	};	
	

	show['options']['minTextSize']=["wordCloudChart"];
	var minTextSize = {
			type: "integer",
			label: messages[language].MIN_TEXT_SIZE,
			ref: "minTextSize",
			component: "slider",
			min: 5,
			max: 200,
			step: 1,			
			//expression: "always",
			defaultValue: 15,
			show: function (d){
				return showTo(show['options']['minTextSize'],d);

			}
	};	

	
	

	show['options']['maxTextSize']=["wordCloudChart"];
	var maxTextSize = {
			type: "integer",
			label: messages[language].MAX_TEXT_SIZE,
			ref: "maxTextSize",
			component: "slider",
			min: 1,
			max: 20,
			step: 0.5,			
			//expression: "always",
			defaultValue: 4,
			show: function (d){
				return showTo(show['options']['maxTextSize'],d);

			}
	};	

	
	var polar = {
		type: "string",
		component: "dropdown",
		label: messages[language].CHART_TYPE,
		ref: "polar",
		options: [{
			value: "polar",
			label: messages[language].POLAR
		}, 
		{
			value: "biPartite",
			label: messages[language].BIPARTITE
		}, {
			value: "radar",
			label: messages[language].RADAR
		}, {
			value: "funnel",
			label: messages[language].FUNNEL
		}, {
			value: "waterfall",
			label: messages[language].WATERFALL
		}, {
			value: "wordCloudChart",
			label: messages[language].WORDCLOUD
		}, {
			value: "gantt",
			label: messages[language].GANTT
		}, {
			value: "bumps",
			label: messages[language].BUMPS
		}, {
			value: "hprogress",
			label: messages[language].HPROGRESS
		}, {
			value: "heatbrick",
			label: messages[language].HEATBRICK
		}],
		defaultValue: "polar"
	};	
	
	show['options']['rangesScale']=["heatbrick"];
	var rangesScale = {
			type: "integer",
			label: messages[language].RANGES_SCALE,
			ref: "rangesScale",
			//component: "slider",
			min: 1,
			max: 20,
			//step: 0.5,			
			//expression: "always",
			defaultValue: 5,
			show: function (d){
				return showTo(show['options']['rangesScale'],d);

			}
	};

	show['options']['borderIn']=["hprogress"];
	var borderIn = {
			type: "integer",
			label: messages[language].BORDER_IN,
			ref: "borderIn",
			//component: "slider",
			min: 0,
			max: 20,
			//step: 0.5,			
			//expression: "always",
			defaultValue: 1,
			show: function (d){
				return showTo(show['options']['borderIn'],d);

			}
	};

	show['options']['borderOut']=["hprogress"];
	var borderOut = {
			type: "integer",
			label: messages[language].BORDER_OUT,
			ref: "borderOut",
			//component: "slider",
			min: 0,
			max: 20,
			//step: 0.5,			
			//expression: "always",
			defaultValue: 1,
			show: function (d){
				return showTo(show['options']['borderOut'],d);

			}
	};
	
	

	

	var palette = {
			type: "string",
			component: "dropdown",
			label: messages[language].COLORS,
			ref: "palette",
			options: [{
				value: "standard",
				label: messages[language].STANDARD_QS
			},{
				value: "colored",
				label: messages[language].COLORED
			},{
				value: "analogue1",
				label: messages[language].ANALOGUE1
			},{
				value: "analogue2",
				label: messages[language].ANALOGUE2
			},{
				value: "yellowRed",
				label: messages[language].YELLOWRED
			},{
				value: "whiteBlue",
				label: messages[language].WHITEBLUE
			},{
				value: "brazil",
				label: messages[language].BRAZIL
			}
			
			],
			defaultValue: "analogue1"
	};


	show['options']['transparent']=["radar","funnel","waterfall","polar"];		
	var transparent = {
		type: "float",
		label: messages[language].TRANSPARENT,
		ref: "transparent",
		component: "slider",
		min: 0.1,
		max: 1,
		step: 0.1,			
		//expression: "always",
		defaultValue: 1,
		show: function (d){
			return showTo(show['options']['capitalize'],d);

		}
	};		



	show['options']['capitalize']=["wordCloudChart"];	
	var capitalize = {
			type: "string",
			component: "dropdown",
			label: messages[language].CAPITALIZE,
			ref: "capitalize",
			options: [{
				value: "capitalize",
				label: messages[language].CAPITALIZE
			},{
				value: "upper",
				label: messages[language].UPPER
			}
			
			],
			defaultValue: "upper",
			show: function (d){
				return showTo(show['options']['capitalize'],d);

			}			
	};		
	

	show['options']['border']=["wordCloudChart","polar"];		
	var border = {
		type: "boolean",
		component: "switch",
		label: messages[language].BORDER,
		ref: "border",
		options: [{
			value: true,
			label: messages[language].YES
		}, {
			value: false,
			label: messages[language].NO
		}],
		defaultValue: false,
		show: function (d){
			return showTo(show['options']['border'],d);

		}	
	};
	
	show['options']['borderSize']=["polar"];
	var borderSize = {
			type: "integer",
			//component: "switch",
			label: messages[language].BORDER_SIZE,
			ref: "borderSize",
			min: 0,
			max: 20,			
			defaultValue: 0,
			show: function (d) {
				return d.border && showTo(show['options']["borderSize"],d);
			}
		};	

	
//	messages[language].GRID = "Grid";
/*	var grid = {
		type: "boolean",
		component: "switch",
		label: messages[language].GRID,
		ref: "grid",
		options: [{
			value: true,
			label: messages[language].YES
		}, {
			value: false,
			label: messages[language].NO
		}],
		defaultValue: true
	};	*/	

	
	show['options']['marginSlices']=["polar"];
	var marginSlices = {
			type: "boolean",
			component: "switch",
			label: messages[language].MARGIN_SLICES,
			ref: "marginSlices",
			options: [{
				value: true,
				label: messages[language].YES
			}, {
				value: false,
				label: messages[language].NO
			}],
			defaultValue: false,
			show: function (d) {
				return showTo(show['options']["marginSlices"],d);
			}
		};

	show['options']['marginSlicesSize']=["polar"];
	var marginSlicesSize = {
			type: "integer",
			//component: "switch",
			label: messages[language].MARGIN_SLICES_SIZE,
			ref: "marginSlicesSize",
			min: 0,
			max: 10,			
			defaultValue: 0,
			show: function (d) {
				return d.marginSlices && showTo(show['options']["marginSlicesSize"],d);
			}
		};		

	show['options']['grid']=["polar","radar"];

	var grid = {
			type: "integer",
			//component: "switch",
			label: messages[language].GRID,
			ref: "grid",
			defaultValue: 1,
			min: 0,
			max: 200,
			show: function (d){
				return showTo(show['options']['grid'],d);

			}			
		
		};	
	
	show['options']['gridDotted']=["radar"];
	var gridDotted = {
			type: "boolean",
			component: "switch",
			label: messages[language].GRID_DOTTED,
			ref: "gridDotted",
			options: [{
				value: true,
				label: messages[language].YES
			}, {
				value: false,
				label: messages[language].NO
			}],
			defaultValue: true,
			show: function (d) {
				return showTo(show['options']["gridDotted"],d);
			}
		};


	show['options']['gridCircle']=["radar"];
	var gridCircle = {
			type: "string",
			component: "switch",
			label: messages[language].GRID_CIRCLE,
			ref: "gridCircle",
			options: [{
				value: false,
				label: messages[language].CIRCLE
			}, {
				value: true,
				label: messages[language].POLYGON
			}],
			defaultValue: true,
			show: function (d) {
				return showTo(show['options']["gridCircle"],d);
			}
		};

	show['options']['gridSpokes']=["radar","polar"];
	var gridSpokes = {
			type: "boolean",
			component: "switch",
			label: messages[language].GRID_SPOKES,
			ref: "gridSpokes",
			options: [{
				value: true,
				label: messages[language].YES
			}, {
				value: false,
				label: messages[language].NO
			}],
			defaultValue: true,
			show: function (d) {
				return showTo(show['options']["gridSpokes"],d);
			}
		};		
	
	show['options']['max']=["radar"];		
	var max = {
		type: "float",
		label: messages[language].MAX,
		ref: "max",
		component: "slider",
		min: 0.05,
		max: 2,
		step: 0.05,			
		//expression: "always",
		defaultValue: 1,
		show: function (d){
			return showTo(show['options']['max'],d);

		}
	};	

/*
	show['options']['gridRadials']=["polar"];

	var gridRadials = {
			type: "integer",
			//component: "switch",
			label: messages[language].GRID_RADIALS,
			ref: "gridRadials",
			defaultValue: null,
			min: 0,
			max: 200,
			show: function (d) {
				return showTo(show['options']["gridRadials"],d);
			}
		};	
*/	
	
	

	

	show['options']['axes']=["polar"];	
	var axes = {
			type: "boolean",
			component: "switch",
			label: messages[language].AXES,
			ref: "axes",
			options: [{
				value: true,
				label: messages[language].YES
			}, {
				value: false,
				label: messages[language].NO
			}],
			defaultValue: false,
			show: function (d) {
				return showTo(show['options']["axes"],d);
			}	
	};		
	

	show['options']['backgroundColor']=["polar","funnel","radar","waterfall","wordCloudChart"];		
	var backgroundColor = {
			type: "string",
			label: messages[language].BACKGROUND_COLOR,
			ref: "backgroundColor",
			component:"color-picker",
			//expression: "always",
			defaultValue: "#ffffff",
			show: function (d) {
				return showTo(show['options']["backgroundColor"],d);
			}				
			
	};	
	
	/*
	var keepColors = {
			type: "boolean",
			component: "switch",
			label: messages[language].KEEP_COLORS,
			ref: "keepColors",
			options: [{
				value: true,
				label: messages[language].ON
			}, {
				value: false,
				label: messages[language].OFF
			}],
			defaultValue: false
	};		*/
	

	show['options']['chartLabels']=["polar","funnel","bumps"];
	var chartLabels = {
			type: "boolean",
			component: "switch",
			label: messages[language].SHOW_LABELS,
			ref: "chartLabels",
			options: [{
				value: true,
				label: messages[language].ON
			}, {
				value: false,
				label: messages[language].OFF
			}],
			defaultValue: true,
			show: function (d) {
				return showTo(show['options']["chartLabels"],d);
			}	
	};
/*	
	show['options']['valueInLabels']=["radar"];
	var valueInLabels = {
			type: "boolean",
			component: "switch",
			label: messages[language].VALUE_IN_LABELS,
			ref: "valueInLabels",
			options: [{
				value: true,
				label: messages[language].ON
			}, {
				value: false,
				label: messages[language].OFF
			}],
			defaultValue: false,
			show: function (d) {
				return showTo(show['options']["valueInLabels"],d);
			}	
	};	
*/	

	show['options']['fontColor']=["biPartite"];
	var fontColor = {
			type: "string",
			label: messages[language].FONT_COLOR,
			ref: "fontColor",
			component:"color-picker",
			//expression: "always",
			defaultValue: "#190000",
			show: function (d) {
				return showTo(show['options']["fontColor"],d);
			}
	};		


	show['options']['showvalues']=["polar","funnel","radar","waterfall","biPartite","bumps"];
	var showvalues = {
			type: "boolean",
			component: "switch",
			label: messages[language].SHOW_VALUES,
			ref: "showvalues",
			options: [{
				value: true,
				label: messages[language].ON
			}, {
				value: false,
				label: messages[language].OFF
			}],
			defaultValue: true,
			show: function (d) {
				return showTo(show['options']["showvalues"],d);
			}	
	};
	
	show['options']['modeOneSticker']=["gantt"];
	var modeOneSticker = {
			type: "boolean",
			component: "switch",
			label: messages[language].MODE_ONE_STICKER,
			ref: "modeOneSticker",
			options: [{
				value: true,
				label: messages[language].ON
			}, {
				value: false,
				label: messages[language].OFF
			}],
			defaultValue: false,
			show: function (d) {
				return showTo(show['options']["modeOneSticker"],d);
			}	
	};	
	
	show['options']['timeFormat']=["gantt"];
	var timeFormat = {
			type: "string",
			component: "dropdown",
			label: messages[language].TIME_FORMAT,
			ref: "timeFormat",
			options: [{
				value: "%m/%Y",
				label: messages[language].MONTH_BAR_YEAR
			}, {
				value: "%Y-%m-%dT%I:%M:%S",
				label: messages[language].YEAR_DASH_MONTH_DASH_DAY_T_HOUR_MINUTE_SECOND
			}, {
				value: "%d/%m/%Y",
				label: messages[language].DAY_BAR_MONTH_BAR_YEAR
			}],
			defaultValue: "%m/%Y",
			show: function (d) {
				return showTo(show['options']["timeFormat"],d);
			}	
	};	
	
	show['options']['offset']=["gantt"];
	var offset = {
			type: "integer",
			//component: "switch",
			label: messages[language].OFFSET,
			ref: "offset",
			defaultValue: "1",
			min: "0",
			max: "100000",
			show: function (d) {
				return showTo(show['options']["offset"],d);
			}	
	};	

	show['options']['ticks']=["gantt"];		
	var ticks = {
		type: "integer",
		label: messages[language].TICKS,
		ref: "ticks",
		component: "slider",
		min: 1,
		max: 40,
		step: 1,			
		//expression: "always",
		defaultValue: 5,
		show: function (d){
			return showTo(show['options']['ticks'],d);

		}
	};	

	show['options']['spaceTasksLeft']=["gantt"];
	var spaceTasksLeft = {
			type: "float",
			label: messages[language].SPACE_TASKS_LEFT,
			ref: "spaceTasksLeft",
			component: "slider",
			min: 1,
			max: 30,
			step: 0.5,			
			//expression: "always",
			defaultValue: 6,
			show: function (d) {
				return showTo(show['options']["spaceTasksLeft"],d);
			}	
	};		
	
	

	show['options']['labelsApprox']=["polar"];
	var labelsApprox = {
		type: "float",
		label: messages[language].APPROX,
		ref: "labelsApprox",
		component: "slider",
		min: 0.1,
		max: 1,
		step: 0.1,			
		//expression: "always",
		defaultValue: 1,
		show: function (d) {
			return showTo(show['options']["labelsApprox"],d);
		}			
	};	
	

	show['options']['labelTextSize']=["polar","waterfall","radar","funnel","biPartite"];
	var labelTextSize = {
		type: "integer",
		label: messages[language].LABEL_TEXT_SIZE,
		ref: "labelTextSize",
		component: "slider",
		min: 10,
		max: 200,
		step: 1,			    
						
		//expression: "always",
		defaultValue: 100,
		show:true,
		show: function (d) {
			return showTo(show['options']["labelTextSize"],d);
		}	
	};		
	


	show['options']['bold']=["biPartite","wordCloudChart"];	
	var bold = {
			type: "string",
			component: "dropdown",
			label: messages[language].BOLD,
			ref: "bold",
			options: [{
				value: "normal",
				label: messages[language].NORMAL
			},{
				value: "bold",
				label: messages[language].BOLD
			}
			
			],
			defaultValue: "bold",
			show: function (d) {
				return showTo(show['options']["bold"],d);
			}	
	};
	

	show['options']['labelIn']=["biPartite"];		
	var labelIn = {
			type: "string",
			component: "dropdown",
			label: messages[language].LABEL_IN,
			ref: "labelIn",
			options: [{
				value: "in",
				label: messages[language].LABEL_IN
			},{
				value: "out",
				label: messages[language].LABEL_OUT
			}
			
			],
			defaultValue: "out",
			show: function (d) {
				return showTo(show['options']["labelIn"],d);
			}	
	};


	

	
	
	var Options = {
		type:"items",
		label:messages[language].ITEM_OPTIONS,
		items: {			

			polar:polar,
			factor:factor,
			rotateType:rotateType,
			minTextSize:minTextSize,
			maxTextSize:maxTextSize,
			capitalize:capitalize,			
			palette:palette,
			transparent:transparent,
			border:border,
			borderSize:borderSize,
			grid:grid,
			marginSlices:marginSlices,
			marginSlicesSize:marginSlicesSize,
			//gridRadials:gridRadials,
			gridSpokes:gridSpokes,
			gridDotted:gridDotted,
			gridCircle:gridCircle,
			axes:axes,
			backgroundColor:backgroundColor,
			chartLabels:chartLabels,
//			valueInLabels:valueInLabels,
			fontColor:fontColor,
			showvalues:showvalues,
			labelTextSize:labelTextSize,
			labelIn:labelIn,
			bold:bold,
			labelsApprox:labelsApprox,
			max:max,
			modeOneSticker:modeOneSticker,
			timeFormat:timeFormat,
			offset:offset,
			ticks:ticks,
			spaceTasksLeft:spaceTasksLeft,
			rangesScale:rangesScale,
			borderIn:borderIn,
			borderOut:borderOut
			
			//,keepColors:keepColors

			//,thousandSeparator:thousandSeparator
			//,decimalSeparator:decimalSeparator
		},
		show: true
	
	};
	
	show['advanced']={};
	var advancedInstanceLimit = {
		type: "integer",
		//component: "switch",
		label: messages[language].ADVANCED_INSTANCE_LIMIT,
		ref: "advancedInstanceLimit",
		defaultValue: "300",
		min: "0",
		max: "100000",
		show: true			
	};
	
	show['advanced']['suppressZeroValues']=["hprogress"];		
	var suppressZeroValues = {
		type: "boolean",
		component: "switch",
		label: messages[language].SUPPRESS_ZERO_VALUES,
		ref: "suppressZeroValues",
		options: [{
			value: true,
			label: messages[language].YES
		}, {
			value: false,
			label: messages[language].NO
		}],
		defaultValue: false,
		show: function (d){
			return showTo(show['advanced']['suppressZeroValues'],d);

		}	
	};	
	
	show['advanced']['advancedScroll']=["gantt"];		
	var advancedScroll = {
		type: "boolean",
		component: "switch",
		label: messages[language].ADVANCED_SCROLL,
		ref: "advancedScroll",
		options: [{
			value: true,
			label: messages[language].YES
		}, {
			value: false,
			label: messages[language].NO
		}],
		defaultValue: false,
		show: function (d){
			return showTo(show['advanced']['advancedScroll'],d);

		}	
	};	
	
	var Advanced = {
		type:"items",
		label:messages[language].ITEM_ADVANCED,
		items: {			

			advancedInstanceLimit:advancedInstanceLimit,
			advancedScroll:advancedScroll,
			suppressZeroValues:suppressZeroValues
		},
		show: true
	
	};	
	
	
	
	

	show['biPartite']={};
	show['biPartite']['edgeMode']=["biPartite"];
	var edgeMode = {
			type: "string",
			component: "dropdown",
			label: messages[language].EDGE_MODE,
			
			//label:app.GetLocaleInfo().qReturn.qCollation,
			ref: "edgeMode",
			options: [{
				value: "curved",
				label: messages[language].CURVED
			}, 
			{
				value: "straight",
				label: messages[language].STRAIGHT
			}
			],
			defaultValue: "curved",
			show: function (d) {
				return showTo(show['biPartite']["edgeMode"],d);
			}			
	};		


	show['biPartite']['spaceLabelRight']=["biPartite"];
	var spaceLabelRight = {
			type: "integer",
			label: messages[language].SPACE_LABEL_RIGHT,
			ref: "spaceLabelRight",
			component: "slider",
			min: 0,
			max: 5,
			step: 0.5,			
			//expression: "always",
			defaultValue: 2,
			show: function (d) {
				return showTo(show['biPartite']["spaceLabelRight"],d);
			}	
	};


	show['biPartite']['spaceLabelLeft']=["biPartite"];
	var spaceLabelLeft = {
			type: "integer",
			label: messages[language].SPACE_LABEL_LEFT,
			ref: "spaceLabelLeft",
			component: "slider",
			min: 0,
			max: 5,
			step: 0.5,			
			//expression: "always",
			defaultValue: 2,
			show: function (d) {
				return showTo(show['biPartite']["spaceLabelLeft"],d);
			}	
	};	
	
	

	show['biPartite']['pad']=["biPartite"];
	var pad = {
			type: "integer",
			label: messages[language].PAD,
			ref: "pad",
			component: "slider",
			min: 0,
			max: 10,
			step: 0.5,			
			//expression: "always",
			defaultValue: 2,
			show: function (d) {
				return showTo(show['biPartite']["pad"],d);
			}	
	};
	

	show['biPartite']['orient']=["biPartite"];
	var orient = {
			type: "string",
			component: "dropdown",
			label: messages[language].ORIENT,
			ref: "orient",
			options: [{
				value: "vertical",
				label: messages[language].VERTICAL
			},{
				value: "horizontal",
				label: messages[language].HORIZONTAL
			}
			
			],
			defaultValue: "vertical",
			show: function (d) {
				//return showTo(show['biPartite']["orient"],d);
				return false;
			}	
	};	



	show['biPartite']['barSize']=["biPartite"];
	var barSize = {
			type: "integer",
			component: "dropdown",
			label: messages[language].BARSIZE,
			ref: "barSize",
			options: [{
				value: -50,
				label: "0"
			},{
				value: -40,
				label: 1
			},{
				value: -30,
				label: 2
			},{
				value: -20,
				label: 3
			},{
				value: -10,
				label: 4
			},{
				value: 0,
				label: 5
			},{
				value: 10,
				label: 6
			},{
				value: 20,
				label: 7
			},{
				value: 30,
				label: 8
			},{
				value: 40,
				label: 9
			},{
				value: 50,
				label: 10
			},{
				value: 60,
				label: 11
			},{
				value: 70,
				label: 12
			},{
				value: 80,
				label: 13
			},{
				value: 90,
				label: 14
			},{
				value: 100,
				label: 15
			},{
				value: 110,
				label: 16
			},{
				value: 120,
				label: 17
			},{
				value: 130,
				label: 18
			},{
				value: 140,
				label: 19
			},{
				value: 150,
				label: 20
			}

			
			],
			defaultValue: 0,
			show: function (d) {
				return showTo(show['biPartite']["barSize"],d);
				
			}
	};		
	
	show['biPartite']['biPartite']=["biPartite"];
	var BiPartite = {
		type:"items",
		label:messages[language].BIPARTITE,
		items: {			
			edgeMode:edgeMode,
			pad:pad,
			spaceLabelLeft:spaceLabelLeft,
			spaceLabelRight:spaceLabelRight,
			orient:orient,
			barSize:barSize
		},
		show: function (d) {
			return showTo(show['biPartite']["biPartite"],d);
			
		}

	};	

	show['bumps']={};
	show['bumps']['lastPeriods']=["bumps"];	
	var lastPeriods = {
		type: "integer",
		//component: "switch",
		label: messages[language].LAST_PERIODS,
		ref: "lastPeriods",
		defaultValue: "5",
		min: "1",
		max: "100000",
		show: function (d) {
			return showTo(show['bumps']["lastPeriods"],d);
		}				
	};

	show['bumps']['maxItemsPerPeriod']=["bumps"];	
	var maxItemsPerPeriod = {
		type: "integer",
		//component: "switch",
		label: messages[language].MAX_ITEM_PER_PERIOD,
		ref: "maxItemsPerPeriod",
		defaultValue: "10",
		min: "1",
		max: "100000",
		show: function (d) {
			return showTo(show['bumps']["maxItemsPerPeriod"],d);
		}				
	};	
	

	show['bumps']['barCurve']=["bumps"];	
	var barCurve = {
		type: "integer",
		//component: "switch",
		label: messages[language].BAR_CURVE,
		ref: "barCurve",
		defaultValue: "20",
		min: "1",
		max: "100000",
		show: function (d) {
			return showTo(show['bumps']["barCurve"],d);
		}				
	};



	show['bumps']['barHeight']=["bumps"];	
	var barHeight = {
		type: "integer",
		//component: "switch",
		label: messages[language].BAR_HEIGHT,
		ref: "barHeight",
		defaultValue: "100",
		min: "0",
		max: "100",
		show: function (d) {
			return showTo(show['bumps']["barHeight"],d);
		}				
	};

	show['bumps']['barWidth']=["bumps"];	
	var barWidth = {
		type: "integer",
		//component: "switch",
		label: messages[language].BAR_WIDTH,
		ref: "barWidth",
		defaultValue: "80",
		min: "0",
		max: "100",
		show: function (d) {
			return showTo(show['bumps']["barWidth"],d);
		}				
	};

	show['bumps']['showLinks']=["bumps"];	
	var showLinks = {
		type: "boolean",
		component: "switch",
		label: messages[language].SHOW_LINKS,
		ref: "showLinks",
		options: [{
			value: true,
			label: messages[language].YES
		}, {
			value: false,
			label: messages[language].NO
		}],
		defaultValue: false,
		show: function (d) {
			return showTo(show['bumps']["showLinks"],d);
		}				
	};

	show['bumps']['showOnlyFirstLast']=["bumps"];	
	var showOnlyFirstLast = {
		type: "boolean",
		component: "switch",
		label: messages[language].SHOW_ONLY_FIRST_LAST,
		ref: "showOnlyFirstLast",
		options: [{
			value: true,
			label: messages[language].YES
		}, {
			value: false,
			label: messages[language].NO
		}],
		defaultValue: false,
		show: function (d) {
			return showTo(show['bumps']["showOnlyFirstLast"],d);
		}				
	};

	show['bumps']['showRanks']=["bumps"];	
	var showRanks = {
			type: "string",
			component: "dropdown",
			label: messages[language].SHOW_RANKS,
			ref: "showRanks",
			options: [{
				value: "firstAndLast",
				label: messages[language].FIRST_AND_LAST
			},{
				value: "onlyFirst",
				label: messages[language].ONLY_FIRST
			},{
				value: "onlyLast",
				label: messages[language].ONLY_LAST
			},{
				value: "none",
				label: messages[language].NONE
			}
			
			],
			defaultValue: "firstAndLast",
			show: function (d) {
				return showTo(show['bumps']["showRanks"],d);
			}				
	};	
	
	
	show['bumps']['showRankColors']=["bumps"];	
	var showRankColors = {
		type: "boolean",
		component: "switch",
		label: messages[language].SHOW_RANK_COLORS,
		ref: "showRankColors",
		options: [{
			value: true,
			label: messages[language].YES
		}, {
			value: false,
			label: messages[language].NO
		}],
		defaultValue: true,
		show: function (d) {
			return showTo(show['bumps']["showRankColors"],d);
		}				
	};		

	show['bumps']['bumps']=["bumps"];
	var Bumps = {
		type:"items",
		label:messages[language].BUMPS,
		items: {			
			lastPeriods,
			maxItemsPerPeriod,
			showOnlyFirstLast,
			showLinks,
			barWidth,
			barHeight,
			barCurve,
			showRanks,
			showRankColors
			
			
		},
		show: function (d) {
			return showTo(show['bumps']["bumps"],d);
			
		}

	};		
	

	show['scale']={};
	show['scale']['stepScale']=["polar"];		
	var stepScale = {
		type: "integer",
		//component: "switch",
		label: messages[language].STEP_SCALE,
		ref: "stepScale",
		defaultValue: "5",
		min: "0",
		max: "200",
		show: function (d) {
			return showTo(show['scale']["stepScale"],d);
		}			
	};

	

	show['scale']['upScale']=["polar"];	
	var upScale = {
		type: "string",
		component: "switch",
		label: messages[language].UP_AXE_SCALE,
		ref: "upScale",
		options: [{
			value: "n",
			label: messages[language].YES
		}, {
			value: "",
			label: messages[language].NO
		}],
		defaultValue: "n",
		show: function (d) {
			return showTo(show['scale']["upScale"],d);
		}	
	};


	show['scale']['downScale']=["polar"];	
	var downScale = {
		type: "string",
		component: "switch",
		label: messages[language].DOWN_AXE_SCALE,
		ref: "downScale",
		options: [{
			value: "s",
			label: messages[language].YES
		}, {
			value: "",
			label: messages[language].NO
		}],
		defaultValue: "",
		show: function (d) {
			return showTo(show['scale']["downScale"],d);
		}			
	};	


	show['scale']['leftScale']=["polar"];	
	var leftScale = {
		type: "string",
		component: "switch",
		label: messages[language].LEFT_AXE_SCALE,
		ref: "leftScale",
		options: [{
			value: "w",
			label: messages[language].YES
		}, {
			value: "",
			label: messages[language].NO
		}],
		defaultValue: "",
		show: function (d) {
			return showTo(show['scale']["leftScale"],d);
		}			
	};	


	show['scale']['rightScale']=["polar"];
	var rightScale = {
		type: "string",
		component: "switch",
		label: messages[language].RIGHT_AXE_SCALE,
		ref: "rightScale",
		options: [{
			value: "e",
			label: messages[language].YES
		}, {
			value: "",
			label: messages[language].NO
		}],
		defaultValue: "",
		show: function (d) {
			return showTo(show['scale']["rightScale"],d);
		}			
	};	
	

	show['scale']['scale']=["polar"];	
	var Scale = {
		type:"items",
		label:messages[language].ITEM_SCALE,
		items: {
			stepScale:stepScale,			
			upScale:upScale,
			downScale:downScale,
			leftScale:leftScale,
			rightScale:rightScale
		},
		show: function (d) {
			return showTo(show['scale']['scale'],d);
		}			
	
	};	
	
	show['size']={};
	show['size']['chartRadius']=["funnel","polar","waterfall","radar"];

	var chartRadius = {
			type: "integer",
			label: messages[language].CHART_RADIUS_SIZE,
			ref: "chartRadius",
			component: "slider",
			min: 10,
			max: 200,
			step: 1,			
			//expression: "always",
			defaultValue: 75,
			show: function (d) {
				return showTo(show['size']['chartRadius'],d);
			}
	};
	
	
	show['size']['width']=["biPartite"];

	var chartWidth = {
			type: "integer",
			label: messages[language].CHART_WIDTH,
			ref: "width",
			component: "slider",
			min: 1,
			max: 20,
			step: 0.25,			
			//expression: "always",
			defaultValue: 8,
			show: function (d) {
				return showTo(show['size']['width'],d);
			}
	};		

	show['size']['height']=["biPartite"];

	var chartHeight = {
			type: "integer",
			label: messages[language].CHART_HEIGHT,
			ref: "height",
			component: "slider",
			min: 1,
			max: 20,
			step: 0.25,			
			//expression: "always",
			defaultValue: 8,
			show: function (d) {
				return showTo(show['size']['height'],d);
			}
	};		
	

	show['size']['chartSize']=["funnel","polar","waterfall","radar","biPartite"];	
	var chartSize = {
		type:"items",
		label:messages[language].ITEM_SIZE,
		items: {
			chartRadius:chartRadius,
			chartWidth:chartWidth,
			chartHeight:chartHeight
			//,
			//donutWidth:donutWidth		

		},
		show: function (d) {
			return showTo(show['size']['chartSize'],d);
		}
	
	};
	
	show['legends']={};

	var keyPositionX = {
			type: "integer",
			label: messages[language].LEGEND_POSITION_HORIZONTAL,
			ref: "keyPositionX",
			component: "slider",
			min: -300,
			max: 300,
			step: 3,
			//expression: "always",
			defaultValue: 0
	};	
	

	var keyPositionY = {
			type: "integer",
			label: messages[language].LEGEND_POSITION_VERTICAL,
			ref: "keyPositionY",
			component: "slider",
			min: -300,
			max: 300,
			step: 1,
			//expression: "always",
			defaultValue: 3
	};		


	var showLegends = {
			type: "boolean",
			component: "switch",
			label: messages[language].SHOW_LEGENDS,
			ref: "showLegends",
			options: [{
				value: true,
				label: messages[language].SHOW
			}, {
				value: false,
				label: messages[language].DONT_SHOW
			}],
			defaultValue: false
	};

	
	var graphGutter = {
			type: "string",
			component: "switch",
			label: messages[language].ORIENT,
			ref: "graphGutter",
			options: [{
				value: "graph",
				label: messages[language].VERTICAL
			}, {
				value: "gutter",
				label: messages[language].HORIZONTAL
			}],
			defaultValue: "graph"
	};	


	show['legends']['legends']=["polar","radar"];
	//messages[language].ITEM_LABELS="Labels";
	var legends = {
		type:"items",
		//component: "accordion",
		label:messages[language].ITEM_LEGENDS,
		items: {			
			showLegends:showLegends,
			graphGutter:graphGutter,
			keyPositionX:keyPositionX,
			keyPositionY:keyPositionY
			
		},
		show: function (d) {
			return showTo(show['legends']['legends'],d);
		}	
	
	};
	
	
	
	show['position']={};
	show['position']['gutterTop']=["polar","waterfall","radar","biPartite"];
	var gutterTop = {
			type: "integer",
			label: messages[language].CHART_POSITION_VERTICAL,
			ref: "gutterTop",
			component: "slider",
			min: -60,
			max: 200,
			step: 1,
			//expression: "always",
			defaultValue: 30,
			show: function (d) {
				return showTo(show['position']['gutterTop'],d);
			}
	};
	
	
	show['position']['gutterLeft']=["funnel","polar","waterfall","radar","biPartite"];	
	var gutterLeft = {
			type: "integer",
			label: messages[language].CHART_POSITION_HORIZONTAL,
			ref: "gutterLeft",
			component: "slider",
			min: -100,
			max: 200,
			step: 1,
			//expression: "always",
			defaultValue: 20,
			show: function (d) {
				return showTo(show['position']['gutterLeft'],d);
			}
	};

	show['position']['Position']=["funnel","polar","waterfall","radar","biPartite"];	
	var Position = {
		type:"items",
		//component: "expandable-items",
		label:messages[language].ITEM_POSITION,
		items: {
			gutterTop:gutterTop,
			gutterLeft:gutterLeft
			//,rotateUpFor:rotateUpFor
		},
		show: function (d) {
			return showTo(show['position']['Position'],d);
		}	
	
	};	


	var optionsSizeBorders = {
		//type:"items",
		component: "expandable-items",
		label:messages[language].EXPANDABLE_ITEM_OPTIONS,
		items: {			
			Options:Options,
			Position:Position,
			chartSize:chartSize,
			legends:legends,
			Scale:Scale,
			BiPartite:BiPartite,
			Bumps:Bumps,
			Advanced:Advanced
			
		}
	
	};		
	
    // *****************************************************************************
    // Main property panel definition
    // ~~
    // Only what's defined here will be returned from properties.js
    // *****************************************************************************
	  
	//******************************************************************************

    return {
        type: "items",
        component: "accordion",
        items: {
            //Default Sections
			dimensions: dimensions,
            measures: measures,
            appearance: appearanceSection,
			sorting: sortingSection,
			//Custom Sections
			optionsSizeBorders:optionsSizeBorders//,
			

        }
    };

} );
