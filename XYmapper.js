function clearTest() {
  var myNode = document.getElementById('test');
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }
  num = 0;
}

var matrixName = "my_matrix";
var led2grid = 1;
var freeStyle = 0;
var wled = 0;
var num_leds = 0;
var xdim = 0;
var ydim = 0;
var pixelarray = [];
var serpentine = 0;
var hflip = 0;
var vflip = 1;
var vertical = 0;
var discardP = 1;
var clearAll = 0;
var wiringSerp = "serpentine";
var wiringVert = "horizontal";
var wiringVFlip = "top";
var wiringHFlip = "left";
var freestyleCounter = 0;
var lastFreestyle = 0;

function download(){
    var a = document.body.appendChild(
        document.createElement("a")
    );
    a.download = "ledmap.json";
    a.href = "data:text/html," + document.getElementById("result").innerText; // Grab the HTML
    a.click(); // Trigger a click on the element
}

function wledMapA(event) {
  led2grid = 1;
  discardP = 1;
  renumberLEDs();
  drawArrows();
  printMap();
}

function wledMapB(event) {
  led2grid = 0;
  discardP = 0;
  renumberLEDs();
  drawArrows();
  printMap();
}

//function freeOutput(event) {
//  freeStyle = 1;
//  wled = 0;
//  renumberLEDs();
//  drawArrows();
//  printMap();
//}

function wLedOutput(event) {
  freeStyle = 0;
  wled = 1;
  renumberLEDs();
  drawArrows();
  printMap();
}

function serpentineLayout(event) {
  if (event.checked) {
    serpentine = 1;
    wiringSerp = "serpentine";
  } else {
    serpentine = 0;
    wiringSerp = "striped";
  }

  renumberLEDs();
  drawArrows();
  printMap();
}

function hflipLayout(event) {
  if (event.checked) {
    hflip = 1;
    wiringHFlip = "right";
  } else {
    hflip = 0;
    wiringHFlip = "left";
  }

  renumberLEDs();
  drawArrows();
  printMap();
}

function discardPixels(event) {
  if (event.checked) {
    discardP = 1;
  } else {
    discardP = 0;
  }

  renumberLEDs();
  drawArrows();
  printMap();
}

function vflipLayout(event) {
  if (event.checked) {
    vflip = 1;
    wiringVFlip = "bottom";
  } else {
    vflip = 0;
    wiringVFlip = "top";
  }

  renumberLEDs();
  drawArrows();
  printMap();
}

function clearAllPixels(event) {
  if (event.checked) {
    clearAll = 1;
  } else {
    clearAll = 0;
  }

  renumberLEDs();
  drawArrows();
  printMap();
}

function verticalLayout(event) {
  if (event.checked) {
    vertical = 1;
    wiringVert = "vertical";
  } else {
    vertical = 0;
    wiringVert = "horizontal";
  }

  renumberLEDs();
  drawArrows();
  printMap();
}

function buildArray(num_leds) {
//  freeStyle = (document.getElementById("freeCHK")).checked;
  wled = (document.getElementById("wLedCHK")).checked;
  serpentine = (document.getElementById("serpentineCHK")).checked;
  vertical = (document.getElementById("verticalCHK")).checked;
  hflip = (document.getElementById("hflipCHK")).checked;
  vflip = (document.getElementById("vflipCHK")).checked;
  discardP = (document.getElementById("discardCHK")).checked;
  clearAll = (document.getElementById("clearAllCHK")).checked;
  matrixName = (document.getElementById("matrixName")).value;

  for (i = 0; i < num_leds; i++) {
    pixelarray[i] = [];
    if (clearAll == 1) {
      pixelarray[i][0] = "D";	// E = Enable, D = Disable, H = Hidden
    } else {
      pixelarray[i][0] = "E";	// E = Enable, D = Disable, H = Hidden
    }
    pixelarray[i][1] = "N";	// N = No Arrow, R = Right, L = Left, D = Down, U = Up
    pixelarray[i][2] = 0;	  // LED Index number
    pixelarray[i][3] = -1;	// Click Index number
  }

  pixelarray.join("\",\"");
}

