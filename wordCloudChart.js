function wordCloudChart(app,$element,layout,qMatrix,d3,cloud){
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
				//console.log(dimensionName);

				
				// Get the number of fields of a dimension
				//var numberOfDimValues = layout.qHyperCube.qDataPages[0].qMatrix.length;
				var numberOfDimValues = qMatrix.length;
				//console.log(numberOfDimValues);
				
				
				var numberOfItems = numberOfDimValues;


				
				
				
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
				html+='<div style="background-color: '+ layout.backgroundColor.color +';" id="canvas-wrapper-'+tmpCVSID+'"></div>';
//onsole.log(html);
				$element.html(html);
				
				var min = Math.min.apply(null, measArrayNum),
				max = Math.max.apply(null, measArrayNum);
				
				var diffMaxMin = max - min;
				
				//if(diffMaxMin/max < 0.3)
				//	var fator =  1
				//else if(diffMaxMin/max < 0.6)
				//else
				
				//console.log(diffMaxMin/measArrayNum.length);
				//console.log(measArrayNum.length);

				
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

					
				/*console.log(dimArray.map(function(d,i) {
					  return {text: d, size: 10+measArrayNum[i], test: "haha"};
					}));*/
				var padding=3;
				if(layout.border)
					padding=padding+1;
				var font="QlikView Sans";
				var layout2 = cloud()
					.size([width, height])
					.words(dimArray.map(function(d,i) {


					  var fontSize =  layout.minTextSize + ((measArrayNum[i]/total)*tamanho);
					  
					  
					  if(fontMax>tamanho2)
						fontSize=(tamanho2*fontSize)/fontMax;
					  //if(d=="Riven")
						  //console.log("Font  " + fontSize+ " " + measArrayNum[i] + " " +total)		;
					  if(fontSize>100)
						  fontSize=100;
					  //var fontSize=10+((measArrayNum[i]-min)/2);
					  //fontSize=(fontSize/1120)*width
					  //console.log(10+((measArrayNum[i]-min)/2));
					  //console.log(fontSize);
					  var keepS=qMatrix[i][0].qElemNumber;
					  keepS=i+1;
					  return {text: capitalize(d.replace("Suporte ","").replace("Fiscais","").toLowerCase()), size: fontSize, test: "haha",keepColor:keepS};
					}))
					.padding(padding)
					//.rotate(function() { return ~~(Math.random() * 2) * 90; })
					//.rotate(function() { return (~~(Math.random() * 7) * 15)+(~~(Math.random() * 2)*270); })
					.rotate(function(d) { 
					
					
					if(layout.rotateType=="random2")
						return ~~(Math.random() * 2) * 90;
					else if(layout.rotateType=="random7")
						return (~~(Math.random() * 7) * 15)+(~~(Math.random() * 2)*270);
					else if(layout.rotateType=="fixed1")
						return (~~(((hashCode(d.text)%100)/100) * 1) * 90);//+(~~(((hashCode(d.text)%100)/100) * 2)*270);
					else if(layout.rotateType=="fixed2")
						return (~~(((hashCode(d.text)%100)/100) * 2) * 90);//+(~~(((hashCode(d.text)%100)/100) * 2)*270);
					else if(layout.rotateType=="fixed3")
						return (~~(((hashCode(d.text)%100)/100) * 3) * 45)+(~~(((hashCode(d.text)%100)/100) * 2)*270);
					else if(layout.rotateType=="fixed4")
						return (~~(((hashCode(d.text)%100)/100) * 4) * 30)+(~~(((hashCode(d.text)%100)/100) * 2)*270);
					else if(layout.rotateType=="fixed5")
						return (~~(((hashCode(d.text)%100)/100) * 5) * 22.5)+(~~(((hashCode(d.text)%100)/100) * 2)*270);
					//else if(layout.rotateType=="fixed6")
					else if(layout.rotateType=="fixed7")
						return (~~(((hashCode(d.text)%100)/100) * 7) * 15)+(~~(((hashCode(d.text)%100)/100) * 2)*270);

					//console.log(~~(((hashCode(d.text)%100)/100) * 3));
					//todos deitados
					//return (~~(((hashCode(d.text)%100)/100) * 1) * 90);})//+(~~(((hashCode(d.text)%100)/100) * 2)*270); })
					
					//normal
					return (~~(((hashCode(d.text)%100)/100) * 2) * 90);})//+(~~(((hashCode(d.text)%100)/100) * 2)*270); })
					
					//return (~~(((hashCode(d.text)%100)/100) * 3) * 45)+(~~(((hashCode(d.text)%100)/100) * 2)*270); })
					//return (~~(((hashCode(d.text)%100)/100) * 4) * 30)+(~~(((hashCode(d.text)%100)/100) * 2)*270); })
					//return (~~(((hashCode(d.text)%100)/100) * 5) * 22.5)+(~~(((hashCode(d.text)%100)/100) * 2)*270); })
					//return (~~(((hashCode(d.text)%100)/100) * 7) * 15)+(~~(((hashCode(d.text)%100)/100) * 2)*270); })
					//.font("QlikView Sans")
					.font(font)
					.fontSize(function(d) { return d.size; })
					.on("end", draw);

				layout2.start();

				
				
				function shadow(stroke,color){
					if(layout.border && navigator.userAgent.indexOf("Chrome")!=-1){ 
						var shadow="";
						for(var i=stroke*-1; i<=stroke;i++){
							for(var j=stroke*-1;j<=stroke;j++){
								if(i==stroke && j==stroke)
									shadow=shadow+ i + "px " + j + "px 0 "+color+ "";
								else
									shadow=shadow+ i + "px " + j + "px 0 "+color+ ",";
							}
						}
						//console.log(shadow);
						return shadow;
					}
					return 0;
				}
				
				/*function shadowIE(stroke,color){
					if(layout.border){
						return "progid:DXImageTransform.Microsoft.Shadow(color=#0000FF,direction=45)";
					}
					return 0;
				}*/				
				
				
//				console.log(navigator.userAgent);
//Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36
//QS Browser--  Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.16 Safari/537.36 USC/1.0
//Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; rv:11.0) like Gecko
				function draw(words) {
					
				/*@function stroke($stroke, $color) {
				  $shadow: ();
				  $from: $stroke*-1;
				  @for $i from $from through $stroke {
				   @for $j from $from through $stroke {
					  $shadow: append($shadow, $i*1px $j*1px 0 $color, comma);
					}
				  }
				  @return $shadow;
				}	*/


					
				  var svg = d3.select("#canvas-wrapper-"+tmpCVSID).append("svg")
				  
				  // <filter id="dropShadow">
				  var filter = svg.append('defs').append("filter").attr("id", "dropShadow1");
				var  ids=0;
				filter.append("feFlood").attr("flood-color","black").attr("result","flood");
				//<feFlood flood-color="white" result="flood"/>
				 for(var i=-1;i<=1;i++){
						for(var j=-1;j<=1;j++){
							filter.append("feOffset").attr("dx",""+i).attr("dy",""+j).attr("in","SourceAlpha").attr("result","offset"+ids);
							  //<feComposite operator="in" in="flood" in2="offset1" result="shadow1"/>
							filter.append("feComposite").attr("operator","in").attr("in","flood").attr("in2","offset"+ids).attr("result","shadow"+ids);
							
							ids++;

						}							
					 
				 }
				 ids=0;
				 var  feMerge = filter.append("feMerge")	;
				 for(var i=-1;i<=1;i++){
						for(var j=-1;j<=1;j++){

							feMerge.append("feMergeNode").attr("in","shadow"+ids);
							ids++;
							
						}
				 }						
				feMerge.append("feMergeNode").attr("in","SourceGraphic");
				  
 
 
 				var filter2 = svg.append('defs').append("filter").attr("id", "dropShadow2");
				ids=0;
				filter2.append("feFlood").attr("flood-color","black").attr("result","flood");
				//<feFlood flood-color="white" result="flood"/>
				 for(var i=-2;i<=2;i++){
						for(var j=-2;j<=2;j++){
							filter2.append("feOffset").attr("dx",""+i).attr("dy",""+j).attr("in","SourceAlpha").attr("result","offset"+ids);
							  //<feComposite operator="in" in="flood" in2="offset1" result="shadow1"/>
							filter2.append("feComposite").attr("operator","in").attr("in","flood").attr("in2","offset"+ids).attr("result","shadow"+ids);
							
							ids++;

						}							
					 
				 }
				 ids=0;
				 var  feMerge2 = filter2.append("feMerge")	;
				 for(var i=-2;i<=2;i++){
						for(var j=-2;j<=2;j++){

							feMerge2.append("feMergeNode").attr("in","shadow"+ids);
							ids++;
							
						}
				 }						
				feMerge2.append("feMergeNode").attr("in","SourceGraphic");
				  
				  
					  svg.attr("width", layout2.size()[0])
					  .attr("height", layout2.size()[1])
					.append("g")
					  .attr("transform", "translate(" + layout2.size()[0] / 2 + "," + layout2.size()[1] / 2 + ")")
					.selectAll("text")
					  .data(words)
					.enter().append("text")
					  .style("font-size", function(d) { return d.size + "px"; })
					  .style("fill", function(d,i) { 
					  //	if(d.text=="Thresh")
						//console.log("Thresh  tem elem  number "  + qMatrix[i][0].qElemNumber);
					  return  palette[d.keepColor]; })
					  //.style("font-family", "QlikView Sans")
					  .style("font-family", font)
					  .style("font-weight", layout.bold)
					  //.style("text-shadow","-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black")

					 // .style("text-shadow","-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black")
					  .style("text-shadow",function(d){ return shadow(parseInt(1+(d.size/45)),"#000000")})
					 // .style("-webkit-text-stroke","2px red")
					  // .style("filter","filter:DropShadow(Color=#000000, OffX=5, OffY=5)")
					  .attr("text-anchor", "middle")
					  .attr("transform", function(d) {
						return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
					  })
					  
					  
					  
					  .text(function(d) { return d.text; }).attr("filter",function(d){ 
											var dropShadow=1;
											if((d.size/35)>=2)
												dropShadow=2;
												
											if(layout.border && navigator.userAgent.indexOf("Chrome")==-1) 
												return "url('#dropShadow"+dropShadow+"')";
											
											return "";
									});
				}			
				
				
				
}