/*
Ruben Albuquerque
NExtensions4Qlik - Charts using RGraph and D3 with options  to  customize

*/

requirejs.config({
//    context: requirejs.s.contexts.sense ? "sense" : null,
    paths: {

        "RGraph": "../extensions/NExtensions4Qlik/libraries/RGraph.common.core",
		"RGraph.common.dynamic": "../extensions/NExtensions4Qlik/libraries/RGraph.common.dynamic",
		"RGraph.common.tooltips": "../extensions/NExtensions4Qlik/libraries/RGraph.common.tooltips",
		"RGraph.rosemv": "../extensions/NExtensions4Qlik/libraries/RGraph.rosemv",
		"RGraph.radar": "../extensions/NExtensions4Qlik/libraries/RGraph.radar",
		"RGraph.funnel": "../extensions/NExtensions4Qlik/libraries/RGraph.funnel",
		"RGraph.waterfall": "../extensions/NExtensions4Qlik/libraries/RGraph.waterfall",
		"RGraph.common.key": "../extensions/NExtensions4Qlik/libraries/RGraph.common.key",
		"d32":'../extensions/NExtensions4Qlik/libraries/d3',
		"viz":'../extensions/NExtensions4Qlik/libraries/viz'
		,
		"cloud":'../extensions/NExtensions4Qlik/libraries/d3.layout.cloud'
		,
		"RGraph.drawing.rect":'../extensions/NExtensions4Qlik/libraries/RGraph.drawing.rect'		
    },
 /*   shim: {
        "RGraph": {
         //   deps: ["RGraph.rose"],
            exports: "RGraph"
        },
        "RGraph.common.dynamic": {
           deps: ["RGraph"]
           //, exports: "RGraph"
        },
        "RGraph.common.tooltips": {
           deps: ["RGraph"]
           //, exports: "RGraph"
        },
        "RGraph.rose": {
           deps: ["RGraph"]
           //, exports: "RGraph"
        },
        "RGraph.common.key": {
           deps: ["RGraph"]
           //, exports: "RGraph"
        }
    },*/
    waitSeconds: 60
})