function buildGrid(numBoxes) {
  freestyleCounter = 0;
  lastFreestyle = 0;
  gridHTML = "";
  container = document.getElementById('ledgrid');
  clearContents(container);
  xdim = Number(document.getElementById('xdim').value);
  ydim = Number(document.getElementById('ydim').value);

  num_leds = xdim * ydim; // set the max number pixels
  buildArray(num_leds);
  idnum = 0;
  gridHTML += '<div class="ledarray">';
  gridHTML += '<div class="ledrow"><div class="xlabels"></div>';
  for (x = 0; x < xdim; x++) gridHTML += '<div class="xlabels">' + x + '</div>';
  gridHTML += '<div class="xlabels"></div></div>';
  for (j = 0; j < ydim; j++) {
    gridHTML += '<div class="ledrow">';
    gridHTML += '<div class="ylabels">' + j + '</div>';
    for (i = 0; i < xdim; i++) {
      if (clearAll == 1) {
        gridHTML += '<div class="disabledPixel" id="pixel' + idnum + '"';
      } else {
        gridHTML += '<div class="ledpixel" id="pixel' + idnum + '"';
      }
      gridHTML += 'onclick="clearButton(this);">';
      gridHTML += '<div class="ledtext" id="pixeltext' + idnum + '">' + pixelarray[idnum][2] + '</div>';
      gridHTML += '</div>';
      idnum++;
    }
    gridHTML += '<div class="ylabels">' + j + '</div>';
    gridHTML += "</div>";
  }
  gridHTML += '<div class="ledrow"><div class="xlabels"></div>';
  for (x = 0; x < xdim; x++) gridHTML += '<div class="xlabels">' + x + '</div>';
  gridHTML += '<div class="xlabels"></div></div>';
  gridHTML += '</div>';

  container.innerHTML = gridHTML;

  renumberLEDs();
  drawArrows();
  printMap();
}

function clearArrows(element) {
  // remove left arrows
  childnodes = element.getElementsByClassName("triangle-left");
  while(childnodes[0]) {
    element.removeChild(childnodes[0]);
  }

  // remove right arrows
  childnodes = element.getElementsByClassName("triangle-right");
  while(childnodes[0]) {
    element.removeChild(childnodes[0]);
  }

  // remove top arrows
  childnodes = element.getElementsByClassName("triangle-top");
  while(childnodes[0]) {
    element.removeChild(childnodes[0]);
  }

  // remove bottom arrows
  childnodes = element.getElementsByClassName("triangle-bottom");
  while(childnodes[0]) {
    element.removeChild(childnodes[0]);
  }
}

function clearButton(event) {
  eventindex = parseInt((event.id).replace(/[^0-9\.]/g, ''), 10);
  if (pixelarray[eventindex][0] == "E") {
    if (freeStyle != 1) {
      if (discardP == 1) {
        event.className = "disabledPixel";
        pixelarray[eventindex][0] = "D";
      } else {
        event.className = "hiddenPixel";
        pixelarray[eventindex][0] = "H";
      }
      clearArrows(event);
    }
    else if (freeStyle == 1 && pixelarray[eventindex][3] == lastFreestyle) {
      pixelarray[eventindex][3] = -1;
      lastFreestyle = lastFreestyle - 1;
      freestyleCounter--;
      event.className = "disabledPixel";
      pixelarray[eventindex][0] = "D";
      clearArrows(event);
    }
  }
  else if (pixelarray[eventindex][0] == "D") {
    event.className = "ledpixel";
    pixelarray[eventindex][0] = "E";
    
    if (freeStyle == 1) {
      pixelarray[eventindex][3] = freestyleCounter;
      lastFreestyle = freestyleCounter;
      freestyleCounter++;
    }
  }
  else if (pixelarray[eventindex][0] == "H") {
    event.className = "ledpixel";
    pixelarray[eventindex][0] = "E";
  }
  
  renumberLEDs();
  drawArrows();
  printMap();
}

