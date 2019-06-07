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
		"RGraph.bar": "../extensions/NExtensions4Qlik/libraries/RGraph.bar",
		"RGraph.hprogress": "../extensions/NExtensions4Qlik/libraries/RGraph.hprogress",
		"RGraph.common.key": "../extensions/NExtensions4Qlik/libraries/RGraph.common.key",
		"d32":'../extensions/NExtensions4Qlik/libraries/d3',
		
		"viz":'../extensions/NExtensions4Qlik/libraries/viz'
		,
		"cloud":'../extensions/NExtensions4Qlik/libraries/d3.layout.cloud'
		,
		"RGraph.drawing.rect":'../extensions/NExtensions4Qlik/libraries/RGraph.drawing.rect',
		"RGraph.drawing.text":'../extensions/NExtensions4Qlik/libraries/RGraph.drawing.text'
	
    },
	 /*shim: {
		  "plottable": {
           deps: ["d32"]
           , exports: "Plottable"
        },
	 },*/
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
		,"text!./gantt.css",
		,"RGraph"
		,"RGraph.rosemv"
		,"RGraph.radar"
		,"RGraph.funnel"
		,"RGraph.waterfall",	
		,"RGraph.bar",
		,"RGraph.hprogress"
		,"RGraph.common.dynamic"
		,"RGraph.common.tooltips"
		,"RGraph.common.key"
		,'RGraph.drawing.rect'
		,"RGraph.drawing.text"		
		,'./libraries/rainbowvis'
		,'./biPartite'
		,'./wordCloudChart'
		,'./gantt'
		//,'./bumps'




		
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
				//console.log(layout.qHyperCube.qMeasureInfo);
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
				/*
				else if(layout.polar=="bumps"){
					if(numberOfDimensions==2 && numberOfMeasures==1)
						bumpsChart(app,$element,layout,qMatrix,d3,plott,createPalette);
					else{
						//To generate random numbers to allow multiple charts to present on one sheet:						
						$element.html(getHtml(messages[language].BIPARTITE_DIMENSIONMEASURE));
					}					
				}*/				
				else 
				{
				
					var html="";
					
					// Get the Number of Dimensions and Measures on the hypercube
					var numberOfDimensions = layout.qHyperCube.qDimensionInfo.length;
					//console.log(numberOfDimensions);
					var numberOfMeasures = layout.qHyperCube.qMeasureInfo.length;
					//console.log(numberOfMeasures);
					
					// Get the Measure Name and the Dimension Name
					var measureName="";
					if(numberOfMeasures>0)
						 measureName = layout.qHyperCube.qMeasureInfo[0].qFallbackTitle;
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
					//console.log("olap3");

					if(layout.polar=="heatbrick"){
						
						if(layout.qHyperCube.qDimensionInfo.length==4 && layout.qHyperCube.qMeasureInfo.length==1){
						
							var  maxOfMax=0;
							var totalCharts = {};
							var structure=[];
							
							var structureDimXKeys = [];
							var structureDimYKeys = [];
							var alerts = [];	
								
							var structureDimX=[];	

							var minScale=[];
							
							var maxScale=[];
							
							var palette = [];
							
							var tamX =[];
							var tamY=[];
							html='';
							var guids=[];
							for(var i=0; i< qMatrix.length;i++)
							{
								totalCharts[qMatrix[i][0].qText]=qMatrix[i][0].qText;
							}
							
							
							var totalChartsKeys = Object.keys(totalCharts);
							
							for(var it = 0;  it < totalChartsKeys.length; it++)
							{
								structure.push({});
								structureDimX.push({});
								alerts.push({});
								guids.push(guid());
							}
							
							var maxLengthInY=0;
							var maxLengthInX=0;
							for(var it = 0;  it < totalChartsKeys.length; it++)
							{						
								minScale.push(100000000000);
								maxScale.push(0);
								
								//var structure={};
								
								//var structureDimX={};
								
								//var tamY=0;
								//console.log(qMatrix);
								
								//0 all chart
								//1 name in square
								//2 y series
								//3 x series
								//measure
								for(var i=0; i< qMatrix.length;i++)
								{
									if(qMatrix[i][0].qText==totalChartsKeys[it])
									{	
										structureDimX[it][qMatrix[i][3].qText]=1; 
										if(!(qMatrix[i][2].qText in structure[it])){
											structure[it][qMatrix[i][2].qText]={};
											//if(qMatrix[i][1].qText in structure[qMatrix[i][0].qText]){
											
												
											//}
											//else{
												
											//}	
											//structure[Matrix[i][0].qText]={}
										}
										//else{
											
										//}									
										
										
										if(qMatrix[i][4].qNum < minScale[it])
											minScale[it]=qMatrix[i][4].qNum;
										if(qMatrix[i][4].qNum > maxScale[it])
											maxScale[it]=qMatrix[i][4].qNum;							
										structure[it][qMatrix[i][2].qText][qMatrix[i][3].qText]=qMatrix[i][4].qNum;
										structure[it][qMatrix[i][2].qText][qMatrix[i][3].qText+"-chart"]=qMatrix[i][0].qText;
										structure[it][qMatrix[i][2].qText][qMatrix[i][3].qText+"-square"]=qMatrix[i][1].qText;
									}
								}
								//console.log(totalChartsKeys[it]);
								//console.log(maxScale[it]+1);
								//console.log(minScale[it]);
								/*
								var diff = maxScale[it]-minScale[it];
								var diff5=  diff/5;
								var tDiff = minScale[it];
								*/
								/*for(var di=0; di<5;di++){
									
									tDiff+=diff5;
									//console.log(tDiff);
								}*/
								var rangesScale = layout.rangesScale;

								
																
								
								//palette.push(createPalette((maxScale[it]+1)-minScale[it],{},{}));
								palette.push(createPalette(rangesScale-1,{},{}));
								//console.log(palette[it]);
								var arrayStructureDimX = Object.keys(structureDimX[it]);
								if(maxOfMax<arrayStructureDimX.length)
									maxOfMax=arrayStructureDimX.length;							
								structureDimXKeys.push(arrayStructureDimX);
								structureDimYKeys.push(Object.keys(structure[it]));
								
								
								var tam=20;
								
								
									
								
								for(var i=0; i<structureDimXKeys[it].length;i++){
									
									
									if(maxLengthInX<structureDimXKeys[it][i].length)
										maxLengthInX=structureDimXKeys[it][i].length;											
									//structureDimXKeys
									
									for(var j=0;  j<structureDimYKeys[it].length; j++){
										
										//tamanho string no Y
										if(maxLengthInY<structureDimYKeys[it][j].length)
											maxLengthInY=structureDimYKeys[it][j].length;
										
										if(!(structureDimXKeys[it][i] in structure[it][structureDimYKeys[it][j]])){
											//structure[structureDimYKeys[i]]={};
											structure[it][structureDimYKeys[it][j]][structureDimXKeys[it][i]]=0;
											alerts[it][i+','+j] = {'color':'white','message':''};
										}
										else{
		//'Em ' +structureDimYKeys[j] + ' a Conn/Rep ' + structureDimXKeys[i] + ' teve ' + structure[structureDimYKeys[j]][structureDimXKeys[i]]
									//console.log("-----------");
									//console.log(structure[it][structureDimYKeys[it][j]][structureDimXKeys[it][i]+"-square"]);
									//console.log(palette[it][(structure[it][structureDimYKeys[it][j]][structureDimXKeys[it][i]]+1)-minScale[it]]);
									//console.log((structure[it][structureDimYKeys[it][j]][structureDimXKeys[it][i]]+1)-minScale[it]);
									//console.log("-----------");		
	//palette[it][(structure[it][structureDimYKeys[it][j]][structureDimXKeys[it][i]]+1)-minScale[it]]
											var colorIt=
											Math.floor(
											(structure[it][structureDimYKeys[it][j]][structureDimXKeys[it][i]]-minScale[it])/((maxScale[it]-minScale[it])/rangesScale)
											);
											if(colorIt==rangesScale)
												colorIt--;
											//console.log(colorIt);
											alerts[it][i+','+j] = {'color':palette[it][colorIt],'message':structure[it][structureDimYKeys[it][j]][structureDimXKeys[it][i]+"-square"]+": "+structure[it][structureDimYKeys[it][j]][structureDimXKeys[it][i]] };
										}
										
										
									}
									
								}
								/*
								//console.log("oi1");
								//console.log(structureDimXKeys);
								//console.log("oi2");
								//console.log(structureDimYKeys);
								//console.log("oi3");
								*/
								//console.log(structure);
								//console.log(structureDimX);
								//var tam=20;
								tamX.push(structureDimXKeys[it].length);
								//console.log("oi4");
								tamY.push(structureDimYKeys[it].length);
								//console.log("oi5");
								
								
								html+='<div style="height:'+height+'px; overflow: auto;background-color: '+ layout.backgroundColor.color +';" id="canvas-wrapper-'+guids[it]+'"><canvas id="' + guids[it] + '" width="'+(width-10)+'" height="'+structureDimYKeys[it].length*(tam+5)+'">[No canvas support]</canvas></div><div id="myKey-'+guids[it]+'"></div>';
								//onsole.log(html);
								//console.log("oi2");
							}
							
							//console.log("max  em  y é  "  +  maxLengthInY);
							
							//(ip*((tam/2)+0))+80
							if(maxLengthInX>10)
								maxLengthInX=10;
							//console.log("será " +  maxLengthInX);
						
							var maxSizeLegends = maxLengthInX*5;
							
							var maxWidthWithPalette = 0;
							var maxWidth = (122+(maxOfMax*(tam+5)));
							var spaceTitleChart=30;
							var lengthTotal=0;
							for(var it = 0;  it < totalChartsKeys.length; it++)
							{
								
								if(maxWidthWithPalette < (palette[it].length*((tam/1)+0))+90 )
									maxWidthWithPalette=(palette[it].length*((tam/1)+0))+90;
								lengthTotal+=structureDimYKeys[it].length*(tam+5)+spaceTitleChart+50+maxSizeLegends;
								if(it>0)
									lengthTotal+=20;
							}
							if(maxWidthWithPalette>maxWidth)
								maxWidth=maxWidthWithPalette;
							lengthTotal+=30;
							//var lengthTotal = structureDimYKeys[0].length+structureDimYKeys[1].length+100;
							html='<div style="height:'+height+'px; width:'+width+'px; overflow:auto;background-color: '+ layout.backgroundColor.color +';" id="canvas-wrapper-'+guids[0]+'"><canvas id="' + guids[0] + '" width="'+maxWidth+'" height="'+(lengthTotal)+'">[No canvas support]</canvas></div><div id="myKey-'+guids[0]+'"></div>';						
							
							$element.html(html);						
							//console.log(minScale);
							//console.log(maxScale);
							//console.log(palette);
							var yIt=0;
							for(var it = 0;  it < totalChartsKeys.length; it++)
							{
								
								if(it>0)
									yIt+= ((structureDimYKeys[it-1].length*(tam+5))+100)+maxSizeLegends;
							
								//layout.qHyperCube.qDimensionInfo[i].qFallbackTitle
								//title y
								var yTitle = layout.qHyperCube.qDimensionInfo[2].qFallbackTitle;
								for(var m=0;m<yTitle.length;m++)
								{
									var text = new RGraph.Drawing.Text({
										id: guids[0],
										x:20,
										y:30+yIt+(m*12),
										text: yTitle.substr(m,1),
										options: {
											colors:['black'],
											valign: 'top',
											halign: 'center',
											size: 8,
											font:'QlikView Sans',
											angle:0,
											bold:true
											
										}
									}).draw();								
								}
								
								
								//title  x
								var text = new RGraph.Drawing.Text({
										id: guids[0],
										x:80,
										y:spaceTitleChart+(structureDimYKeys[it].length*(tam+5))+yIt+20+maxSizeLegends,
										text: layout.qHyperCube.qDimensionInfo[3].qFallbackTitle,
										options: {
											colors:['black'],
											valign: 'top',
											halign: 'left',
											size: 8,
											font:'QlikView Sans',
											angle:0,
											bold:true
											
										}
									}).draw();								
								
								
								
								//Main Title
								var text = new RGraph.Drawing.Text({
									id: guids[0],
									x:60,
									y:yIt,
									text: totalChartsKeys[it],
									options: {
										colors:['black'],
										valign: 'top',
										halign: 'left',
										size: 14,
										font:'QlikView Sans',
										bold:true
										
									}
								}).draw();								
								
								
								//legends
								for(var ip=0;ip<palette[it].length;ip++)
								{
									//console.log("ola "+palette[it][ip]);
									var rect = new RGraph.Drawing.Rect({
										id: guids[0],
										x: (ip*((tam/1)+0))+80,
										y:  maxSizeLegends+spaceTitleChart+(structureDimYKeys[it].length*(tam+5))+yIt+40,
										width: tam/1,
										height: tam/2,
										options: {
											strokestyle: 'rgba(0,0,0,0.5)',
											fillstyle: palette[it][ip]
										}
									}).draw();
									if(ip==0 || ip == (palette[it].length-1) || (ip+1)==Math.floor(((palette[it].length-1)/2))){
										var textIt="";
										var ipIt = 0;
										if(ip==0){
											ipIt=ip;
											//textIt = String(minScale[it])+"-"+String((minScale[it]+((maxScale[it]-minScale[it])/5)).toFixed(1));
											textIt = String(minScale[it]);
											//textIt="";
										}
										else if((ip+1)==Math.floor(((palette[it].length-1)/2)))
										{
											ipIt=ip+1;
											//console.log(minScale[it]);
											//console.log(maxScale[it]);
											//console.log((maxScale[it]-minScale[it])/5);
											//console.log(ip);
											//console.log((minScale[it]+(ip*((maxScale[it]-minScale[it])/rangesScale))).toFixed(1));
											
											//var textIt=String((minScale[it]+(ip*((maxScale[it]-minScale[it])/rangesScale))).toFixed(1));
											var textIt=String((minScale[it]+((ip+2)*((maxScale[it]-minScale[it])/rangesScale))).toFixed(1));
											
											//console.log((minScale[it]+((ip+1)*((maxScale[it]-minScale[it])/rangesScale))).toFixed(1));
											//textIt+="-"+String((minScale[it]+((ip+1)*((maxScale[it]-minScale[it])/rangesScale))).toFixed(1));
											//if(rangesScale%2==0 && rangesScale>3);
											//	textIt+="-"+String((minScale[it]+((ip+2)*((maxScale[it]-minScale[it])/rangesScale))).toFixed(1));
											
										}
										else if(ip == (palette[it].length-1))
										{
											ipIt=ip;
											//var textIt=String((minScale[it]+(ip*((maxScale[it]-minScale[it])/rangesScale))).toFixed(1));
											//textIt+="-"+String(maxScale[it]);
											textIt = String(maxScale[it]);
										}
										
										var text = new RGraph.Drawing.Text({
											id: guids[0],
											x:(((ipIt)+0.5)*((tam/1)+0))+83,
											y:maxSizeLegends+spaceTitleChart+(structureDimYKeys[it].length*(tam+5))+yIt+55,
											//text: String(ip+minScale[it]),
											text: textIt,
											options: {
												colors:['black'],
												valign: 'top',
												halign: 'center',
												size: 7,
												font:'QlikView Sans'											
											}
										}).draw();	
										//console.log("foi?"+ip);
									}
									
									
								}
							
							
							
								//console.log
								var offsetX=0;
								if(maxLengthInY>10)
									maxLengthInY=10;
								if(maxLengthInY>4)				
									offsetX=5*(maxLengthInY-4);
								for (var y=0; y<tamY[it]; ++y) {
								
									// 60 "Computers per cluster" (sticking to the datacenter analogy)
									//labels Y
									var text = new RGraph.Drawing.Text({
										id: guids[0],
										x:offsetX+40,
										y:spaceTitleChart+(y*(tam+5)) + yIt,
										text: structureDimYKeys[it][y].slice(0,10),
										options: {
											colors:['black'],
											valign: 'top',
											halign: 'center',
											size: 10,
											font:'QlikView Sans'
											
										}
									}).draw();	
									for (var x=0; x<tamX[it]; ++x) {
									
										//values  inside brick
										if(alerts[it][x+','+y].color!='white')
										{
											

											var text = new RGraph.Drawing.Text({
												id: guids[0],
												x:offsetX+(x*((tam)+5))+80+(tam/2),
												y:spaceTitleChart+(y*(tam+5)) +yIt+(tam/3),
												//text: String(ip+minScale[it]),
												text: structure[it][structureDimYKeys[it][y]][structureDimXKeys[it][x]],
												options: {
													colors:["RGBA(0,0,0,0.5)"],
													valign: 'top',
													halign: 'center',
													size: 6,
													font:'QlikView Sans'											
												}
											}).draw();
										}
										
										
										
										var rect = new RGraph.Drawing.Rect({
											id: guids[0],
											x: offsetX+(x*(tam+5))+80,
											y: spaceTitleChart+(y*(tam+5)) +yIt,
											width: tam,
											height: tam,
											options: {
												strokestyle: 'rgba(0,0,0,0.5)'
											}
										})

										if (alerts[it][x+','+y]) {
											//console.log(alerts[it][x+','+y]);
											if(alerts[it][x+','+y].color=='white'){
												rect.set({
												fillstyle: alerts[it][x+','+y].color,
												//tooltips: [alerts[it][x+','+y].message],
												strokestyle: 'rgba(255,255,255,1)'
												});
											}
											else{
												rect.set({
													fillstyle: alerts[it][x+','+y].color,
													tooltips: [alerts[it][x+','+y].message]
												})
											}
										} else {
											//rect.set('fillstyle', 'rgba(100,255,100,0.2)');
											rect.set({strokestyle: 'rgba(255,0,0,1)'});
										}

										rect.draw();
									}
								}

								for(var  i = 0; i<structureDimXKeys[it].length;i++){
									//console.log((i*(tam+5))+50);
									var text4 = new RGraph.Drawing.Text({
											id: guids[0],
											//x:400,
											//y:50,
											x:offsetX+(i*(tam+5))+92,
											y:spaceTitleChart+((structureDimYKeys[it].length*(tam+5))+10)+yIt,
											text: structureDimXKeys[it][i].slice(0,10),
											//text: 'asasasas',
											options: {
												colors:['black'],
												valign: 'center',
												halign: 'right',
												size: 10,
												font:'QlikView Sans',
												//tooltips: [structureDimXKeys[it][i]],
												//tooltips: ['sasasasasas'],
												//tooltipsHighlight: false,
												//tooltipsEvent: 'mousemove',
												angle:-45
											}
										}).draw();
								}
							}
						}							
						else{
							//To generate random numbers to allow multiple charts to present on one sheet:						
							$element.html(getHtml(messages[language].HEATBRICK_DIMENSIONMEASURE));
						}
						
						
					}
					else if(layout.polar=="hprogress"){
						//console.log(layout.qHyperCube);
						if(layout.qHyperCube.qDimensionInfo.length>0 && layout.qHyperCube.qMeasureInfo.length>0){
							
							width = $element.width();
							//console.log(qMatrix);
							var cellHeight=18;
							var limitWidthWhenScroll = 12;
							//width=width-100;
							var taxHeight=1;
							var taxWidth=1;
							
							if((qMatrix.length+1)*cellHeight<height){
								limitWidthWhenScroll=12;
								//taxWidth	=0.96;							
							}								
							
							
							
							/*
							var htmlNovo = '<div  style="width: '
							+
							//parseInt(width*(taxWidth/taxWidth))
							'100%'
							+';height:'+parseInt(height*taxHeight)+
							//'px;overflow: auto;"><div class="divTable" style="width: '
							'px;"><div class="divTable" style="width: '
							+
							//parseInt(width*(taxWidth/taxWidth))
							'100%'
							+';border: 0px solid #000;" >';
							*/
							
							
							
							
							//<div class="divTableHeadings">';
							//var width = $element.width(), height = $element.height();
							//console.log(qMatrix);
							var backgroundColor='rgb(200,200,200)';
							var totalColumns = layout.qHyperCube.qDimensionInfo.length+layout.qHyperCube.qMeasureInfo.length;
							
							/*
							var htmlHeader='<div class="divTableRow" style="font-weight: bold;background-color:'+backgroundColor+';">';
							
							var limitWidthWhenScroll = 0;
							
							for(var i=0; i< layout.qHyperCube.qDimensionInfo.length;i++)
							{
								//console.log(layout.qHyperCube.qDimensionInfo[i]);
								
								htmlHeader+='<div class="divTableHead" style="width: '+parseInt((width-limitWidthWhenScroll)*taxWidth)/totalColumns+'px;" >'+layout.qHyperCube.qDimensionInfo[i].qFallbackTitle+'</div>';
								
							}
							
							
							
							for(var i=0; i< layout.qHyperCube.qMeasureInfo.length;i++)
							{
								//console.log(layout.qHyperCube.qMeasureInfo[i]);
								
								htmlHeader+='<div class="divTableHead" style="width: '+parseInt((width-limitWidthWhenScroll)*taxWidth)/totalColumns+'px;" >'+layout.qHyperCube.qMeasureInfo[i].qFallbackTitle+'</div>';
								
							}
							htmlHeader+="</div>";
							htmlHeader+="</div>";	*/						
							//console.log(htmlHeader);
							
							var htmlBodyInicio='<div  style="overflow-y:auto;height:'+parseInt(height*(taxHeight-0.02))+'px"><div class="divTable"  style="width: '
							+
							String(parseInt(width-limitWidthWhenScroll))+"px"
							//'90%'
							//+';height:'+parseInt(height*(taxHeight-0.02))+'px">';
							+';height:'+parseInt((qMatrix.length+1)*cellHeight)+'px;border: '+layout.borderOut+'px solid #000;">';
							

							//height = 20;
							
							
							
							
							var htmlHeader = '<div class="divTableRow" style="font-weight: bold;background-color:'+backgroundColor+';">';
							//htmlBody+='<div class="divTableRow" style="font-weight: bold;background-color:'+backgroundColor+';">';
							for(var i=0; i< layout.qHyperCube.qDimensionInfo.length;i++)
							{
								//console.log(layout.qHyperCube.qDimensionInfo[i]);
								
								htmlHeader+='<div class="divTableHead" style="border: '+layout.borderIn+'px solid #999999;height:'+cellHeight+'px;width: '+parseInt((width-limitWidthWhenScroll)*(taxWidth/taxWidth))/totalColumns+'px;" >'+layout.qHyperCube.qDimensionInfo[i].qFallbackTitle+'</div>';
								
							}
							
							
							
							for(var i=0; i< layout.qHyperCube.qMeasureInfo.length;i++)
							{
								//console.log(layout.qHyperCube.qMeasureInfo[i]);
								
								htmlHeader+='<div class="divTableHead" style="border: '+layout.borderIn+'px solid #999999;height:'+cellHeight+'px;width: '+parseInt((width-limitWidthWhenScroll)*(taxWidth/taxWidth))/totalColumns+'px;" >'+layout.qHyperCube.qMeasureInfo[i].qFallbackTitle+'</div>';
								
							}							
							htmlHeader+='</div>';
							
							
							
							
							
							var guidsNovo = {};
							var guidsNovoValues = {};
							
							for(var i=0; i<layout.qHyperCube.qMeasureInfo.length;i++)
							{
								if(layout.qHyperCube.qMeasureInfo[i].showHProgress)
								{
									
									var array = [];
									guidsNovoValues[String(i)]=array;
									var array2 = [];
									guidsNovo[String(i)]=array2;									
								}
							}
							var  htmlBody='';
							for(var i=0; i< qMatrix.length;i++)
							{
								//console.log(layout.qHyperCube.qDimensionInfo[i]);
								
								backgroundColor = 'white';
								if(i%2==1)
									backgroundColor='rgb(200,200,200)';
								htmlBody+='<div class="divTableRow" style="background-color:'+backgroundColor+';">';
								
								
								for(var j = 0; j<qMatrix[i].length;j++)
								{
									//eh medida  e tem hprogress
									if(j+1>layout.qHyperCube.qDimensionInfo.length && layout.qHyperCube.qMeasureInfo[j-layout.qHyperCube.qDimensionInfo.length].showHProgress=="hprogress"){
										//console.log("tem q mostrar");
										//console.log(layout.qHyperCube.qMeasureInfo[j-layout.qHyperCube.qDimensionInfo.length]);
										//console.log([String(j-layout.qHyperCube.qDimensionInfo.length),guid()]);
										//guidsNovo.push([String(j-layout.qHyperCube.qDimensionInfo.length),guid()]);
										guidsNovo[String(j-layout.qHyperCube.qDimensionInfo.length)].push(guid());
										var k=String(j-layout.qHyperCube.qDimensionInfo.length);
										htmlBody+='<div class="divTableCell" style="border: '+layout.borderIn+'px solid #999999;height:'+cellHeight+'px;width: '+parseInt((width-limitWidthWhenScroll)*taxWidth)/totalColumns+'px;" id="canvas-wrapper-'+guidsNovo[k][guidsNovo[k].length-1]+'"><canvas id="' + guidsNovo[k][guidsNovo[k].length-1] + '" width="'+parseInt(width*(taxWidth/taxWidth))/totalColumns+'" height="'+cellHeight+'">[No canvas support]</canvas></div>';
										
										var arrayConfVales=[]
										
										
										
										//var hpmin=layout.qHyperCube.qMeasureInfo[j-layout.qHyperCube.qDimensionInfo.length].minHProgress;
										if(isNaN(qMatrix[i][j].qAttrExps.qValues[0].qNum))
											var hpmin =  0;
										else
											var hpmin=qMatrix[i][j].qAttrExps.qValues[0].qNum;
										arrayConfVales.push(hpmin);
										//var hpmax=layout.qHyperCube.qMeasureInfo[j-layout.qHyperCube.qDimensionInfo.length].maxHProgress;
										if(isNaN(qMatrix[i][j].qAttrExps.qValues[1].qNum))
											var hpmax =1;
										else
											var hpmax=qMatrix[i][j].qAttrExps.qValues[1].qNum;
										arrayConfVales.push(hpmax);
										//var hpseg1=layout.qHyperCube.qMeasureInfo[j-layout.qHyperCube.qDimensionInfo.length].segment1;
										var hpseg1=qMatrix[i][j].qAttrExps.qValues[2].qNum;
										arrayConfVales.push(hpseg1);
										var hpseg1Color=qMatrix[i][j].qAttrExps.qValues[3].qText;
										arrayConfVales.push(hpseg1Color);
										//var hpseg2=layout.qHyperCube.qMeasureInfo[j-layout.qHyperCube.qDimensionInfo.length].segment2;
										var hpseg2=qMatrix[i][j].qAttrExps.qValues[4].qNum;
										arrayConfVales.push(hpseg2);
										var hpseg2Color=qMatrix[i][j].qAttrExps.qValues[5].qText;
										arrayConfVales.push(hpseg2Color);
										//var hpseg3=layout.qHyperCube.qMeasureInfo[j-layout.qHyperCube.qDimensionInfo.length].segment3;
										var hpseg3=qMatrix[i][j].qAttrExps.qValues[6].qNum;
										arrayConfVales.push(hpseg3);
										var hpseg3Color=qMatrix[i][j].qAttrExps.qValues[7].qText;
										arrayConfVales.push(hpseg3Color);
										//console.log(arrayConfVales);
										arrayConfVales.push(qMatrix[i][j].qNum);
										//guidsNovoValues.push(qMatrix[i][j].qNum);																			
										guidsNovoValues[String(j-layout.qHyperCube.qDimensionInfo.length)].push(arrayConfVales);																			
										
									}
									else if(j+1>layout.qHyperCube.qDimensionInfo.length && layout.qHyperCube.qMeasureInfo[j-layout.qHyperCube.qDimensionInfo.length].showHProgress=="circleArrow"){
										//console.log(qMatrix[i][j].qAttrExps.qValues[1].qText);
										var color='black';
										var circleArrow = "circle";
										if(qMatrix[i][j].qAttrExps !== undefined){
											color= qMatrix[i][j].qAttrExps.qValues[0].qText;
											circleArrow= qMatrix[i][j].qAttrExps.qValues[1].qText;
										}
										if(circleArrow=="circle")
											var htmlItem='<span class="dot" style="background-color: '+color+';"></span>';
										else
											var htmlItem='<i class="'+circleArrow+'" style="color: '+color+';"></i>';
										htmlBody+='<div class="divTableCell" style="border: '+layout.borderIn+'px solid #999999;height:'+cellHeight+'px;font-weight: bold;color:'+color+';width: '+parseInt((width-limitWidthWhenScroll)*(taxWidth/taxWidth))/totalColumns+'px;" >'+htmlItem+'</div>';										
									}
									else
									{
										var color='black';
										
										if(qMatrix[i][j].qAttrExps !== undefined)
											color= qMatrix[i][j].qAttrExps.qValues[0].qText;
										
										htmlBody+='<div class="divTableCell" style="border: '+layout.borderIn+'px solid #999999;height:'+cellHeight+'px;font-weight: bold;color:'+color+';width: '+parseInt((width-limitWidthWhenScroll)*(taxWidth/taxWidth))/totalColumns+'px;" >'+qMatrix[i][j].qText+'</div>';
									}
										
								}

								htmlBody+='</div>';
								
							}
							
							var htmlBodyFim ='</div>';
							//htmlBody+='</div>';
							//console.log(htmlBody);							
	
							//htmlNovo=htmlNovo+htmlBodyInicio+htmlHeader+htmlBody+htmlBodyFim+'</div>';
							var  htmlNovo=htmlBodyInicio+htmlHeader+htmlBody+htmlBodyFim+'</div>';
							//</div>';
							
							//console.log(guidsNovoValues);
							//console.log(guidsNovo);
							
							
							
							var widthBar = width*0.6;
							
							//console.log("oi2");
							// add canvas for chart			

							//onsole.log(html);


							//$element.html(html);
							$element.html(htmlNovo);
							//console.log(((hpseg1-hpmin)/(hpmax-hpmin))*100);
							//console.log((((hpseg2-hpseg1))/(hpmax-hpmin))*100);
							//console.log((((hpseg3-hpseg2))/(hpmax-hpmin))*100);
							var guidsNovoKeys=Object.keys(guidsNovo);
							for(var i =0;i<guidsNovoKeys.length;i++){
								
								for(var j =0; j< guidsNovoValues[guidsNovoKeys[i]].length;j++){
									hpmin=guidsNovoValues[guidsNovoKeys[i]][j][0];
									//console.log(hpmin);
									hpmax=guidsNovoValues[guidsNovoKeys[i]][j][1];
									hpseg1=guidsNovoValues[guidsNovoKeys[i]][j][2];
									hpseg2=guidsNovoValues[guidsNovoKeys[i]][j][4];
									hpseg3=guidsNovoValues[guidsNovoKeys[i]][j][6];
									//var 
									var  hprogress =  new RGraph.HProgress({
										id: guidsNovo[guidsNovoKeys[i]][j],
										min: 0,
										max: 100,
										value: [((hpseg1-hpmin)/(hpmax-hpmin))*100,(((hpseg2-hpseg1))/(hpmax-hpmin))*100,(((hpseg3-hpseg2))/(hpmax-hpmin))*100],
										options: {
											vmargin: 7,
											//bevelled: true,
											textColor: 'rgba(0,0,0,0)',
											/*tooltips: [
												'An example tooltip!',
												'Foo',
												'bar'
											],*/
											colors: [guidsNovoValues[guidsNovoKeys[i]][j][3],guidsNovoValues[guidsNovoKeys[i]][j][5],guidsNovoValues[guidsNovoKeys[i]][j][7]]
										}
									}).draw();
									var getX = ((guidsNovoValues[guidsNovoKeys[i]][j][8]-hpmin)/(hpmax-hpmin))*100;
									if(getX>100)
										getX=100;
									else if(getX<0)
										getX=0;
									var x = hprogress.getXCoord(getX);
									
									//console.log(x);
									
									//console.log(hprogress.canvas.height);// - hprogress.marginTop - hprogress.marginBottom - 0);
									//console.log(hprogress.canvas.marginTop);
									//console.log(hprogress.canvas.marginBottom);
									// Create the rect object that indicates the target
									var rect = new RGraph.Drawing.Rect({
										id: guidsNovo[guidsNovoKeys[i]][j],
										x: x - 2,
										y: (hprogress.canvas.height*0.6)/3,
										width: 4,
										height: hprogress.canvas.height*0.6,
										options: {
											fillstyle: 'rgba(0,0,0,1)',
											highlightStroke: 'rgba(0,0,0,0)'/*,
											tooltips: ['The target was 95% of eveything, everywhere']*/
										}
									}).draw();
								}									
							}							
							
							/*
							for(var i =0;i<guids.length;i++){
								
								
									var  hprogress =  new RGraph.HProgress({
										id: guids[i],
										min: 0,
										max: 100,
										value: [20,20,60],
										options: {
											vmargin: 7,
											bevelled: true,
											textColor: 'rgba(0,0,0,0)',
											tooltips: [
												'An example tooltip!',
												'Foo',
												'bar'
											],
											colors: ['red','yellow','green']
										}
									}).draw();
								var getX = (i+1)*15;
								if(getX>100)
									getX=100;
								var x = hprogress.getXCoord(getX);
								
								//console.log(x);
								
								//console.log(hprogress.canvas.height);// - hprogress.marginTop - hprogress.marginBottom - 0);
								//console.log(hprogress.canvas.marginTop);
								//console.log(hprogress.canvas.marginBottom);
								// Create the rect object that indicates the target
								var rect = new RGraph.Drawing.Rect({
									id: guids[i],
									x: x - 2,
									y: (hprogress.canvas.height*0.6)/3,
									width: 4,
									height: hprogress.canvas.height*0.6,
									options: {
										fillstyle: 'rgba(0,0,0,0.9)',
										highlightStroke: 'rgba(0,0,0,0)',
										tooltips: ['The target was 95% of eveything, everywhere']
									}
								}).draw();								
							}*/
						}
						else{
							//Fazer mensagem hprogress					
							$element.html(getHtml(messages[language].HPROGRESS_DIMENSIONMEASURE));
						}
					}
					else if(layout.polar=="bumps"){
						if(layout.qHyperCube.qDimensionInfo.length==2 && layout.qHyperCube.qMeasureInfo.length==1){
							//bumpsChart(app,$element,layout,qMatrix,d3,plott,createPalette);
							
							var data = [[4,0,3],[4,8,6],[4,2,4],[4,2,3],[1,2,3],[8,8,4],[4,8,6]];

							var data = [];
							var data2 = {};
							var data2Labels = {};
							var data2Colors = {};
							var data2Values = {};
							var countries ={};
							var countPeriods = {};
							var totalPeriods = {};
							
							//console.log("oi? " + Object.keys(totalPeriods).length);
											
							
							for(var  i =0;i<qMatrix.length;i++)
							{
								if(Object.keys(totalPeriods).length<layout.lastPeriods){
									totalPeriods[qMatrix[i][1].qText]=1;
									//console.log(qMatrix[i][1].qText);
								}					
								
								if(totalPeriods[qMatrix[i][1].qText]  !==undefined)
								{
									if(countPeriods[qMatrix[i][1].qText]!== undefined)
										countPeriods[qMatrix[i][1].qText]++;
									else
										countPeriods[qMatrix[i][1].qText]=1;
									
									
									
									var dataI ={};
									dataI['country']=qMatrix[i][0].qText;					
									dataI['year']=qMatrix[i][1].qText;	
									//dataI['money']=qMatrix[i][2].qNum;
									//dataI['money']=countPeriods[qMatrix[i][1].qText];
									dataI['money']=1;
									dataI['value']=qMatrix[i][2].qNum;
									

									
									if(countPeriods[qMatrix[i][1].qText]<=layout.maxItemsPerPeriod ){
										
										
										countries[dataI['country']]=1;
										dataI['color']=Object.keys(countries).indexOf(dataI['country']);
										
										
										data.push(dataI);
										
										if(data2[dataI['year']] === undefined)
										{
											var yearArrays = [];
											var labelsArrays = [];
											var colorsArrays = [];
											var valuesArrays = [];
											data2[dataI['year']]=yearArrays;
											data2Labels[dataI['year']]=labelsArrays;
											data2Colors[dataI['year']]=colorsArrays;								
											data2Values[dataI['year']]=valuesArrays;	
										}
										data2[dataI['year']].push(dataI['money']);
										data2Labels[dataI['year']].push(dataI['country']);
										data2Colors[dataI['year']].push(dataI['color']);
										data2Values[dataI['year']].push(dataI['value']);
										
									}
								}
								
								
							}
							
							
							
							
							var arrayKeys = Object.keys(data2).reverse();
							var data3 = [];
							var data3Labels = [];
							var data3Colors = [];
							var data3Values = [];
							
							var yMax = 0;
							
							for(var i = 0; i < arrayKeys.length; i++)
							{
								data3.push(data2[arrayKeys[i]]);
								if(yMax<data2[arrayKeys[i]].length)
									yMax=data2[arrayKeys[i]].length;
								data3Labels.push(data2Labels[arrayKeys[i]]);
								data3Colors.push(data2Colors[arrayKeys[i]]);
								data3Values.push(data2Values[arrayKeys[i]]);
							}
							//console.log(data3Labels);
							var connections = [];
							
							for(var i = 0;  i< data3Labels.length-1; i++)
							{
								//connections[arrayKeys[i]]=[];
								var connectionYear=[];
								connections.push(connectionYear);
								for(var j = 0; j< data3Labels[i].length; j++)
								{
									var indexProx = data3Labels[i+1].indexOf(data3Labels[i][j])
									if(indexProx != -1)
									{
										
										//var connection = [j,indexProx];
										//connections[arrayKeys[i]].push(connection);
										var connection =[];
										connection.push(j);
										connection.push(indexProx);
										connections[i].push(connection);
									}
									
								}
							}
							//console.log(connections);
							
							//console.log(data3);
							//console.log(data3Labels);
							//console.log(data3Colors);
							//console.log(Object.keys(data2));
							var barWidth = (100-layout.barWidth)/200;
							var barHeight = (100-layout.barHeight)/100;
							var gutterLeft = 5;
							var gutterRight = 5;				
							if(layout.showRanks=="firstAndLast"){
								gutterLeft = 35;
								gutterRight = 35;
							}
							else if(layout.showRanks=="onlyFirst"){
								gutterLeft = 35;					
							}
							else if(layout.showRanks=="onlyLast"){
								gutterRight = 35;					
							}					
							//console.log(layout.barCurve);
							palette=createPalette(Object.keys(countries).length,{},{});	
							//console.log(palette);
											
											var bumps = new RGraph.Bar({
												id: tmpCVSID,
												data: data3,
												options: {
													labels: Object.keys(totalPeriods).reverse()/*[
														'Mondays',
														'Tuesdays',
														'Wednesdays',
														'Thursdays',
														'Fridays',
														'Saturdays',
														'Sundays'
													]*/,
													ylabels:false,
													noyaxis:true,
													ymax:yMax,
													gutterLeft:gutterLeft,
													gutterRight:gutterRight,
													gutterTop:5,
													gutterBottom:20,										
													
													backgroundGrid:false,
													//hmargin: barWidth,
													barWidth: barWidth,
													//vmargin: 15,
													colors: palette,
													colorsTemp: palette,
													grouping: 'stacked',
													marginLeft: 100,
													marginTop: 10,
													marginBottom: 250,
													marginRight: 5,
													
													//labelsAboveAngle: 45,
													//labelsAbove: true,
													colorsStroke: 'rgba(0,0,0,0)',
													dataLabels: data3Labels,
													dataColors: data3Colors,
													dataValues: data3Values,
													dataConnections: connections,
													tooltipsEvent: 'onmousemove',
													tooltips:function (idx)
													{
														//console.log(idx);
														
														return '<div></div>';//'<div id="__tooltip_div__"></div>';
															   //'s stats<br/><canvas id="__tooltip_canvas__" width="400" height="150">='
															   //'[No canvas support]</canvas>';
													},
													tooltipsCssClass:     'RGraph_tooltipNone',										
													barHeight:barHeight,
													barCurve:parseInt(layout.barCurve),
													showLinks:layout.showLinks,
													showValues:layout.showvalues,
													showLabels:layout.chartLabels,
													showOnlyFirstLast:layout.showOnlyFirstLast,
													maxItemsPerPeriod:layout.maxItemsPerPeriod,
													showRanks:layout.showRanks,
													showRankColors:layout.showRankColors
													
													//chart.data.connections
												}
											}).draw();
											
											
											bumps.canvas.onmouseout = function (e)
											{
												// Hide the tooltip
												//console.log(bumps.properties);
												bumps.properties['chart.colors']=bumps.properties['chart.colors.temp'];
												RGraph.hideTooltip();
												
												// Redraw the canvas so that any highlighting is gone
												RGraph.redraw();
											}
											
											

						}
						else{
							//To generate random numbers to allow multiple charts to present on one sheet:						
							$element.html(getHtml(messages[language].BIPARTITE_DIMENSIONMEASURE));
						}
						
						
					}
					else if(layout.polar=="waterfall"){
						
						
						
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
									
									//eventsClick: function(){//console.log('oi');}
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
					
					var palette =["RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(203,170,203)","RGB(252,252,98)","RGB(84,216,84)","RGB(47,217,47)","RGB(194,194,150)","RGB(148,182,148)","RGB(138,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(167,167,65)","RGB(196,178,214)","RGB(178,178,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)"];	
					
					

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
						//rainbow.setSpectrum('#C7DB00','E5B800','CE7800','E53D00', '#DB0029');
						rainbow.setSpectrum('#C7DB00','#FFFFFF', '#DB0029');
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
				
				if(typeof(layout.maxItemsPerPeriod) == "undefined"){
					layout.maxItemsPerPeriod=10;				

				}

				if(typeof(layout.lastPeriods) == "undefined"){
					layout.lastPeriods=5;			

				}	

				if(typeof(layout.barCurve) == "undefined"){
					layout.barCurve=20;			

				}

				if(typeof(layout.barHeight) == "undefined"){
					layout.barHeight=0.2;			

				}

				if(typeof(layout.barWidth) == "undefined"){
					layout.barWidth=20;			

				}	

				if(typeof(layout.showLinks) == "undefined"){
					layout.showLinks=false;			

				}

				if(typeof(layout.showRankColors) == "undefined"){
					layout.showRankColors=true;			

				}

				if(typeof(layout.showRanks) == "undefined"){
					layout.showRanks="firstAndLast";			

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

