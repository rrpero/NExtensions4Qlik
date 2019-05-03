function ganttChart(app,$element,layout,qMatrix,d3,viz,createPalette){

			
				var html="";
				
				// Get the Number of Dimensions and Measures on the hypercube
				var numberOfDimensions = layout.qHyperCube.qDimensionInfo.length;
				//console.log(numberOfDimensions);
				var numberOfMeasures = layout.qHyperCube.qMeasureInfo.length;
				//console.log(numberOfMeasures);
				
				// Get the Measure Name and the Dimension Name
				//var measureName = layout.qHyperCube.qMeasureInfo[0].qFallbackTitle;
				var measureName = "";
				//console.log(measureName);
				var dimensionName = layout.qHyperCube.qDimensionInfo[0].qFallbackTitle;
				var dimensionName2 = layout.qHyperCube.qDimensionInfo[1].qFallbackTitle;
				//console.log(dimensionName);
				//console.log(layout);

				
				// Get the number of fields of a dimension
				//var numberOfDimValues = layout.qHyperCube.qDataPages[0].qMatrix.length;
				var numberOfDimValues = qMatrix.length;
				//console.log(numberOfDimValues);
				
				
				
				
				//var data = {};
				var data = [];
				/*	data.push({
						id:  "Bolao",
						value: ""
					});	*/				
				var numberOfItems = numberOfDimValues;
					var newStructure ={};
				var  bolao="";
				for (var i=0; i<numberOfDimValues;i++){
					newStructure[qMatrix[i][0].qText]={};
					if(bolao!=qMatrix[i][0].qText){
						bolao = qMatrix[i][0].qText;
						
						/*
						data[qMatrix[i][0].qText]=[];
						data[qMatrix[i][0].qText].
						push({
							id:  qMatrix[i][0].qText,
							value: ""
						});*/
						//console.log(qMatrix[i][0].qText);
					}						
				
					//[qMatrix[i][1].qText]=qMatrix[i][2].qNum;
				}
				
				var newStructureDim2 ={};
				for (var i=0; i<numberOfDimValues;i++){
					newStructureDim2[qMatrix[i][1].qText]=qMatrix[i][1].qNum;
					//console.log(newStructureDim2[qMatrix[i][1].qText]);
					//[qMatrix[i][1].qText]=qMatrix[i][2].qNum;
				}		


				for(var  i  in newStructure){
					//console.log(i);
					for(var  j  in newStructureDim2){
						newStructure[i][j]=0;
					}
				}
				var chord=false;
				
				if(layout.chartType=="chord")
					chord=true;
				for (var i=0; i<numberOfDimValues;i++){
					//console.log(qMatrix[i][0].qText +  " - " + qMatrix[i][1].qText);
					newStructure[qMatrix[i][0].qText][qMatrix[i][1].qText]=qMatrix[i][2].qNum;
					//console.log(qMatrix[i][0].qText +  " - " + qMatrix[i][1].qText+' ' +qMatrix[i][2].qNum);
					//console.log(qMatrix[i][1].qText);
					//[qMatrix[i][1].qText]=qMatrix[i][2].qNum;
					//if(qMatrix[i][2].qNum<20){
						var dataLine=[];
						dataLine.push(qMatrix[i][0].qText);
						dataLine.push(qMatrix[i][1].qText);
						//dataLine.push(qMatrix[i][0].qText);
						dataLine.push(qMatrix[i][2].qNum);
						//dataLine.push(i);
						data.push(dataLine);
						//console.log(qMatrix[i][0].qText+"-"+qMatrix[i][1].qText+"-"+qMatrix[i][2].qNum);
						

							
						
						
						
						
						/*data[qMatrix[i][0].qText].
						push({
							id:  qMatrix[i][0].qText+"."+qMatrix[i][2].qNum+"-"+ qMatrix[i][1].qText,
							value: qMatrix[i][2].qNum
						});*/
					//}
				}

				var palette=null;
				
				
				
				
				
				// Get the values of the dimension
				var dimMeasArray=[];
				var dimArray =[];
				var measArrayNum =[];
				var measArrayText =[];
				var total= 0;
				/** TODO Pedir decimal e milhar do QS **/
				
				var paletteKeep = [];
				var valueBelow = "--";
				if(layout.valueBelow)
					valueBelow = "\\n";
				//console.log("num dim values " + numberOfDimValues);
				for (var i=0; i<numberOfDimValues;i++){

					//paletteKeep[i]=palette[layout.qHyperCube.qDataPages[0].qMatrix[i][0].qElemNumber];
					//paletteKeep[i]=palette[qMatrix[i][0].qElemNumber];
					//dimArray[i] = layout.qHyperCube.qDataPages[0].qMatrix[i][0].qText;
					dimArray[i] = qMatrix[i][0].qText;
					//if(dimArray[i]=="Thresh")
					//console.log("Thresh  tem elem  number "  + qMatrix[i][0].qElemNumber);
					//measArrayNum[i] = layout.qHyperCube.qDataPages[0].qMatrix[i][1].qNum;
					measArrayNum[i] = qMatrix[i][1].qNum;
					//console.log(qMatrix[i][0]);
					//console.log(qMatrix[i]);
					//measArrayText[i] = layout.qHyperCube.qDataPages[0].qMatrix[i][1].qText;
					measArrayText[i] = qMatrix[i][1].qText;
					//dimMeasArray[i] = dimArray[i] + valueBelow +measArrayText[i];
					dimMeasArray[i] = dimArray[i] + valueBelow +measArrayText[i];
					
					total=total+parseFloat(measArrayNum[i]);	
					//console.log(dimArray[i]+"-"+measArrayNum[i]);
					
				}
				
				
				
				//% to Only Values
				var measArrayPerc = [];
				//var measArrayValue = [];
				
				var dimMeasPercArray=[];
				var dimMeasPercTPArray=[];			
				
				var origin=-Math.PI/2;
				var originAcc = 0;
				for (var i=0; i<numberOfDimValues;i++){
					
					
					var measPercArray = (parseFloat(measArrayNum[i])/total)*100;
										
					measPercArray= parseFloat(measPercArray).toFixed(1);					
					measArrayPerc[i]=measPercArray + "%";
										
					dimMeasPercArray[i] = dimArray[i] +valueBelow +measPercArray + "%";
					//dimMeasPercTPArray[i] = dimensionName+'</br>' +
					//						'<div style="color:' + palette[i]+';">' + dimArray[i]+": " +measArrayText[i]+"</div>" +
					//						"Percentual: " + measPercArray + "%";
								
				}

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
				var  backgroundFixo = layout.backgroundColor.color;
				backgroundFixo="#000000";
				if(layout.advancedScroll)
					html+='<div id="canvas-wrapper-'+tmpCVSID+'" style="height: '+height+'px; width: '+width+'px; overflow: scroll;">';				
				else
					html+='<div id="canvas-wrapper-'+tmpCVSID+'" style="height: '+height+'px; width: '+width+'px; overflow: hidden;">';				


				
				
				html+='</div>';
				html+='<div id = "tag-'+tmpCVSID+'" class="tag"></div>';
//onsole.log(html);
				$element.html(html);
				
				
	
				
				 // var w = 800;
				 // var w = width*0.98;
				 // var h = 400;
				 var w = width;
				 w=w*0.98;
				 var h = height;
				 
				 if(qMatrix.length>20  && layout.advancedScroll){			 
					
					h = h+(30*(qMatrix.length-20));
					//if((height/qMatrix.length)< (h/qMatrix.length))
					//	h=height*0.98;
					//console.log("Taxa do H novo "+h/qMatrix.length);
					//console.log("Taxa do H QV "+height/qMatrix.length);
					//if(h<height)
					//	h=height;
					
					//w = w+(20*qMatrix.length);
				 }
				else{
					h=h*0.98;
					//w=w*0.98;
				}
				
				var color ={Elite:"#3366CC", Grand:"#DC3912",  Lite:"#FF9900", Medium:"#109618", Plus:"#990099", Small:"#0099C6"};
				var svg = d3.select('#canvas-wrapper-'+tmpCVSID).append("svg").attr("width", w).attr("height", h).attr("class", "svg").attr("id", "svg-"+tmpCVSID);

				


/*
				  var svg = d3.selectAll(".svg")
				  //.selectAll("svg")
				  .append("svg")
				  .attr("width", w)
				  .attr("height", h)
				  .attr("class", "svg");*/


				  
				  //console.log(qMatrix);
				  
				  var taskArray = [];
				  var maxLength =0;
				  for(var i = 0; i < qMatrix.length;i++){
					  if(qMatrix[i][3] != undefined && (qMatrix[i][0].qNum<=qMatrix[i][1].qNum)){
						  var experience = {};
						  
						  experience['startTime']=qMatrix[i][0].qText.split(".")[0];
						  //console.log(experience['startTime']);
						  
						  experience['endTime']=qMatrix[i][1].qText.split(".")[0];
						 //console.log(experience['endTime']);						  
						  experience['task']=qMatrix[i][2].qText;
						  if(maxLength < qMatrix[i][2].qText.length){
							  maxLength=qMatrix[i][2].qText.length;
							  //console.log(qMatrix[i][2].qText.length);
						  }
						  //experience['type']=qMatrix[i][0].qText.split("/")[1];
						  
						  if(qMatrix[i][3].qText != null)
							experience['type']=qMatrix[i][3].qText;
						  else
							experience['type']=""+i; 
						 

						  //experience['details']=qMatrix[i][4].qText;
						  if(qMatrix[i][4].qText != null)
							experience['details']=qMatrix[i][4].qText;
						  else
							experience['details']=""+i; 					  
						  //console.log(qMatrix[i][3].qText);
						  taskArray.push(experience);
					  }
					  
				  }
				  
					var taskArray2 = [
				  {
					task: "conceptualize",
					type: "development",
					startTime: "2013-1-28", //year/month/day
					endTime: "2013-2-1",
					details: "This actually didn't take any conceptualization"
				},

				{
					task: "sketch",
					type: "development",
					startTime: "2013-2-1",
					endTime: "2013-2-6",
					details: "No sketching either, really"
				},

				{
					task: "color profiles",
					type: "development",
					startTime: "2013-2-6",
					endTime: "2013-2-9"
				},

				{
					task: "HTML",
					type: "coding",
					startTime: "2013-2-2",
					endTime: "2013-2-6",
					details: "all three lines of it"
				},

				{
					task: "write the JS",
					type: "coding",
					startTime: "2013-2-6",
					endTime: "2013-2-9"
				},

				{
					task: "advertise",
					type: "promotion",
					startTime: "2013-2-9",
					endTime: "2013-2-12",
					details: "This counts, right?"
				},

				{
					task: "spam links",
					type: "promotion",
					startTime: "2013-2-12",
					endTime: "2013-2-14"
				},
				{
					task: "eat",
					type: "celebration",
					startTime: "2013-2-8",
					endTime: "2013-2-13",
					details: "All the things"
				},

				{
					task: "crying",
					type: "celebration",
					startTime: "2013-2-13",
					endTime: "2013-2-16"
				},

				];

				var dateFormat = d3.timeFormat("%Y-%m-%d");
				//var parseTime = d3.timeParse("%Y-%m-%d");
				//var parseTime = d3.timeParse("%m/%Y");
				//var parseTime = d3.timeParse("%Y-%m-%dT%I:%M:%S");
				//console.log(layout.spaceTasksLeft);
				var parseTime = d3.timeParse(layout.timeFormat);
				//console.log(layout.timeFormat);
				//console.log(taskArray);
				var timeScale = d3.scaleTime()
						.domain([d3.min(taskArray, function(d) {/*//console.log(parseTime(d.startTime));*/return parseTime(d.startTime);}),
								 d3.max(taskArray, function(d) {/*//console.log(parseTime(d.endTime));*/
								 if(layout.timeFormat=="%Y-%m-%dT%I:%M:%S")								 
									return  d3.timeHour.offset(parseTime(d.endTime), layout.offset);
								 else if (layout.timeFormat=="%m/%Y")
									return  d3.timeMonth.offset(parseTime(d.endTime), layout.offset);
								 return parseTime(d.endTime)
								 ;})])
						.range([0,w-(maxLength*(layout.spaceTasksLeft+0.1))]);
	

				var categories = new Array();

				for (var i = 0; i < taskArray.length; i++){
					categories.push(taskArray[i].type);
				}
				palette = createPalette(categories.length,{},{})
				

				var catsUnfiltered = categories; //for vert labels

				categories = checkUnique(categories);

				//console.log("width: " + w);
				//console.log("height: " + h);
				makeGant(taskArray, w, h);
				if(layout.title!= "" && layout.title!= null ){
				var title = svg.append("text")
							  .text(layout.title)
							  .attr("x", w/2)
							  .attr("y", 25)
							  .attr("text-anchor", "middle")
							  .attr("font-size", 18)
							  .attr("fill", "#009FFC");
				}



				function makeGant(tasks, pageWidth, pageHeight){

				var barHeight = 20;
				//console.log("Tasks: "+tasks.length);
				//console.log("Height: "+pageHeight);
				//console.log("Proporção: "+pageHeight/tasks.length);
				//console.log("Proporção: "+(pageHeight*0.67)/tasks.length);
				//console.log("Tasks Equivalente: "+tasks.length/0.67);
				
				if(layout.title!= "" && layout.title!= null ){
					if(pageHeight<500)
						barHeight = (pageHeight*(0.67*(pageHeight/500)))/(tasks.length);
					else
						barHeight = (pageHeight*(0.67*(pageHeight/pageHeight)))/(tasks.length);
				}
				else{
					if(pageHeight<500)
						barHeight = (pageHeight*(0.75*(pageHeight/500)))/(tasks.length);
					else
						barHeight = (pageHeight*(0.75*(pageHeight/pageHeight)))/(tasks.length);
				}
				//console.log(barHeight);
				var gap = barHeight + 4;
				if(layout.title!= "" && layout.title!= null ){
					var topPadding = 35;
				}
				else
					var topPadding = 05;
				//var sidePadding = 75;
				var sidePadding = maxLength*layout.spaceTasksLeft;

				var colorScale = d3.scaleLinear()
					.domain([0, categories.length])
					.range(["#00B9FA", "#F95002"])
					.interpolate(d3.interpolateHcl);

				makeGrid(sidePadding, topPadding, pageWidth, pageHeight);
				drawRects(tasks, gap, topPadding, sidePadding, barHeight, colorScale, pageWidth, pageHeight);
				vertLabels(gap, topPadding, sidePadding, barHeight, colorScale);

				}


				function drawRects(theArray, theGap, theTopPad, theSidePad, theBarHeight, theColorScale, w, h){

				
				var bigRects = svg.append("g")
					.selectAll("rect")
				   .data(theArray)
				   .enter()
				   .append("rect")
				   .attr("x", 0)
				   .attr("y", function(d, i){
					  return i*theGap + theTopPad - 2;
				  })
				   .attr("width", function(d){
					  return w
					  //-theSidePad/3
					  ;
				   })
				   .attr("height", theGap)
				   .attr("stroke", "none")
				   .attr("fill", function(d){
					for (var i = 0; i < categories.length; i++){
						if (d.type == categories[i]){
						  //return d3.rgb(theColorScale(i));
						  return d3.rgb(palette[i]);
						}
					}
				   })
				   .attr("opacity", 0.4);


					
					 var rectangles = svg.append('g')
					 .selectAll("rect")
					 .data(theArray)
					 .enter();
					 

					
				   var innerRects = rectangles.append("rect")
							 .attr("rx", 3)
							 .attr("ry", 3)
							 .attr("x", function(d){
								 d.x=timeScale(parseTime(d.startTime)) + theSidePad;
							  return timeScale(parseTime(d.startTime)) + theSidePad;
							  })
							 .attr("y", function(d, i){
								 d.y=(i*theGap + theTopPad);
								return (i*theGap + theTopPad);
							})
							 .attr("width", function(d){
								 //console.log(d.startTime+" "+d.endTime+" "+d.task)
								return (timeScale(parseTime(d.endTime))-timeScale(parseTime(d.startTime)));
							 })
							 .attr("height", theBarHeight)
							 .attr("stroke", "none")
							 .attr("fill", function(d){
							  for (var i = 0; i < categories.length; i++){
								  if (d.type == categories[i]){
									//return d3.rgb(theColorScale(i));
									return d3.rgb(palette[i]);
								  }
							  }
							 })
							 
				   
				  
						
						//var fontSize = theArray.length
						 var rectText = rectangles.append("text")
							   .text(function(d){
								return d.task;
							   })
							   .attr("x", function(d){
								return (timeScale(parseTime(d.endTime))-timeScale(parseTime(d.startTime)))/2 + timeScale(parseTime(d.startTime)) + theSidePad;
								})
							   .attr("y", function(d, i){
								  return i*theGap + (theGap/2)+ theTopPad;
							  })
							   .attr("font-size", 10)
							   .attr("font-weight", "bold")
							   .attr("text-anchor", "middle")
							   .attr("text-height", theBarHeight)
							   .attr("fill", "#000");
							   
							   
						if(layout.modeOneSticker){
							var tag = "";

							 if (theArray[0].details != undefined){
							  tag = layout.qHyperCube.qDimensionInfo[2].qFallbackTitle+": " + theArray[0].task + "<br/>" + 
									//layout.qHyperCube.qDimensionInfo[3].qFallbackTitle+": " + theArray[0].type + "<br/>" + 
									layout.qHyperCube.qDimensionInfo[0].qFallbackTitle+": " + theArray[0].startTime + " - " + 
									layout.qHyperCube.qDimensionInfo[1].qFallbackTitle+": " + theArray[0].endTime + "<br/>" + 
									layout.qHyperCube.qDimensionInfo[4].qFallbackTitle+": " + theArray[0].details;
							 } else {
							  tag = layout.qHyperCube.qDimensionInfo[2].qFallbackTitle+": " + theArray[0].task + "<br/>" + 
									//layout.qHyperCube.qDimensionInfo[3].qFallbackTitle+": " + theArray[0].type + "<br/>" + 
									layout.qHyperCube.qDimensionInfo[0].qFallbackTitle+": " + theArray[0].startTime + " - " + 
									layout.qHyperCube.qDimensionInfo[1].qFallbackTitle+": " + theArray[0].endTime + "<br/>" ;
							 }
							 //var output = document.getElementById('canvas-wrapper-'+tmpCVSID);
							 var output = document.getElementById('tag-'+tmpCVSID);

							  var x = (w/3) + "px";
							  var y = (h*0.2)+25 + "px";

							 output.innerHTML = tag;
							 output.style.top = y;
							 output.style.left = x;
							 output.style.display = "block";	
						}
						else
						{
							   
												  
							rectText.on('mouseover', function(e) {
							 //console.log(this.x.animVal.getItem(this));
							//console.log(e);
										var tag = "";
										//console.log("RECT");

									 if (d3.select(this).data()[0].details != undefined){
									  tag = layout.qHyperCube.qDimensionInfo[2].qFallbackTitle+": " + d3.select(this).data()[0].task + "<br/>" + 
											layout.qHyperCube.qDimensionInfo[3].qFallbackTitle+": " + d3.select(this).data()[0].type + "<br/>" + 
											layout.qHyperCube.qDimensionInfo[0].qFallbackTitle+": " + d3.select(this).data()[0].startTime + "<br/>" + 
											layout.qHyperCube.qDimensionInfo[1].qFallbackTitle+": " + d3.select(this).data()[0].endTime + "<br/>" + 
											layout.qHyperCube.qDimensionInfo[4].qFallbackTitle+": " + d3.select(this).data()[0].details;
									 } else {
									  tag = layout.qHyperCube.qDimensionInfo[2].qFallbackTitle+": " + d3.select(this).data()[0].task + "<br/>" + 
											layout.qHyperCube.qDimensionInfo[3].qFallbackTitle+": " + d3.select(this).data()[0].type + "<br/>" + 
											layout.qHyperCube.qDimensionInfo[0].qFallbackTitle+": " + d3.select(this).data()[0].startTime + "<br/>" + 
											layout.qHyperCube.qDimensionInfo[1].qFallbackTitle+": " + d3.select(this).data()[0].endTime + "<br/>" ;
									 }
									 //var output = document.getElementById('canvas-wrapper-'+tmpCVSID);
									 var output = document.getElementById('tag-'+tmpCVSID);

									 var tagWidth=200;
									 var tagHeight=300;
									
									

									 output.innerHTML = tag;
									 
									//console.log("Antigo X " + x);
									//console.log("Antigo Y" + e.y);									 
									 
									 //console.log(document.getElementById('svg-'+tmpCVSID).getBoundingClientRect());
									var x = d3.event.pageX - document.getElementById('svg-'+tmpCVSID).getBoundingClientRect().left + 10;
									//- document.getElementById("canvas-wrapper-"+tmpCVSID).scrollTop;
									var y = d3.event.pageY - document.getElementById('svg-'+tmpCVSID).getBoundingClientRect().top + 10
									- document.getElementById("canvas-wrapper-"+tmpCVSID).scrollTop;
									 

									 if(((x)+(tagWidth/2))>w){
										 x= (w-(tagWidth/1.5));
										 if(x<0)
											 x=0;
									 }
									 x=x+ "px";
									 
									 //console.log(y);
									 if(((y)+(tagHeight))>height){
										 y= (y-(tagHeight/1.5));
										 if(y<0)
											 y=0;
									 }	
									 //console.log(y);
									 //console.log(height);
									 //console.log(h);
									 
									 
									y=y+ "px";
									 
									//console.log("Novo X " + x);
									//console.log("Novo Y" + y);
									 output.style.top = y;
									 output.style.left = x;									 
									 //output.style.top = (e.y+theBarHeight)+"px";
									 //output.style.left = x;
									 
									 output.style.width = tagWidth+"px";
									 output.style.width = tagHeight+"px";
									 output.style.display = "block";
									 var content = window.getComputedStyle(
										document.querySelector('.tag'), ':before'
									)
							 
								   }).on('mouseout', function() {
									 var output = document.getElementById('tag-'+tmpCVSID);
									 output.style.display = "none";
										 });


							innerRects.on('mouseover', function(e) {
							 //console.log(e);
									//console.log("INNER  RECTs");
									 var tag = "";

									 if (d3.select(this).data()[0].details != undefined){
									  tag = layout.qHyperCube.qDimensionInfo[2].qFallbackTitle+": " + d3.select(this).data()[0].task + "<br/>" + 
											layout.qHyperCube.qDimensionInfo[3].qFallbackTitle+": " + d3.select(this).data()[0].type + "<br/>" + 
											layout.qHyperCube.qDimensionInfo[0].qFallbackTitle+": " + d3.select(this).data()[0].startTime + "<br/>" + 
											layout.qHyperCube.qDimensionInfo[1].qFallbackTitle+": " + d3.select(this).data()[0].endTime + "<br/>" + 
											layout.qHyperCube.qDimensionInfo[4].qFallbackTitle+": " + d3.select(this).data()[0].details;
									 } else {
									  tag = layout.qHyperCube.qDimensionInfo[2].qFallbackTitle+": " + d3.select(this).data()[0].task + "<br/>" + 
											layout.qHyperCube.qDimensionInfo[3].qFallbackTitle+": " + d3.select(this).data()[0].type + "<br/>" + 
											layout.qHyperCube.qDimensionInfo[0].qFallbackTitle+": " + d3.select(this).data()[0].startTime + "<br/>" + 
											layout.qHyperCube.qDimensionInfo[1].qFallbackTitle+": " + d3.select(this).data()[0].endTime + "<br/>";
									 }
									 var output = document.getElementById('tag-'+tmpCVSID);
									 var tagWidth=200;
									
									
									 //var x = (this.x.animVal.value + this.width.animVal.value/2) + "px";
									 var y = this.y.animVal.value + 25 + "px";
									 //var x = (this.x.animVal.value) + "px";
									 x=e.x+ "px";
									 if(((e.x)+(tagWidth/2))>w){
										 x= (w-(tagWidth/1.5))+ "px";
										 if(x<0)
											 x=0+ "px";
									 }

									 output.innerHTML = tag;
									 //output.style.top = y;
									 //output.style.left = x;
									 
									 output.style.top = (e.y+theBarHeight)+"px";
									 output.style.left = x;
									 
									 output.style.width = tagWidth+"px";
									 output.style.display = "block";
									 var content = window.getComputedStyle(
										document.querySelector('.tag'), ':before'
									)
									//.getPropertyValue('left');
									//console.log(content);
									 //console.log(output);
									 

									 //console.log(x);
									 //console.log(w);
									 
								
									
									
									 
									 
									 
								   }).on('mouseout', function() {
									 var output = document.getElementById('tag-'+tmpCVSID);
									 output.style.display = "none";

							 });
						}



				}


				function makeGrid(theSidePad, theTopPad, w, h){
				//d3.
				var xAxis = d3
					//.scale(timeScale)
					.axisBottom(timeScale)
					//.orient('bottom')
					.ticks(layout.ticks)
					//.ticks(d3.timeDay.every(1))
					//.ticks(d3.timeMinute.every(5))
					.tickSize(-h+theTopPad+100, 0, 0)
					//.tickFormat(d3.timeFormat("%Y-%m"));
					//.tickFormat(d3.timeFormat("%Y-%m-%dT%I:%M:%S"));
					.tickFormat(d3.timeFormat(layout.timeFormat))

							;
					
					
				
				//console.log(timeScale);
				
				var grid = svg.append('g')
					.attr('class', 'grid')
					.attr('transform', 'translate(' +theSidePad + ', ' + (h - 100) + ')')
					.call(xAxis)
			
					.selectAll("text")  
							.style("text-anchor", "middle")
							.attr("fill", "#000")
							.attr("stroke",// "none"
							
							function(d){
								//console.log(d);
								var today = new Date();
								if(d.getFullYear()==today.getFullYear()   && d.getMonth()==today.getMonth()&& d.getDate()==today.getDate())
									return "red";
								return "gray";
							}
							)
							.attr("font-size", 10)
							.attr("dy", "1em")
							.attr('transform', 'translate(-40, 35) rotate(-45)')

							//.attr("transform", "rotate(-45)")
							;
							
							
					svg.selectAll(".tick line").attr("stroke", function(d){
								//
								//console.log(today.getDay() +" "  + today.getMonth()+" "  + today.getYear());
								//console.log(d);
								//console.log(d.getDate() +" "  + d.getMonth()+" "  + d.getFullYear());
								//console.log(new Date().getMonth());
								var today = new Date();
								if(d.getFullYear()==today.getFullYear()   && d.getMonth()==today.getMonth()&& d.getDate()==today.getDate())
									return "red";
								
								//if(today.getDay() ==  d.getDay() && today.getMonth() ==  d.getMonth() && today.getYear() ==  d.getYear())
								//	return "red";
								return "gray";
								//console.log(Date());
								//console.log(d.getMonth());
								
							});
					/*grid					.selectAll("line")
							.attr("stroke",// "none"
							
							function(d){
								//console.log(d);
								return "red";
							}
							)*/
				}

				function vertLabels(theGap, theTopPad, theSidePad, theBarHeight, theColorScale){
				  var numOccurances = new Array();
				  var prevGap = 0;

				  for (var i = 0; i < categories.length; i++){
					numOccurances[i] = [categories[i], getCount(categories[i], catsUnfiltered)];
				  }

				  var axisText = svg.append("g") //without doing this, impossible to put grid lines behind text
				   .selectAll("text")
				   .data(numOccurances)
				   .enter()
				   .append("text")
				   .text(function(d){
					return d[0];
				   })
				   .attr("x", 10)
				   .attr("y", function(d, i){
					if (i > 0){
						for (var j = 0; j < i; j++){
						  prevGap += numOccurances[i-1][1];
						 //console.log(prevGap);
						  return d[1]*theGap/2 + prevGap*theGap + theTopPad;
						}
					} else{
					return d[1]*theGap/2 + theTopPad;
					}
				   })
				   .attr("font-size", 11)
				   .attr("text-anchor", "start")
				   .attr("text-height", 14)
				   .attr("fill", function(d){
					for (var i = 0; i < categories.length; i++){
						if (d[0] == categories[i]){
						//console.log("true!");
						  //return d3.rgb(theColorScale(i)).darker();
						  return d3.rgb(palette[i]).darker();
						}
					}
				   });

				}

				//from this stackexchange question: http://stackoverflow.com/questions/1890203/unique-for-arrays-in-javascript
				function checkUnique(arr) {
					var hash = {}, result = [];
					for ( var i = 0, l = arr.length; i < l; ++i ) {
						if ( !hash.hasOwnProperty(arr[i]) ) { //it works with objects! in FF, at least
							hash[ arr[i] ] = true;
							result.push(arr[i]);
						}
					}
					return result;
				}

				//from this stackexchange question: http://stackoverflow.com/questions/14227981/count-how-many-strings-in-an-array-have-duplicates-in-the-same-array
				function getCounts(arr) {
					var i = arr.length, // var to loop over
						obj = {}; // obj to store results
					while (i) obj[arr[--i]] = (obj[arr[i]] || 0) + 1; // count occurrences
					return obj;
				}

				// get specific from everything
				function getCount(word, arr) {
					return getCounts(arr)[word] || 0;
				}
				
				
				

				function mouseover(d){
					[0
					//,1
					].forEach(function(i){
						//console.log(i);
						//console.log(d);
						bp[i].mouseover(d);
						//console.log("ola");
						g[i].selectAll(".viz-biPartite-mainBar").select(".cima")
						.text(function(d){ return d.key/*d3.format("0.0%")(d.percent)*/});
						g[i].selectAll(".viz-biPartite-mainBar").select(".baixo")
						.text(function(d){ return /*d.value*/d3.format("0.0%")(d.percent)});						
					});
				}
				function mouseout(d){
					[0
					//,1c
					].forEach(function(i){
						bp[i].mouseout(d);
						
						g[i].selectAll(".viz-biPartite-mainBar").select(".cima")
						.text(function(d){ return d.key/*d3.format("0.0%")(d.percent)*/});
						g[i].selectAll(".viz-biPartite-mainBar").select(".baixo")
						.text(function(d){ return /*d.value*/d3.format("0.0%")(d.percent)});						
					});
				}
				
				function onClick(d){
					//console.log(d);
					//console.log(layout.qHyperCube.qDimensionInfo[0].qGroupFieldDefs[0]);
					if(d.part=="primary"){
						//console.log(layout.qHyperCube.qDimensionInfo[0].qGroupFieldDefs[0]);
						app.field(layout.qHyperCube.qDimensionInfo[0].qGroupFieldDefs[0]).toggleSelect(d.key, true);
					}
					else{
						//console.log(layout.qHyperCube.qDimensionInfo[1]);
						app.field(layout.qHyperCube.qDimensionInfo[1].qGroupFieldDefs[0]).toggleSelect(d.key, true);
					}
				}


}