function clearContents(element) {
  element.innerHTML = "";
}

function drawArrows() {
  for (i = 0; i < num_leds; i++) {
    pixelID = "pixel" + i;
    if (pixelarray[i][0] == "E" && freeStyle != 1) {
      pixelElement = document.getElementById(pixelID);
      clearArrows(pixelElement);

      // add a new div to the document
      arrownode = document.createElement("div");

      // apply the correct style to the new div

      if (pixelarray[i][1] == "R") {
        arrownode.className = "triangle-right";
      } else if (pixelarray[i][1] == "L") {
        arrownode.className = "triangle-left";
      } else if (pixelarray[i][1] == "U") {
        arrownode.className = "triangle-bottom";
      } else if (pixelarray[i][1] == "D") {
        arrownode.className = "triangle-top";
      }
      pixelElement.appendChild(arrownode);
    }
  }
}

function countActiveLEDs() {
  var activeCount = 0;
  for (i = 0; i < num_leds; i++) {
    if (pixelarray[i][0] == "E") activeCount++;
  }
  return activeCount;
}

function renumberLEDs() {
  var activeLEDs = 0;
  var inactiveLEDs = countActiveLEDs();
  var xtemp = 0;
  var ytemp = 0;

  if (vertical == 0 ) {
    ytemp = ydim;
    xtemp = xdim;
  } else {
    ytemp = xdim;
    xtemp = ydim;
  }

  for (y = 0; y < ytemp; y++) {
    for (x = 0; x < xtemp; x++) {
      if (vertical == 0) {
        if (vflip == 1) var ty = ytemp-y-1; else var ty = y;
        if (hflip == 1) var tx = xtemp-x-1; else var tx = x;
      } else {
        if (hflip == 1) var ty = ytemp-y-1; else var ty = y;
        if (((hflip == 1) ^ (vflip == 1)) ^ (serpentine == 0 && hflip == 1)) var tx = xtemp-x-1;
        //if ((hflip == 1) ^ (serpentine == 1 && vflip == 1)) var tx = xtemp-x-1;
        else var tx = x;
      }

      var ledpos = 0;
      var tDir = 'N';
      var oddcols = (xdim % 2 == 1 && hflip == 1 && vertical == 1);
      var evenrows = (ydim % 2 == 0 && vflip == 1 && vertical == 0);

        if ((((ty+evenrows+oddcols) % 2) == 0) || (serpentine == 0)) {
          if (vertical == 0) {
            ledpos = ty*xtemp+tx;
            if (hflip == 1) tdir = "L"; else tdir = "R";
          } else {
            ledpos = tx*ytemp+ty;
            if ((vflip == 1) ^ (serpentine == 1 && hflip == 1)) tdir = "U"; else tdir = "D";
          }

        } else {
          if (vertical == 0) {
            ledpos = ty*xtemp+xtemp-1-tx;
            if (hflip == 1) tdir = "R"; else tdir = "L";
          } else {
            ledpos = (xtemp-tx-1)*ytemp+ty;
            if ((vflip == 1) ^ (serpentine == 1 && hflip == 1)) tdir = "D"; else tdir = "U";
          }
        }

        pixelarray[ledpos][1] = tdir;
        if (pixelarray[ledpos][0] == "E") {
            if (freeStyle == 1) {
              pixelarray[ledpos][2] = pixelarray[ledpos][3];
            } else {
              pixelarray[ledpos][2] = activeLEDs;
              activeLEDs++;
            }
        } else {
          if (pixelarray[ledpos][0] == "D" || pixelarray[ledpos][0] == "H" ) {
            if (wled == 1 || freeStyle == 1) {
              if (freeStyle == 1 || discardP == 1) {
                pixelarray[ledpos][2] = -1;
              } else {
                pixelarray[ledpos][2] = inactiveLEDs;
                inactiveLEDs++;
              }
            } else {
              pixelarray[ledpos][2] = inactiveLEDs;
              inactiveLEDs++;
            }
          }
        }

      pixelID = "pixeltext" + ledpos;
      pixelElement = document.getElementById(pixelID);
      pixelElement.innerHTML = "" + pixelarray[ledpos][2].toString();
    }
  }
}

