define( [

	'jquery',
	'qlik',
	'ng!$q',
	'ng!$http',
	'../messages'


], function ($, qlik, $q, $http) {
    'use strict';
	//Define the current application

	var language="pt_BR";
	//var language="en_US";
	var app = qlik.currApp();

	var maxDimensions=2;
	var maxMeasures = 20;
    // *****************************************************************************
    // Dimensions & Measures
    // *****************************************************************************
    var dimensions = {
        uses: "dimensions",
        min: 0,
        max: 2,
		show:function(d){
			console.log(d);
		}
    };

    var measures = {
        uses: "measures",
        min: 1,
        max: 20
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

	var showTo =  function (a,d){
				if(a.indexOf(d.polar) >=0)
					return true;
				return false;
	};
	var show={};
	

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
		}],
		defaultValue: "polar"
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
	

	show['options']['border']=["wordCloudChart"];		
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
	

	show['options']['chartLabels']=["polar","funnel"];
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


	show['options']['showvalues']=["polar","funnel","radar"];
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
			defaultValue: false,
			show: function (d) {
				return showTo(show['options']["showvalues"],d);
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
			rotateType:rotateType,
			minTextSize:minTextSize,
			maxTextSize:maxTextSize,
			capitalize:capitalize,			
			palette:palette,
			transparent:transparent,
			border:border,
			grid:grid,
			//gridRadials:gridRadials,
			gridSpokes:gridSpokes,
			gridDotted:gridDotted,
			gridCircle:gridCircle,
			axes:axes,
			backgroundColor:backgroundColor,
			chartLabels:chartLabels,
			fontColor:fontColor,
			showvalues:showvalues,
			labelTextSize:labelTextSize,
			labelIn:labelIn,
			bold:bold,
			labelsApprox:labelsApprox
			
			//,keepColors:keepColors

			//,thousandSeparator:thousandSeparator
			//,decimalSeparator:decimalSeparator
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
	

	var chartSize = {
		type:"items",
		label:messages[language].ITEM_SIZE,
		items: {
			chartRadius:chartRadius,
			chartWidth:chartWidth,
			chartHeight:chartHeight
			//,
			//donutWidth:donutWidth		

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
			label: messages[language].ORIENTATION,
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


	var Position = {
		type:"items",
		//component: "expandable-items",
		label:messages[language].ITEM_POSITION,
		items: {
			gutterTop:gutterTop,
			gutterLeft:gutterLeft
			//,rotateUpFor:rotateUpFor
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
			BiPartite:BiPartite
			
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