define( [
		'jquery'
		,'qlik'
        ,'./properties/properties'
		,'./properties/initialProperties'
		,'d32'
		,'viz'	
		,'cloud'
		,"text!./border.css"
		,"text!./gantt.css"
		,"RGraph"
		,"RGraph.rosemv"
		,"RGraph.radar"
		,"RGraph.funnel"
		,"RGraph.waterfall",	
		,"RGraph.common.dynamic"
		,"RGraph.common.tooltips"
		,"RGraph.common.key"
		,'RGraph.drawing.rect'		
		,'./libraries/rainbowvis'
		,'./biPartite'
		,'./wordCloudChart'
		,'./gantt'



		
    ],
	
    function ( $, qlik, props, initProps,d3,viz,cloud,css,cssGantt) {
        'use strict';	
		window.d3=d3;
		//window.RGraph={isRGraph: true};
		//Inject Stylesheet into header of current document
		$( '<style>' ).html(css).appendTo( 'head' );
		$( '<style>' ).html(cssGantt).appendTo( 'head' );
		var language = navigator.language || navigator.userLanguage; 
		language = language.replace("-","_");

		if(language!="pt_BR" && language!="en_US")
			language = "en_US";		
		
        return {
			//window.RGraph=RGraph;
			//Define the properties tab - these are defined in the properties.js file
             definition: props,
			
			//Define the data properties - how many rows and columns to load.
			 initialProperties: initProps,
			
			//Allow export to print object 
			support : { export: true,
						snapshot:true
			},
			
			//Not sure if there are any other options available here.
			 snapshot: {cantTakeSnapshot: true
			 },

			//paint function creates the visualisation. - this one makes a very basic table with no selections etc.
            paint: function ($element, layout) {
				
				
				
			 var lastrow = 0, me = this;
			 //loop through the rows we have and render
			 var rowCount=this.backendApi.getRowCount();
			 //console.log(rowCount);
			 var qMatrix =[];
			 if(rowCount<=layout.advancedInstanceLimit){
				 this.backendApi.eachDataRow( function ( rownum, row ) {
							lastrow = rownum;
							if(typeof row[1] !== 'undefined')
								qMatrix[rownum]=row;
							//do something with the row..	
							//if((lastrow+1)==rowCount    || (lastrow+1)>= 200){
							if((lastrow+1)==rowCount   ){							
								//console.log("row "  + row);
								//console.log("last "  + lastrow);
								//console.log("Row Count " +rowCount);
								
								paintAll($element,layout,qMatrix,me);
								//console.log("New qMatrix " +qMatrix.length);
								
							}
							
				 });
				 //console.log("last "  + lastrow);
				 //console.log("Row Count " +this.backendApi.getRowCount());
				 //if(this.backendApi.getRowCount() > lastrow +1 && lastrow+1< 200){
				 if(this.backendApi.getRowCount() > lastrow +1){
						 //we havent got all the rows yet, so get some more, 1000 rows
						 //console.log("Math min  " +Math.min( 100, this.backendApi.getRowCount() - lastrow ));
						  var requestPage = [{
								qTop: lastrow + 1,
								qLeft: 0,
								qWidth: 6, //should be # of columns
								qHeight: Math.min( 100, this.backendApi.getRowCount() - lastrow )
							}];
						   this.backendApi.getData( requestPage ).then( function ( dataPages ) {
									//when we get the result trigger paint again
									me.paint( $element,layout );
						   } );
				 }
				 else{

					 
				 }
			}
			else
			{
				var app = qlik.currApp(this);
				
				$element.html(getHtml(messages[language].NEXTENSIONS_INSTANCE_LIMIT_1 + layout.advancedInstanceLimit +messages[language].NEXTENSIONS_INSTANCE_LIMIT_2));
				return qlik.Promise.resolve();	
				
			}
			 
			 function paintAll($element,layout,qMatrix,me)
			 {
				//props['items']['optionsSizeBorders']['items']['Options']['items']['axes']['show']=false;
				//console.log(props['items']['optionsSizeBorders']['items']['Options']['items']['axes']);
				setUndefined();
				// Get the Number of Dimensions and Measures on the hypercube
				var numberOfDimensions = layout.qHyperCube.qDimensionInfo.length;
				//console.log(numberOfDimensions);
				var numberOfMeasures = layout.qHyperCube.qMeasureInfo.length;
				//console.log(numberOfMeasures);				
				

			

				var app = qlik.currApp(this);
				
				if(layout.polar=="biPartite"){
					if(numberOfDimensions==2 && numberOfMeasures==1)
						biPartite(app,$element,layout,qMatrix,d3,viz);
					else{
						//To generate random numbers to allow multiple charts to present on one sheet:						
						$element.html(getHtml(messages[language].BIPARTITE_DIMENSIONMEASURE));
					}
						
				}
				else if(layout.polar=="wordCloudChart"){
					if(numberOfDimensions==1 && numberOfMeasures==1)
						wordCloudChart(app,$element,layout,qMatrix,d3,cloud);
					else{
						//To generate random numbers to allow multiple charts to present on one sheet:						
						$element.html(getHtml(messages[language].WORDCLOUDCHART_DIMENSIONMEASURE));
					}					
				}
				else if(layout.polar=="gantt"){
					if(numberOfDimensions==5 && numberOfMeasures<=1)
						ganttChart(app,$element,layout,qMatrix,d3,cloud,createPalette);
					else{
						//To generate random numbers to allow multiple charts to present on one sheet:						
						$element.html(getHtml(messages[language].GANTT_DIMENSIONMEASURE));
					}					
				}				
				else 
				{
				
					var html="";
					
					// Get the Number of Dimensions and Measures on the hypercube
					var numberOfDimensions = layout.qHyperCube.qDimensionInfo.length;
					//console.log(numberOfDimensions);
					var numberOfMeasures = layout.qHyperCube.qMeasureInfo.length;
					//console.log(numberOfMeasures);
					
					// Get the Measure Name and the Dimension Name
					var measureName = layout.qHyperCube.qMeasureInfo[0].qFallbackTitle;
					//console.log(measureName);
					
					// Get the number of fields of a dimension
					//var numberOfDimValues = layout.qHyperCube.qDataPages[0].qMatrix.length;
					var numberOfDimValues = qMatrix.length;
					//console.log("qMatrix.length: " + numberOfDimValues);				
					
					//var dimensionName = layout.qHyperCube.qDimensionInfo[0].qFallbackTitle;
					//console.log(dimensionName);

					

					
					//console.log(qMatrix);
					//console.log(layout);
					var numberOfItems = numberOfDimValues;
					
					//var numberOfItems = numberOfMeasures;
					if(numberOfMeasures>1)
							numberOfItems=numberOfMeasures;

					
					
					
					//% to Only Values
					var measArrayPerc = [];
					//var measArrayValue = [];
					
					var dimMeasPercArray=[];
					var dimMeasPercTPArray=[];			
					
					var origin=-Math.PI/2;
					var originAcc = 0;
					/*for (var i=0; i<numberOfDimValues;i++){
						
						
						var measPercArray = (parseFloat(measArrayNum[i])/total)*100;
											
						measPercArray= parseFloat(measPercArray).toFixed(1);					
						measArrayPerc[i]=measPercArray + "%";
											
						dimMeasPercArray[i] = dimArray[i] +valueBelow +measPercArray + "%";
						dimMeasPercTPArray[i] = dimensionName+'</br>' +
												'<div style="color:' + palette[i]+';">' + dimArray[i]+": " +measArrayText[i]+"</div>" +
												"Percentual: " + measPercArray + "%";
									
					}*/

					var dimensionLength=qMatrix.length;
									
					//To generate random numbers to allow multiple charts to present on one sheet:
					function guid() {return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();};
					function s4() {return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);};
					var tmpCVSID = guid();
						

					function capitalize(str) {
					
						if(layout.capitalize=="capitalize"){
							return str
								.toLowerCase()
								.split(' ')
								.map(function(word) {
									//console.log("First capital letter: "+word[0]);
									//console.log("remain letters: "+ word.substr(1));
									return word[0].toUpperCase() + word.substr(1);
								})
								.join(' ');
						}
						return str.toUpperCase();
					}

						
					var hashCode = function(str){
						var hash = 0;
						if (str.length == 0) return hash;
						for (i = 0; i < str.length; i++) {
							var char = str.charCodeAt(i);
							hash = ((hash<<5)-hash)+char;
							hash = hash & hash; // Convert to 32bit integer
						}
						//console.log(Math.abs(hash));
						return Math.abs(hash);
					}

					var html = '';			
					var width = $element.width(), height = $element.height();
					// add canvas for chart			
					html+='<div style="background-color: '+ layout.backgroundColor.color +';" id="canvas-wrapper-'+tmpCVSID+'"><canvas id="' + tmpCVSID + '" width="'+width+'" height="'+height+'">[No canvas support]</canvas></div><div id="myKey-'+tmpCVSID+'"></div>';
	//onsole.log(html);


					$element.html(html);
					
					
					var testRadius = width;
					if(width>height)
						testRadius=height;
					testRadius=testRadius*(layout.chartRadius/275);
					
					//console.log(parseInt(testRadius*0.04));
					//console.log((layout.labelTextSize/100));
					
					var labelTextSize = parseInt(testRadius*0.06)*(layout.labelTextSize/50);
					//console.log(labelTextSize);
					if(labelTextSize< 7)
						labelTextSize=7;				
					
					
					//RGraph.Reset(document.getElementById(tmpCVSID));
					//var min = Math.min.apply(null, measArrayNum),
					//max = Math.max.apply(null, measArrayNum);
					
					//var diffMaxMin = max - min;
					

					/*
					var  maxTextSize = 20-layout.maxTextSize;
					if(width>height){
						tamanho=height;
						var  tamanho2=height/maxTextSize;
						//if((width/1.5)>height)
						//	var tamanho=height/2;
						
					}
					else{
						var tamanho=width;
						var  tamanho2=width/maxTextSize;
						//if((height/1.5)>=width)
						//	var tamanho=width/2;
					}
					
					if(measArrayNum.length>50)
						tamanho2=tamanho2-(tamanho2/5);
					
					tamanho=tamanho * (Math.log(measArrayNum.length)); 
					//console.log("LOG: " + Math.log(1000000*measArrayNum.length));
					//tamanho = height+width;				
					var fontMax =  5 + ((max/total)*tamanho);
					*/
						
					/*
					//console.log(dimArray.map(function(d,i) {
						  return {text: d, size: 10+measArrayNum[i], test: "haha"};
						}));*/
					var padding=3;
					if(layout.border)
						padding=padding+1;
					var font="QlikView Sans";
					//console.log(measArrayNum2);
					//console.log(Object.keys(newStructure));
					

					
					var labelAxes=layout.upScale+layout.downScale+layout.leftScale+layout.rightScale;
					if(labelAxes=="")
						labelAxes="";
					
					
					
					if(typeof(layout.grid)=="boolean")
						layout.grid=5;
					if(layout.grid<0)
						layout.grid=0;
					//console.log(layout.grid+0);
					
					var data = null;
					
					//array que contem measArrayNum2
					var measArrays = [];
					var measArrayNum2 = [];
					//array que contem measArrayNum2ValuesFormatted
					var valuesFormatted =[];
					var measArrayNum2ValuesFormatted = [];
					var labelsArray = [];
					var toolTipsArray = [];					
					var newStructure = {};
					var newStructureValuesFormatted = {};
					var total = 0;
					var max=0;
					var palette = null;
					
					var keyLegendsWhenMeasure = [];
					
					
					if(layout.qHyperCube.qDimensionInfo.length==1 && layout.qHyperCube.qMeasureInfo.length==1){
						
						
						for (var i=0; i<qMatrix.length;i++){
							newStructure[qMatrix[i][0].qText]={};
							newStructureValuesFormatted[qMatrix[i][0].qText]={};

						}
						labelsArray=Object.keys(newStructure);
						palette=createPalette(qMatrix.length,{},{});
					
						for(var  i  in newStructure){
							newStructure[i]=0;
							newStructureValuesFormatted[i]=0;
						}	
						for (var i=0; i<qMatrix.length;i++){
							newStructure[qMatrix[i][0].qText]=qMatrix[i][1].qNum;
							newStructureValuesFormatted[qMatrix[i][0].qText]=qMatrix[i][1].qText;
							if(max<qMatrix[i][1].qNum){
								max=qMatrix[i][1].qNum;

							}
							
						}
											
						if(layout.polar == "radar" || layout.polar == "funnel" || layout.polar == "polar"){
							//arrayValuesDim2=arrayValuesDim2-layout.factor;
							max=max-layout.factor;
						}									
						

						var ix=0;
						for(var  i  in newStructure){
							total = total + parseFloat(newStructure[i]);
							
							var arrayValuesDim2	= newStructure[i];
							if(layout.polar == "radar" ||  layout.polar == "funnel" || layout.polar == "polar"){
								arrayValuesDim2=arrayValuesDim2-layout.factor;
								//max=max-layout.factor;
							}
							var arrayValuesDim2ValuesFormatted	= newStructureValuesFormatted[i];

							//toolTipsArray[ix]=i+" - " + newStructure[i];							
							toolTipsArray[ix]=i+" - " + newStructureValuesFormatted[i];					
							//toolTipsArray[ix]=i+" - " + (newStructure[i]+120).toFixed(1);					
							measArrayNum2[ix]=arrayValuesDim2;
							measArrayNum2ValuesFormatted[ix]=arrayValuesDim2ValuesFormatted;
							/*Test to show an increase in values when send decrease in measure*/
							//measArrayNum2ValuesFormatted[ix]=arrayValuesDim2+120;
							//measArrayNum2ValuesFormatted[ix]=measArrayNum2ValuesFormatted[ix].toFixed(1);
							ix++;
						}
						measArrays.push(measArrayNum2);
						valuesFormatted.push(measArrayNum2ValuesFormatted);
						//console.log(measArrayNum2ValuesFormatted);
						//console.log(labelsArray);
						
						
						keyLegendsWhenMeasure.push(layout.qHyperCube.qMeasureInfo[0].qFallbackTitle);
						
						
					}
					else if (layout.qHyperCube.qDimensionInfo.length==1 && layout.qHyperCube.qMeasureInfo.length>1){
						
						
						for (var i=0; i<layout.qHyperCube.qMeasureInfo.length;i++){
							newStructure[layout.qHyperCube.qMeasureInfo[i].qFallbackTitle]={};
							newStructureValuesFormatted[layout.qHyperCube.qMeasureInfo[i].qFallbackTitle]={};

						}
						//labelsArray=Object.keys(newStructure);
						//palette=createPalette(qMatrix.length,{},{});
						
						var dim1StructureKeys = Object.keys(newStructure);
						keyLegendsWhenMeasure=dim1StructureKeys;

					
						palette=createPalette(dim1StructureKeys.length,{},{});
					
						for(var i = 0; i< dim1StructureKeys.length;i++)
						{
							for(var j = 0; j< qMatrix.length;j++)
							{									
								newStructure[dim1StructureKeys[i]][qMatrix[j][0].qText]=0;
								newStructureValuesFormatted[dim1StructureKeys[i]][qMatrix[j][0].qText]=0;
							}
						}
					
						//console.log(dim1Structure);
						//var max = 0;
					
						for(var i = 0; i< qMatrix.length;i++)
						{
							labelsArray.push(qMatrix[i][0].qText);
							for(j=0;j<dim1StructureKeys.length;j++){
								newStructure[dim1StructureKeys[j]][qMatrix[i][0].qText]=qMatrix[i][j+1].qNum;
								newStructureValuesFormatted[dim1StructureKeys[j]][qMatrix[i][0].qText]=qMatrix[i][j+1].qText;
								if(max<qMatrix[i][j+1].qNum)
									max=qMatrix[i][j+1].qNum;
							}
						}

						max=max*1.1;
						if(layout.polar == "radar" || layout.polar == "funnel" || layout.polar == "polar"){
							//arrayValuesDim2=arrayValuesDim2-layout.factor;
							max=max-layout.factor;
						}							
						//console.log(dim1Structure);
						//var measArrays2 =[];
						
						//console.log(palette);
						
						for(var i = 0; i< dim1StructureKeys.length;i++)
						{
							var measArrayNumTeste =[];
							var valueFormatted =[];
							var dim2StructureKeys = Object.keys(newStructure[dim1StructureKeys[i]]);
							//console.log(palette[i]);



							for(var j = 0; j< dim2StructureKeys.length;j++){
								if(i>0)
									toolTipsArray[j]=toolTipsArray[j]+"</br>"+'<div  style="position:relative;top:3px;left:5px;float:left;display:inline-block;width: 10px;height: 10px;background-color: '+palette[i]+';"></div><div style="text-align:left;padding-left: 20px;display:inline;">'+dim2StructureKeys[j]+" - </div>"+ dim1StructureKeys[i]+' - <div style="display:inline;color:'+palette[i]+'">'+newStructureValuesFormatted[dim1StructureKeys[i]][dim2StructureKeys[j]]+"</div>";
								else
									toolTipsArray.push('<div  style="position:relative;top:3px;left:5px;float:left;display:inline-block;width: 10px;height: 10px;background-color: '+palette[i]+';"></div><div style="text-align:left;padding-left: 20px;display:inline;">'+dim2StructureKeys[j]+" - "+ dim1StructureKeys[i]+' - </div><div style="display:inline;color:'+palette[i]+'">'+newStructureValuesFormatted[dim1StructureKeys[i]][dim2StructureKeys[j]]+"</div>");
								
								
								if(layout.polar == "radar" || layout.polar == "funnel" || layout.polar == "polar"){
									//arrayValuesDim2=arrayValuesDim2-layout.factor;
									measArrayNumTeste.push(newStructure[dim1StructureKeys[i]][dim2StructureKeys[j]]-layout.factor);
								}
								else{
									measArrayNumTeste.push(newStructure[dim1StructureKeys[i]][dim2StructureKeys[j]]);
								}									
								
								
								valueFormatted.push(newStructureValuesFormatted[dim1StructureKeys[i]][dim2StructureKeys[j]]);
								
							}
							measArrays.push(measArrayNumTeste);
							valuesFormatted.push(valueFormatted);
						}						
											
						
					}
					else if (layout.qHyperCube.qDimensionInfo.length==0 && layout.qHyperCube.qMeasureInfo.length>1){
						
						for (var i=0; i<layout.qHyperCube.qMeasureInfo.length;i++){
							newStructure[layout.qHyperCube.qMeasureInfo[i].qFallbackTitle]={};
							newStructureValuesFormatted[layout.qHyperCube.qMeasureInfo[i].qFallbackTitle]={};

						}
						labelsArray=Object.keys(newStructure);
						palette=createPalette(labelsArray.length,{},{});
					
						for(var  i  in newStructure){
							newStructure[i]=0;
							newStructureValuesFormatted[i]=0;
						}
						//console.log(qMatrix);
						
						for (var i=0; i<labelsArray.length;i++){
							newStructure[labelsArray[i]]=qMatrix[0][i].qNum;
							newStructureValuesFormatted[labelsArray[i]]=qMatrix[0][i].qText;
							if(max<qMatrix[0][i].qNum){
								max=qMatrix[0][i].qNum;

							}
							
						}
						//console.log(qMatrix);
						//console.log(newStructureValuesFormatted);
											
						if(layout.polar == "radar" || layout.polar == "funnel" || layout.polar == "polar"){
							//arrayValuesDim2=arrayValuesDim2-layout.factor;
							max=max-layout.factor;
						}									
						

						var ix=0;
						for(var  i  in newStructure){
							total = total + parseFloat(newStructure[i]);
							
							var arrayValuesDim2	= newStructure[i];
							if(layout.polar == "radar" ||  layout.polar == "funnel" || layout.polar == "polar"){
								arrayValuesDim2=arrayValuesDim2-layout.factor;
								//max=max-layout.factor;
							}
							var arrayValuesDim2ValuesFormatted	= newStructureValuesFormatted[i];

							//toolTipsArray[ix]=i+" - " + newStructure[i];							
							toolTipsArray[ix]=i+" - " + newStructureValuesFormatted[i];					
							//toolTipsArray[ix]=i+" - " + (newStructure[i]+120).toFixed(1);					
							measArrayNum2[ix]=arrayValuesDim2;
							measArrayNum2ValuesFormatted[ix]=arrayValuesDim2ValuesFormatted;
							//Test to show an increase in values when send decrease in measure
							//measArrayNum2ValuesFormatted[ix]=arrayValuesDim2+120;
							//measArrayNum2ValuesFormatted[ix]=measArrayNum2ValuesFormatted[ix].toFixed(1);
							ix++;
						}
						measArrays.push(measArrayNum2);
						valuesFormatted.push(measArrayNum2ValuesFormatted);
						//console.log(measArrayNum2ValuesFormatted);
						//console.log(labelsArray);
						
						
						keyLegendsWhenMeasure.push(layout.qHyperCube.qMeasureInfo[0].qFallbackTitle);
						
						
					}
					else if(layout.qHyperCube.qDimensionInfo.length==2 && layout.qHyperCube.qMeasureInfo.length==1){
						
						//console.log(qMatrix);
							
						for(var i = 0; i< qMatrix.length;i++)
						{
							newStructure[qMatrix[i][1].qText]={};
							newStructureValuesFormatted[qMatrix[i][1].qText]={};
						}
						labelsArray = Object.keys(newStructure);
					
						palette=createPalette(labelsArray.length,{},{});
					
						for(var i = 0; i< labelsArray.length;i++)
						{
							for(var j = 0; j< qMatrix.length;j++)
							{									
								newStructure[labelsArray[i]][qMatrix[j][0].qText]=0;
								newStructureValuesFormatted[labelsArray[i]][qMatrix[j][0].qText]=0;
							}
						}
						
						
						for(var i = 0; i< qMatrix.length;i++)
						{
							newStructure[qMatrix[i][1].qText][qMatrix[i][0].qText]=qMatrix[i][2].qNum;
							newStructureValuesFormatted[qMatrix[i][1].qText][qMatrix[i][0].qText]=qMatrix[i][2].qText;
							//console.log(qMatrix[i][2]);
							if(max<qMatrix[i][2].qNum)
								max=qMatrix[i][2].qNum;
						}
						
						if(layout.polar == "radar" || layout.polar == "funnel" || layout.polar == "polar"){
							//arrayValuesDim2=arrayValuesDim2-layout.factor;
							max=max-layout.factor;
						}						
						max=max*1.1;
						//console.log(newStructure);
						
						
						for(var i = 0; i< labelsArray.length;i++)
						{
							//var measArrayNumTeste =[];
							//var valueFormatted =[];
							var dim2StructureKeys = Object.keys(newStructure[labelsArray[i]]);
							//console.log(palette[i]);
							measArrayNum2=[];
							measArrayNum2ValuesFormatted=[];


							for(var j = 0; j< dim2StructureKeys.length;j++){
								if(i>0)
									toolTipsArray[j]=toolTipsArray[j]+"</br>"+'<div  style="position:relative;top:3px;left:5px;float:left;display:inline-block;width: 10px;height: 10px;background-color: '+palette[i]+';"></div><div style="text-align:left;padding-left: 20px;display:inline;">'+dim2StructureKeys[j]+" - </div>"+ labelsArray[i]+' - <div style="display:inline;color:'+palette[i]+'">'+newStructureValuesFormatted[labelsArray[i]][dim2StructureKeys[j]]+"</div>";
								else
									toolTipsArray.push('<div  style="position:relative;top:3px;left:5px;float:left;display:inline-block;width: 10px;height: 10px;background-color: '+palette[i]+';"></div><div style="text-align:left;padding-left: 20px;display:inline;">'+dim2StructureKeys[j]+" - "+ labelsArray[i]+' - </div><div style="display:inline;color:'+palette[i]+'">'+newStructureValuesFormatted[labelsArray[i]][dim2StructureKeys[j]]+"</div>");
								
								measArrayNum2.push(newStructure[labelsArray[i]][dim2StructureKeys[j]]);
								measArrayNum2ValuesFormatted.push(newStructureValuesFormatted[labelsArray[i]][dim2StructureKeys[j]]);
								//measArrayNum2[i]=arrayValuesDim2;
								//measArrayNum2ValuesFormatted[i]=arrayValuesDim2ValuesFormatted;
								
							}
							measArrays.push(measArrayNum2);
							valuesFormatted.push(measArrayNum2ValuesFormatted);
							
						}	

						keyLegendsWhenMeasure=labelsArray;
						labelsArray = Object.keys(newStructure[labelsArray[0]]);

						
					}
					var	qDec = null;
					var	qFmt = null;
					var	qThou = null;
					
/*
					var qDec = layout.qHyperCube.qMeasureInfo[0].qNumFormat.qDec;
					var qThou = layout.qHyperCube.qMeasureInfo[0].qNumFormat.qThou;
					var qFmt = layout.qHyperCube.qMeasureInfo[0].qNumFormat.qFmt;
					
					var dcmPlcs = qFmt.split(qDec);
					
					if(dcmPlcs.length>1){
						//qDec = 
						qFmt = dcmPlcs[1];
						//console.log("teve " + dcmPlcs[1]);
					}
					else{
						qDec = null;
						qFmt = null;
						qThou = null;
						//console.log("nao teve" + dcmPlcs);
					}
					*/
					if(layout.polar=="waterfall"){
						
						
						
						if(
						(layout.qHyperCube.qDimensionInfo.length==1 && layout.qHyperCube.qMeasureInfo.length==1) 
							||
						(layout.qHyperCube.qMeasureInfo.length>1 && layout.qHyperCube.qDimensionInfo.length==0)
						)					
						{
							
							labelsArray.push("Total");
							toolTipsArray.push("Total - " + total);
							var rose = new RGraph.Waterfall({
								id: tmpCVSID,
								data: measArrayNum2,
								options: {
									labels: labelsArray,
									textAccessible: true,
									textFont:'QlikView Sans',
									labelsBoxed:false,
									textSize: labelTextSize	,
									colors: palette	,
									gutterTop: 20,
									gutterLeft: layout.gutterLeft+(0.5*testRadius),
									gutterBottom: layout.gutterTop+(0.5*testRadius),
									showValues:layout.showvalues,
									showValuesDecimalChar:qDec,
									showValuesThousandChar:qThou,
									showValuesDecimalPlaces:qFmt,
									showValuesArray:measArrayNum2ValuesFormatted,
									//backgroundGridDashed:true,
									//xaxisTitle:'Conn',
									//xaxisTitleSize:12,
									//xaxisTitleFont:'QlikView Sans',
									tooltips:function (idx)
									{
										return '<div id="__tooltip_div__">'+toolTipsArray[idx]+'</div>';
											   //'s stats<br/><canvas id="__tooltip_canvas__" width="400" height="150">='
											   //'[No canvas support]</canvas>';
									},
									tooltipsEvent: 'onmousemove'
								}
							})
							//.set('backgroundHbars', [[0, total*0.75, 'yellow'], [total*0.75, total*0.25, 'red']])
							.draw();
						}
						else
						{
							$element.html(getHtml(messages[language].WATERFALL_DIMENSIONMEASURE));
						}
						
					}
					else if(layout.polar=="funnel"){
						
						
						if(
						(layout.qHyperCube.qDimensionInfo.length==1 && layout.qHyperCube.qMeasureInfo.length==1)
						 ||
						(layout.qHyperCube.qMeasureInfo.length>1 && layout.qHyperCube.qDimensionInfo.length==0)
						){
							// Create the Funnel chart. Note the the values start at the maximum and decrease to the minimum.
							var  name=""
							while(measArrayNum2.length<2)
							{
								name=name+" ";
								measArrayNum2.push(measArrayNum2[0]-(measArrayNum2[0]*0.99));
								measArrayNum2ValuesFormatted.push("");
																
								labelsArray.push(name);
								toolTipsArray.push("");
							}
							
							var rose = new RGraph.Funnel({
								id: tmpCVSID,
								data: measArrayNum2,
								options: {
									textBoxed: false,
									//title: 'Leads through to sales',
									labels: layout.chartLabels?labelsArray:null,
									showValues:layout.showvalues,
									showValuesArray:measArrayNum2ValuesFormatted,									
									shadow: false,
									labelsSticks:true,
									width:(width/2)/testRadius,
									textFont:'QlikView Sans',
									labelsBoxed:false,
									textSize: labelTextSize,
									funnelHorizontal:layout.gutterLeft,
									colors: palette,
									tooltips:function (idx)
									{
										return '<div id="__tooltip_div__">'+toolTipsArray[idx]+'</div>';
											   //'s stats<br/><canvas id="__tooltip_canvas__" width="400" height="150">='
											   //'[No canvas support]</canvas>';
									},
									tooltipsEvent: 'onmousemove'//,
									//gutterLeft: layout.showLegends ? layout.gutterLeft+190: layout.gutterLeft
								}
							}).draw();
							
						}
						else
						{
							$element.html(getHtml(messages[language].FUNNEL_DIMENSIONMEASURE));
						}
					}
					else if(layout.polar=="radar"){
						//console.log(layout.qHyperCube.qDimensionInfo.length);
						//console.log(layout.qHyperCube.qMeasureInfo.length);
						//console.log(layout.qHyperCube.qDimensionInfo.length==1);
						//console.log(layout.qHyperCube.qMeasureInfo.length>1);
						if(
						(
							(layout.qHyperCube.qDimensionInfo.length==1 
							|| layout.qHyperCube.qDimensionInfo.length==2
							) && layout.qHyperCube.qMeasureInfo.length==1
						) 
						||
							(layout.qHyperCube.qMeasureInfo.length>1 && layout.qHyperCube.qDimensionInfo.length==0) || 
							(layout.qHyperCube.qMeasureInfo.length>1 && layout.qHyperCube.qDimensionInfo.length==1)
						){
							var name="";

							while(measArrays[0].length<3)
							{
								name=name+" ";
								for(var i = 0; i < measArrays.length;i++)
								{
									measArrays[i].push(0);
									valuesFormatted[i].push("");
								}									
								labelsArray.push(name);
								toolTipsArray.push("");
							}
							//console.log(measArrays);
							//console.log(valuesFormatted);
							
							var spokes = labelsArray.length;
					
							
							if(!layout.gridSpokes){
								spokes=0;
							}								

							//var lineWidth=((testRadius*3)/180);
							var lineWidth=2;
							//measArrays.push(measArrayNumTeste);
							//console.log(measArrays);
							//console.log(keys);
							max=max*(1+(labelTextSize/100));
							
							max=max*layout.max;	
							//console.log(measArrays);
							//console.log(labelsArray);
							//console.log(valuesFormatted);
							var rose =  new RGraph.Radar({
								//width:100,
								id: tmpCVSID,
								data: measArrays,
								options: {
									//scaleVisible:true,
									ymax:max,
									//era keys
									labels: labelsArray,
									labelsBold:true,
									textAccessible: true,
									gutterLeft: layout.showLegends ? layout.gutterLeft+190: layout.gutterLeft,
									gutterRight: 100,
									gutterTop: layout.gutterTop,
									gutterBottom: 50,
									backgroundCircles: true,
									backgroundCirclesColor:'#000',
									backgroundCirclesCount:layout.grid,
									
									tickmarksStyle:'filledcircle',
									tickmarksLinewidth:5,
									tickmarksSize:12,
									
									backgroundCirclesPoly:layout.gridCircle,
									backgroundCirclesSpokes:spokes,									
									colorsAlpha:0.5,
									backgroundCirclesDotted:layout.gridDotted,
									
									//strokestyle: ['black'],
									linewidth:lineWidth,
									
									backgroundAxes:layout.axes,
									radius:testRadius,	
									textFont:'QlikView Sans',
									labelsBoxed:false,
									textSize: labelTextSize,
									colors:palette,
									//colors:['black','red'],
									tooltips:function (idx,a,b,c,d,e)
									{
										//console.log(idx+ " "  + a + " "  + b+ " "  + c+ " "  + d+ " "  + e);
										//return '<div id="__tooltip_div__">'+toolTipsArray[idx]+'</div>';
										return '<div id="__tooltip_div__" style="display:inline;">'+toolTipsArray[idx%labelsArray.length]+'</div>';
											   //'s stats<br/><canvas id="__tooltip_canvas__" width="400" height="150">='
											   //'[No canvas support]</canvas>';
									},
									tooltipsEvent: 'onmousemove',
									
									key:layout.showLegends ? keyLegendsWhenMeasure: null,
									keyHalign:"right",
									keyPositionX:layout.keyPositionX,
									keyPositionY:layout.keyPositionY,
									keyPositionGraphBoxed:false,
									keyPosition:layout.graphGutter,
									keyTextBold:true,
									keyTextSize:labelTextSize-2,
									//keyInteractive:function(d){alert(d);},

									showValues:layout.showvalues,
									showValuesArray:valuesFormatted,
									showValuesTextSize:labelTextSize-2//,
									
									//eventsClick: function(){console.log('oi');}
								}
							}).draw();
							
							
							
							
						}
						else
						{
							$element.html(getHtml(messages[language].RADAR_DIMENSIONMEASURE));
						}
					}
					//"polar"
					else
					{
						if(
						(layout.qHyperCube.qDimensionInfo.length==1 && layout.qHyperCube.qMeasureInfo.length==1) 
						||
						(layout.qHyperCube.qMeasureInfo.length>1 && layout.qHyperCube.qDimensionInfo.length==0)
							){

							//console.log(palette);
							var spokes = 0;
							if(layout.gridSpokes){
								spokes=labelsArray.length;
							}
							
							
							var linewidth = 0;
							
							if(layout.border)
								linewidth = layout.borderSize;
							
							var margin  = 0;
							if(layout.marginSlices)
								margin = layout.marginSlicesSize;
							var rose = new RGraph.RoseMV({
								//id: 'canvas-wrapper-'+tmpCVSID,
								id: tmpCVSID,
								data: measArrayNum2,
								options: {
									//variant: 'non-equi-angular',
									gutterLeft: layout.showLegends ? layout.gutterLeft+190: layout.gutterLeft,
									gutterRight: 100,
									gutterTop: layout.gutterTop,
									gutterBottom: 50,
									//backgroundGridRadials:layout.gridRadials,
									backgroundGridRadials:spokes,
									//backgroundGridCount:layout.grid?layout.grid:0,
									backgroundGridCount:layout.grid,
									backgroundGrid:true,
									
									backgroundAxes:layout.axes,
									radius:testRadius,
									labelsAxes:layout.upScale+layout.downScale+layout.leftScale+layout.rightScale,
									labelsCount:layout.stepScale,
									ymax:max,
									//labelsPosition:'edge',
									textFont:'QlikView Sans',
									labelsBoxed:false,
									textSize: labelTextSize,
									textSizeScale:Math.floor(labelTextSize*0.7),
									backgroundGridColor: 'rgba(155,155,155,1)',//'#989080',
									//tooltips: toolTipsArray,
									tooltips:function (idx)
									{
										return '<div id="__tooltip_div__">'+toolTipsArray[idx]+'</div>';
											   //'s stats<br/><canvas id="__tooltip_canvas__" width="400" height="150">='
											   //'[No canvas support]</canvas>';
										},
									tooltipsEvent: 'onmousemove',
									colorsSequential: (numberOfDimensions==2 && numberOfMeasures<2)?false:true,
									//colorsSequential: true,
									colors: palette,
									linewidth: linewidth,
									labels: layout.chartLabels? labelsArray:null,
									showValues:layout.showvalues,
									showValuesArray:valuesFormatted,
									labelsApprox:layout.labelsApprox,
									//exploded: 3,
									//strokestyle:'rgba(0,0,0,0.8)',
									backgroundGridLinewidth:1,
									key:layout.showLegends ? labelsArray: null,
									keyHalign:"right",
									keyPositionX:layout.keyPositionX,
									keyPositionY:layout.keyPositionY,
									keyPositionGraphBoxed:false,
									keyPosition:layout.graphGutter,
									keyTextBold:true,
									keyTextSize:labelTextSize-2,						
									eventsClick: onClickDimension,
									margin:margin
								}
							}).draw();
							
						}
						else
						{
							$element.html(getHtml(messages[language].POLAR_DIMENSIONMEASURE));
						}
					}
					rose.on('tooltip', function (obj)
					{
						//console.log(obj);
						
						//var tooltip = obj.get('tooltips');
						//var colors  = rose.properties.colors;
						
						//$("#__tooltip_div__").css('border','4px solid ' + colors[obj.__index__]);
						//tooltip.style.border = '4px solid ' + colors[obj.__index__]
					});
					
					RGraph.tooltips.style.backgroundColor = 'white';
					RGraph.tooltips.style.color           = 'black';
					RGraph.tooltips.style.fontWeight      = 'bold';
					RGraph.tooltips.style.boxShadow       = 'none';
					
					
					
					rose.canvas.onmouseout = function (e)
					{
						// Hide the tooltip
						RGraph.hideTooltip();
						
						// Redraw the canvas so that any highlighting is gone
						RGraph.redraw();
					}
					//needed for export
					
					function onClickDimension (e, shape)
					{
						var index = shape.index;
						//alert(dimensionName);
						//console.log(index);
						var ix=0;
						for(var  i in newStructure){
							for(var  j in newStructure[i]){
								if(ix==index)
									app.field(dimensionName).toggleSelect(i, true);
								ix++;
							}
							//console.log(i);
						}
						//if(index==1)
						
						//app.field(dimensionName).toggleSelect(dimArray[index], true);
						return  true;
					}	
				}					
				return qlik.Promise.resolve();	
			 }
			 
			 
			 
			
			 
			 
			function getHtml(chartTypeMessage){
				function guid() {return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();};
				function s4() {return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);};
				var tmpCVSID = guid();						
				var html = '';			
				//var width = $element.width(), height = $element.height();
				// add canvas for chart			
				html+='<div style="background-color: #AAAAAA;" id="canvas-wrapper-'+tmpCVSID+'">'
							+chartTypeMessage+
					  '</div>';
				return html;
			}
			 
			function createPalette(numberOfItems,newStructure,newStructureDim2){
					
					var rainbow = new Rainbow(); 
					
					var palette =["RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)"];	
					
					

					//rainbow.setNumberRange(0, Object.keys(newStructureDim2).length+1);
					rainbow.setNumberRange(0, numberOfItems+1);
					
					
					function hexToRgb(hex) {
						// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
						var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
						hex = hex.replace(shorthandRegex, function(m, r, g, b) {
							return r + r + g + g + b + b;
						});

						var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
						return result ? {
							r: parseInt(result[1], 16),
							g: parseInt(result[2], 16),
							b: parseInt(result[3], 16)
						} : null;
					}				
					
					var borderBlack=[];
					function  getPalette(rainbowP){
						var s = [];
						for (var i = 0; i <= numberOfItems; i++) {
							var hexColour = rainbowP.colourAt(i);
							s[i]= '#' + hexColour;
							//console.log(numberOfItems + "-" +hexColour);
							var rgb=hexToRgb(s[i]);
							s[i]= 'RGBA('+rgb.r+ ',' + rgb.g + ',' + rgb.b+ ','+layout.transparent+')';
							borderBlack[i]="#000000";
						}
						return  s;
					}
					

					if(layout.palette=="analogue1"){
						rainbow.setSpectrum('#A500DB', '#006EE5', '#00CE36', '#E5D300', '#DB5800');
						palette=getPalette(rainbow);
					}
					if(layout.palette=="analogue2"){
						rainbow.setSpectrum('#3BDB00', '#E5A900', '#CE1A00', '#7500E5', '#00A2DB');
						palette=getPalette(rainbow);
					}
					if(layout.palette=="yellowRed"){
						rainbow.setSpectrum('#C7DB00','E5B800','CE7800','E53D00', '#DB0029');
						palette=getPalette(rainbow);
					}
					if(layout.palette=="whiteBlue"){
						rainbow.setSpectrum('#D7FFF0','#90E8E8','#34B9FF','#0047E8','#0B00FF');					
						palette=getPalette(rainbow);
					}
					if(layout.palette=="brazil"){
						rainbow.setSpectrum('#0025FF','#FFFB00','#FFFB00','#FFFB00','#FFFB00','#FFFB00','#FFFB00','#FFFB00','#FFFB00','#00D108');					
						palette=getPalette(rainbow);
					}				
					if(layout.palette=="colored"){
						//rainbow.setSpectrum('#D7FFF0','#90E8E8','#34B9FF','#0047E8','#0B00FF');					
						palette=getPalette(rainbow);
					}
					//palette=paletteBG;
					if(layout.palette=="default")
						palette=palette;
					
					
					return palette;
				}
			 
			 
			 function setUndefined(){
				 if(typeof(layout.showvalues) == "undefined")
					layout.showvalues=false;					 
				 if(typeof(layout.transparent) == "undefined")
					layout.transparent=1;					 
				 if(typeof(layout.labelsApprox) == "undefined")
					layout.labelsApprox=1;					 
				 if(typeof(layout.minTextSize) == "undefined")
					layout.minTextSize=15;	
				if(typeof(layout.maxTextSize) == "undefined")
					layout.maxTextSize=16;	
				if(typeof(layout.palette) == "undefined")
					layout.palette="analogue1";	
				if(typeof(layout.border) == "undefined")
					layout.border=false;
				if(typeof(layout.polar) == "undefined")
					layout.polar="polar";
				if(typeof(layout.backgroundColor) == "undefined"){
					layout.backgroundColor={};				
					layout.backgroundColor['color']="white;"
					layout.backgroundColor['color']="rgba(255,255,255,0);"
				}
				if(typeof(layout.bold) == "undefined")
					layout.bold="bold";				
				if(typeof(layout.capitalize) == "undefined")
					layout.capitalize="upper";	
					
				if(typeof(layout.keyPositionX) == "undefined")
					layout.keyPositionX=0;	
				if(typeof(layout.keyPositionY) == "undefined")
					layout.keyPositionY=0;	
				if(typeof(layout.graphGutter) == "undefined")
					layout.graphGutter="graph";		
				if(typeof(layout.labelTextSize) == "undefined")
					layout.labelTextSize=100;					
	
				if(typeof(layout.labelDistance) == "undefined")
					layout.labelDistance=10;
				
				if(typeof(layout.gutterTop) == "undefined")
					layout.gutterTop=30;			
				if(typeof(layout.gutterLeft) == "undefined")
					layout.gutterLeft=100;	

				if(typeof(layout.upScale) == "undefined")
					layout.upScale="n";	
				if(typeof(layout.downScale) == "undefined")
					layout.downScale="s";	
				if(typeof(layout.leftScale) == "undefined")
					layout.leftScale="w";	
				if(typeof(layout.rightScale) == "undefined")
					layout.rightScale="e";	
				if(typeof(layout.stepScale) == "undefined")
					layout.stepScale=5;	
				
				/*
				*/
				if(typeof(layout.fontColor) == "undefined"){
					layout.fontColor={};				
					//layout.fontColor['color']="white;"
					layout.fontColor['color']="#190000;"
				}
				/*
				//inicio bipartite
				if(typeof(layout.pad) == "undefined"){
						layout.pad=3;
				}
				if(typeof(layout.spaceLabelLeft) == "undefined"){
						layout.spaceLabelLeft=2;
				}
				if(typeof(layout.spaceLabelRight) == "undefined"){
						layout.spaceLabelRight=2;
				}
				if(typeof(layout.posX) == "undefined"){
						layout.posX=0;
				}
				if(typeof(layout.posY) == "undefined"){
						layout.posY=0;
				}				
				if(typeof(layout.width) == "undefined"){
						layout.width=8;
				}
				if(typeof(layout.height) == "undefined"){
						layout.height=8;
				}				
				if(typeof(layout.labelIn) == "undefined"){
						layout.labelIn="out";
				}				
				if(typeof(layout.barSize) == "undefined"){
						layout.barSize=0;
				}				
				if(typeof(layout.fontColor) == "undefined"){
					layout.fontColor={};				
					//layout.fontColor['color']="white;"
					layout.fontColor['color']="#190000;"
				}
				if(typeof(layout.fontSizeLabel) == "undefined")
					layout.fontSizeLabel=12;				
				if(typeof(layout.minTextSize) == "undefined")
					layout.minTextSize=15;	
				if(typeof(layout.maxTextSize) == "undefined")
					layout.maxTextSize=16;	
				if(typeof(layout.palette) == "undefined")
					layout.palette="analogue1";	
				if(typeof(layout.border) == "undefined")
					layout.border=false;
				if(typeof(layout.backgroundColor) == "undefined"){
					layout.backgroundColor={};				
					layout.backgroundColor['color']="white;"
					layout.backgroundColor['color']="rgba(255,255,255,0);"
				}
				if(typeof(layout.bold) == "undefined")
					layout.bold="bold";				
				if(typeof(layout.capitalize) == "undefined")
					layout.capitalize="upper";	
				if(typeof(layout.labelTextSize) == "undefined")
					layout.labelTextSize=100;	
	
				if(typeof(layout.labelDistance) == "undefined")
					layout.labelDistance=10;
				//fim bipartite
				*/
				 
			 }
		}	
		
		
		
	};

} );