function pad(pad, str, padLeft) {
  if (typeof str === 'undefined')
    return pad;
  if (padLeft) {
    return (pad + str).slice(-pad.length);
  } else {
    return (str + pad).substring(0, pad.length);
  }
}

function printMap() {
  
  mapDiv = document.getElementById("infoOut");

  mapHTML = "";
  mapHTML += '<PRE>';  
  if (wled == 1) {
    mapHTML += 'Wired in ' + wiringVert + ' ' + wiringSerp + ' layout starting at the ' + wiringVFlip + ' ' + wiringHFlip + ' corner.<BR>';
  } else if (freeStyle == 1) {
    mapHTML += 'wLED ledmap.json file.<BR>';
    mapHTML += 'Wired freestyle following the order clicked.<BR>';
  }
    mapHTML += '' + countActiveLEDs() + ' LEDs visible out of ' + (xdim * ydim) + '<BR><BR>';
  if (led2grid == 1) {
    mapHTML += "<b>**</b> 2D matrix settings in wLED must be set to TOP LEFT HORIZONTAL(NO serpentine) regardless of your actual layout.<BR>";
  }
  
  mapHTML += '</PRE>';

  mapDiv.innerHTML = mapHTML;

  mapDiv = document.getElementById("result");

  mapHTML = "";
  ledindex = 0;
  mapHTML += '<PRE>';

  mapHTML += '{"n":"' + matrixName + '","width":' + xdim + ',"height":' + ydim + '"map":[<BR>';
    for (x = 0; x < num_leds; x++) {
      if (freeStyle != 1) {
        
// NORMAL LED2GRID OUTPUT CODE
        if (led2grid == 1) {
          mapHTML += pad('  ', pixelarray[ledindex][2], true);
          ledindex++;
          if (ledindex < num_leds) mapHTML += ",";
          if ((x+1) % xdim === 0) mapHTML += '<BR>';
        
// NORMAL GRID2LED OUTPUT CODE
        } else {
          var outOrder = 0;
          while (outOrder < num_leds) {
            if (pixelarray[outOrder][2] == ledindex && ledindex <= (countActiveLEDs()-1)) {
              mapHTML += pad('   ', outOrder, true);
              ledindex++;
              if (ledindex < countActiveLEDs()) mapHTML += ",";
              if ((x+1) % xdim === 0) mapHTML += '<BR>';
              break;
            } else {
              outOrder++;
            }
          }
        }  
      } else { 
      
// FREESTYLE LED2GRID OUTPUT CODE
        if (led2grid == 1) {
          if (pixelarray[ledindex][3] >= 0) {
            mapHTML += pad('   ', pixelarray[ledindex][3], true);
          } else {
            mapHTML += pad('   ', -1, true);
          }
          ledindex++;
          if (ledindex < num_leds) mapHTML += ",";
          if ((x+1) % xdim === 0) mapHTML += '<BR>';
        
// FREESTYLE GRID2LED OUTPUT CODE
        } else {
          var freeOrder = 0;
          while (freeOrder < num_leds) {
            if (pixelarray[freeOrder][3] == ledindex) {
              mapHTML += pad('   ', freeOrder, true);
              ledindex++;
              if (ledindex < activeLEDcount) mapHTML += ",";
              if ((x+1) % xdim === 0) mapHTML += '<BR>';
              break;
            } else {
              freeOrder++;
            }
          } 
        } 
      }      
    }
  mapHTML += ']}</PRE>';

  mapDiv.innerHTML = mapHTML;
}

function loadGrid() {
  renumberLEDs();
//  drawArrows();
  buildGrid();
}

window.onload = loadGrid;
