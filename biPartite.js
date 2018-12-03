function biPartite(app,$element,layout,qMatrix,d3,viz){

			
				var html="";
				
				// Get the Number of Dimensions and Measures on the hypercube
				var numberOfDimensions = layout.qHyperCube.qDimensionInfo.length;
				//console.log(numberOfDimensions);
				var numberOfMeasures = layout.qHyperCube.qMeasureInfo.length;
				//console.log(numberOfMeasures);
				
				// Get the Measure Name and the Dimension Name
				var measureName = layout.qHyperCube.qMeasureInfo[0].qFallbackTitle;
				//console.log(measureName);
				var dimensionName = layout.qHyperCube.qDimensionInfo[0].qFallbackTitle;
				var dimensionName2 = layout.qHyperCube.qDimensionInfo[1].qFallbackTitle;
				//console.log(dimensionName);

				
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
						
						if(chord){
							var dataLine2=[];
							dataLine2.push(qMatrix[i][1].qText);
							dataLine2.push(qMatrix[i][0].qText);
							//dataLine.push(qMatrix[i][0].qText);
							dataLine2.push(qMatrix[i][2].qNum);
							data.push(dataLine2);
							//console.log(qMatrix[i][1].qText+"-"+qMatrix[i][0].qText+"-"+qMatrix[i][2].qNum);							
						}	
							
						
						
						
						
						/*data[qMatrix[i][0].qText].
						push({
							id:  qMatrix[i][0].qText+"."+qMatrix[i][2].qNum+"-"+ qMatrix[i][1].qText,
							value: qMatrix[i][2].qNum
						});*/
					//}
				}


				
				
				
				
				
				// Get the values of the dimension
				var dimMeasArray=[];
				var dimArray =[];
				var measArrayNum =[];
				var measArrayText =[];
				var total= 0;
				var palette =["RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)"];	
				
				var rainbow = new Rainbow(); 
				rainbow.setNumberRange(1, numberOfItems+1);
				
				
				function  getPalette(rainbowP){
					var s = [];
					for (var i = 1; i <= numberOfItems; i++) {
						var hexColour = rainbowP.colourAt(i);
						s[i]= '#' + hexColour;
					}
					return  s;
				}
				
				function  getPaletteNI(rainbowP,nItems){
					var s = [];
					for (var i = 1; i <= nItems; i++) {
						var hexColour = rainbowP.colourAt(i);
						s[i]= '#' + hexColour;
					}
					return  s;
				}				
				
				function  getPalette3(rainbowP){
					var s = [];
					for (var i = 1; i <= 3; i++) {
						var hexColour = rainbowP.colourAt(i);
						s[i]= '#' + hexColour;
					}
					return  s;
				}				
				
				//rainbow.setSpectrum('#662506', '#993404', '#cc4c02', '#ec7014', '#fb9a29', '#fec44f','#FEE391');
				//azul2
				//rainbow.setSpectrum('#09304E', '#203B4E', '#11609B')
				//azul1
				//rainbow.setSpectrum('#FFFFFF','#11609B');
				//azul-marrom				
				//rainbow.setSpectrum('#02089B', '#353768', '#177FCE', '#D48B4D', '#9B3202');
				//analogas 1
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
				if(layout.palette=="france"){
					//rainbow.setSpectrum('#002395','#FFFFFF','#ED2939');	
					rainbow.setSpectrum('#002395','#DEDEDE','#FF0000');					
					palette=getPalette(rainbow);
				}	
				if(layout.palette=="belgium"){
					rainbow.setSpectrum('#000000','#FAE042','#ED2939');					
					palette=getPalette(rainbow);
				}
				if(layout.palette=="england"){
					//rainbow.setSpectrum('#002395','#FFFFFF','#ED2939');	
					rainbow.setSpectrum('#DEDEDE','#FF0000','#DEDEDE');					
					palette=getPalette(rainbow);
				}				
				if(layout.palette=="colored"){
					//rainbow.setSpectrum('#D7FFF0','#90E8E8','#34B9FF','#0047E8','#0B00FF');					
					palette=getPalette(rainbow);
				}	



				


				
				var	paletteBlue=["#051D5C","#0F2662","#193068","#23396E","#2D4374","#374C7A","#415680","#4C5F86","#56698C","#607292","#6A7C98","#74859E","#7E8FA4","#8998AA","#93A2B0","#9DABB6","#A7B5BC","#B1BEC2","#BBC8C8","#C5D2CF"];
				var paletteGreen=["#034502","#0D4C0C","#185316","#225B20","#2D622B","#376A35","#42713F","#4C784A","#578054","#61875E","#6C8F69","#769673","#819E7D","#8BA588","#96AC92","#A0B49C","#ABBBA7","#B5C3B1","#C0CABB","#CBD2C6"];
				var paletteRed=["#940005","#97090D","#9B1216","#9F1C1F","#A32528","#A62E31","#AA383A","#AE4142","#B24A4B","#B65454","#B95D5D","#BD6766","#C1706F","#C57977","#C98380","#CC8C89","#D09592","#D49F9B","#D8A8A4","#DCB2AD"];
				
				var paletteYellowWhite =["#ffc22b","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)"];
				
				var paletteWhiteYellow =["rgba(0,0,0,0)","#ffc22b","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)"];

				var paletteBlueWhite =["RGB(141,170,203)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)"];			
				var paletteWhiteBlue =["rgba(0,0,0,0)","RGB(141,170,203)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)"];
				
				var paletteRedWhite =["RGB(252,115,98)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)"];
				
				
				var paletteWhiteRed =["rgba(0,0,0,0)","RGB(252,115,98)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)"];			
				
				if(numberOfDimValues<=6){
					paletteBlue=["#051D5C","#2D4374","#56698C","#7E8FA4","#A7B5BC","#C5D2CF"];
					paletteGreen=["#034502","#2D622B","#578054","#819E7D","#ABBBA7","#CBD2C6"];
					paletteRed=["#940005","#A32528","#B24A4B","#C1706F","#D09592","#DCB2AD"];				
				}
				else if(numberOfDimValues<=10){
					paletteBlue=["#051D5C","#193068","#2D4374","#415680","#56698C","#6A7C98","#7E8FA4","#93A2B0","#A7B5BC","#BBC8C8"];
					paletteGreen=["#034502","#185316","#2D622B","#42713F","#578054","#6C8F69","#819E7D","#96AC92","#ABBBA7","#C0CABB"];
					paletteRed=["#940005","#9B1216","#A32528","#AA383A","#B24A4B","#B95D5D","#C1706F","#C98380","#D09592","#D8A8A4"];				
				}
				
				var paletteBG=
				[
				'Gradient(white:RGB(141,170,203))',
						'Gradient(white:#ff0:#aa0:#660)', 'Gradient(white:#f00:#a00:#600)',
						'Gradient(white:#0ff:#0aa:#066)', 'Gradient(white:#0f0:#0a0:#060)',
						'Gradient(white:#fff:#aaa:#666)', 'Gradient(white:#f0f:#a0a:#606)',
						'Gradient(white:#ff0:#aa0:#660)','Gradient(white:#f00:#a00:#600)',
						'Gradient(white:#0ff:#0aa:#066)','Gradient(white:#0f0:#0a0:#060)',
						'Gradient(white:#fff:#aaa:#666)', 'Gradient(white:#f0f:#a0a:#606)',
						'Gradient(white:#fff:#aaa:#666)'			];
						
				//palette=paletteBG;
				if(layout.palette=="default")
					palette=palette;
				else if(layout.palette=="bluegradient")
					palette=paletteBlue;
				else if(layout.palette=="redgradient")
					palette=paletteRed;
				else if(layout.palette=="greengradient")
					palette=paletteGreen;
				else if(layout.palette=="paletteBG")
					palette=paletteBG;			
				else if(layout.palette=="yellowwhite")
					palette=paletteYellowWhite;	
				else if(layout.palette=="whiteyellow")
					palette=paletteWhiteYellow;				
				else if(layout.palette=="redwhite")
					palette=paletteRedWhite;	
				else if(layout.palette=="whitered")
					palette=paletteWhiteRed;	
				else if(layout.palette=="bluewhite")
					palette=paletteBlueWhite;	
				else if(layout.palette=="whiteblue")
					palette=paletteWhiteBlue;		
				
				/** TODO Pedir decimal e milhar do QS **/
				
				var paletteKeep = [];
				var valueBelow = "--";
				if(layout.valueBelow)
					valueBelow = "\\n";
				//console.log("num dim values " + numberOfDimValues);
				for (var i=0; i<numberOfDimValues;i++){

					//paletteKeep[i]=palette[layout.qHyperCube.qDataPages[0].qMatrix[i][0].qElemNumber];
					paletteKeep[i]=palette[qMatrix[i][0].qElemNumber];
					//dimArray[i] = layout.qHyperCube.qDataPages[0].qMatrix[i][0].qText;
					dimArray[i] = qMatrix[i][0].qText;
					//if(dimArray[i]=="Thresh")
					//	console.log("Thresh  tem elem  number "  + qMatrix[i][0].qElemNumber);
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
					dimMeasPercTPArray[i] = dimensionName+'</br>' +
											'<div style="color:' + palette[i]+';">' + dimArray[i]+": " +measArrayText[i]+"</div>" +
											"Percentual: " + measPercArray + "%";
								
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
				html+='<div id="canvas-wrapper-'+tmpCVSID+'">';				

				
				if(chord){
					height=height*0.9;
					width=width*0.9;
				}
				
				//for many  columns
				var i=0;				
				if(false){
					for(var data2 in data){
						if(i%2==0)
							html+='<div style="float:left;" id="canvas-wrapper-'+tmpCVSID+data2+'"></div>';
						else
							html+='<div style="float:right;" id="canvas-wrapper-'+tmpCVSID+data2+'"></div>';
						i++;
					}
				}
				html+='</div>';
//onsole.log(html);
				$element.html(html);
				
				
				if(chord){
					var nItems=(Object.keys(newStructure).length+ Object.keys(newStructureDim2).length)+2;
					rainbow.setNumberRange(1, (Object.keys(newStructure).length+ Object.keys(newStructureDim2).length)+2);
					palette=getPaletteNI(rainbow,nItems);
				}
				else{
					var range=0;
					if(Object.keys(newStructure).length>1)
						range=1;
					var nItems=(Object.keys(newStructure).length+0);
					rainbow.setNumberRange(range, (Object.keys(newStructure).length)+0);
					palette=getPaletteNI(rainbow,nItems);
				}
				
								
				
				var paletteNS={};
				var i=1;
				for(var j in newStructure)
				{
					//console.log(j +" " +i);
					paletteNS[j]=palette[i];
					i++;
					
				}
				
				if(chord){
					for(var j in newStructureDim2)
					{
						//console.log(j +" " +i + " " + palette[i]);
						paletteNS[j]=palette[i];
						i++;
						
					}					
					
				}
				
				
				
				var color ={Elite:"#3366CC", Grand:"#DC3912",  Lite:"#FF9900", Medium:"#109618", Plus:"#990099", Small:"#0099C6"};
				var svg = d3.select('#canvas-wrapper-'+tmpCVSID).append("svg").attr("width", width).attr("height", height);

				//svg.append("text").attr("x",250).attr("y",70)
				//	.attr("class","header").text("Sales Attempt");
					
				//svg.append("text").attr("x",750).attr("y",70)
				//	.attr("class","header").text("Sales");
				function sort(){
				  var sortOrder = Object.keys(newStructure);
				  return function(a,b){ return d3.ascending(sortOrder.indexOf(a),sortOrder.indexOf(b)) }
				}
				if(chord){
				var chord2 = viz().chord()
					.data(data)
					//.label(function(d){ return d.source+" ("+d3.format(",")(d.value/1000)+")"})
					.label(function(d){ return d.source+" ("+d.value+")"})
					//.fill(d=>paletteNS[d])
					.fill(function(d){ return paletteNS[d]})
					.sort(sort())
				}
				//	.height(height*0.8)
				//	.width(width*0.6)
				//	.pad(1)
				//var chord = false;
				
				var orient =  "vertical";
				if(layout.orient=="horizontal")
					orient="horizontal";
				if(!chord){
					if(orient=="vertical")						
						var g =[svg.append("g").attr("transform","translate("+(90+layout.gutterLeft)+","+(50+layout.gutterTop)+")")
									//,svg.append("g").attr("transform","translate(650,100)")
									];
					else
						var g =[svg.append("g").attr("transform","translate("+(60+layout.gutterLeft)+","+(20+layout.gutterTop)+")")
									//,svg.append("g").attr("transform","translate(650,100)")
									];
				}
				else
					var g =[svg.append("g").attr("transform","translate("+(300+layout.gutterLeft)+","+(250+layout.gutterTop)+")")
								//,svg.append("g").attr("transform","translate(650,100)")
								];	
				
				if(!chord){
					var edgeMode = "curved";
					
					var fWidth = layout.width/10;
					var fHeight = layout.height/10;
					
					
					
					if(layout.edgeMode=="straight")
						edgeMode="straight";
					if(orient=="vertical"){
						var bpWidth=width*fWidth;
						var bpHeight=height*fHeight;
						var  barSize=0.12*width ;
					}
					else{
						fWidth=fWidth+0.1;
						var bpWidth=width*fWidth;
						var bpHeight=height*fHeight;
						var barSize=0.12*height;
					}
					
					barSize=barSize+(layout.barSize*0.01*barSize);
					
					
					var bp=[ viz().biPartite()
							.data(data)
							.min(12)
							.pad(layout.pad)
							.height(bpHeight)
							//.width(width*0.6)
							//.width(bpWidth)
							.width(bpWidth)
							//.barSize(0.04*width)  //only value?
							.barSize(barSize)
							//.fill(d=>paletteNS[d.primary])
							.fill(function(d){ return paletteNS[d.primary]})
							.sortPrimary(sort())
							.duration(1000)
							.edgeOpacity(.6)
							//.edgeMode("straight")
							.edgeMode(edgeMode)
							.orient(orient)
							//.orient("vertical")
					
						/*,viz.biPartite()
							.data(data)
							.value(d=>d[3])
							.min(12)
							.pad(1)
							.height(600)
							.width(200)
							.barSize(35)
							.fill(d=>color[d.primary])*/
					];
							
					[0].forEach(function(i){
						g[i].call(bp[i])
						var labelSize = 5+Math.floor((layout.labelTextSize/8));
						//layout.labelTextSize=5+Math.floor((layout.labelTextSize/8));
						var fontLabel = (labelSize+2) + "px QlikView Sans";
						if(orient=="vertical"){
							g[i].append("text").attr("x",width*0.05).attr("y",-8).style("text-anchor","middle").style("font",fontLabel).style("font-weight",layout.bold).text(dimensionName);
							g[i].append("text").attr("x", (bpWidth*0.92)).attr("y",-8).style("text-anchor","middle").style("font",fontLabel).style("font-weight",layout.bold).text(dimensionName2);
						}
						
						//g[i].append("line").attr("x1",-100).attr("x2",0);
						//g[i].append("line").attr("x1",200).attr("x2",300);
						
						//g[i].append("line").attr("y1",610).attr("y2",610).attr("x1",-100).attr("x2",0);
						//g[i].append("line").attr("y1",610).attr("y2",610).attr("x1",200).attr("x2",300);
						
						g[i].selectAll(".viz-biPartite-mainBar")
							.on("mouseover",mouseover)
							.on("mouseout",mouseout)
							.on("click",onClick);

						/*g[i].selectAll(".viz-biPartite-mainBar").append("text").attr("class","label")
							.attr("x",d=>(d.part=="primary"? -30: 30))
							.attr("y",d=>+6)
							.text(d=>d.key)
							.attr("text-anchor",d=>(d.part=="primary"? "end": "start"));*/
						fontLabel = labelSize + "px QlikView Sans";
						
						
						if(layout.labelIn=="in"){
						//if(true){
							//var yUp=-(bpWidth*0.01)-(labelSize*0.15);
							//var yDown=(bpWidth*0.01)+(labelSize*0.15);	
							var yUp=(labelSize/3)-(labelSize*0.5);
							var yDown=(labelSize/3)+(labelSize*0.5);								
							if(orient=="horizontal"){
								var yUp=-10 + (bpHeight*0.01);
								var yDown=10+(bpHeight*0.01);
							}
							//console.log(yUp);
							//console.log(bpHeight*0.01);
							var xUpL=0;
							var xUpR=0;
							
							var fatorAfastamentoL = 0,fatorAfastamentoR=0;
						}
						else{
							var yUp=6;
							var xUpL=(barSize/2)+10;
							var xUpR=(barSize/2)+10;
							//var xUpR=barSize*1.2;
							var yDown=6;
							var fatorAfastamentoL = layout.spaceLabelLeft*(labelSize);
							var fatorAfastamentoR = layout.spaceLabelRight*(labelSize);
							if(orient=="horizontal"){
								yUp=yUp-fatorAfastamentoL;
								yDown=yDown+fatorAfastamentoR;
								fatorAfastamentoL=0;
								fatorAfastamentoR=0;
							}
						}
						
						//-(d.key.length*(labelSize/2))
						
						if(true){
							g[i].selectAll(".viz-biPartite-mainBar").append("text").attr("class","perc cima")
								//.attr("x",d=>(d.part=="primary"? -100: 80))
								//.attr("y",d=>+6)
								.attr("y",function(d){return yUp})
								.attr("x",function(d){  return (d.part=="primary"? -xUpL-fatorAfastamentoL: xUpR+fatorAfastamentoR)})
								.text(function(d){ return d.key/*d3.format("0.0%")(d.percent)*/}).style("font",fontLabel).style("font-weight",layout.bold)
								.style("fill",layout.fontColor.color)
								//.attr("text-anchor",d=>(d.part=="primary"? "end": "start"));
								.attr("text-anchor",function(d){return (d.part=="primary"? "end": "start")});
							g[i].selectAll(".viz-biPartite-mainBar").append("text").attr("class","perc baixo")
								//.attr("x",d=>(d.part=="primary"? -100: 80))
								//.attr("y",d=>+6)
								.attr("y",function(d){return yDown})
								//.attr("x",function(d){return (d.part=="primary"? -xUp: xUp)})
								.text(function(d){ return /*d.value*/d3.format("0.0%")(d.percent)}).style("font",fontLabel).style("font-weight",layout.bold)
								.style("fill",layout.fontColor.color)
								//.attr("text-anchor",d=>(d.part=="primary"? "end": "start"));
								.attr("text-anchor",function(d){return (d.part=="primary"? "end": "start")});
						}
						else
						{
							g[i].selectAll(".viz-biPartite-mainBar").append("text").attr("class","perc cima")
								.attr("y",function(d){return yUp})
								.attr("x",function(d){  return (d.part=="primary"? -xUpL-fatorAfastamentoL: xUpR+fatorAfastamentoR)})
								.text(function(d){ return (d.part=="primary"? d.key:d.value)/*d3.format("0.0%")(d.percent)*/}).style("font",fontLabel).style("font-weight",layout.bold)
								.style("fill",layout.fontColor.color)
								.attr("text-anchor",function(d){return (d.part=="primary"? "end": "start")});
							g[i].selectAll(".viz-biPartite-mainBar").append("text").attr("class","perc baixo")
								.attr("y",function(d){return yDown})
								.text(function(d){ return (d.part=="primary"? d.value:d.key)/*d3.format("0.0%")(d.percent)*/}).style("font",fontLabel).style("font-weight",layout.bold)
								.style("fill",layout.fontColor.color)
								.attr("text-anchor",function(d){return (d.part=="primary"? "end": "start")});		
						}
						
							
					});
				}
				else{
					
					g[0].call(chord2);
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
					//,1
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