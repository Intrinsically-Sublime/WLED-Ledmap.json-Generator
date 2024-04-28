function clearTest() {
  var myNode = document.getElementById('test');
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }
  num = 0;
}

var matrixName = "my_matrix";
var freeStyle = 0;
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
var wiringSerp = "striped";
var wiringVert = "horizontal";
var wiringVFlip = "top";
var wiringHFlip = "left";
var freestyleCounter = 0;
var lastFreestyle = 0;
var offsetValue = 0;

function lightMode() {
  var element = document.body;
  element.classList.toggle("light-mode");
   
  var btn = document.getElementById("lightToggle");
  if (btn.innerText == "Dark") {
    btn.innerText = "Light";
  } else {
    btn.innerText = "Dark";
  }
}

function showGuide() {
    document.getElementById("popupGuide").style.display = "block";
}

function hideGuide() {
    document.getElementById("popupGuide").style.display = "none";
}

function download(){
    matrixName = (document.getElementById("matrixName")).value;
    printMap();
    var a = document.body.appendChild(
        document.createElement("a")
    );
    if (matrixName == "my_matrix") {
      a.download = "ledmap.json";
    } else {
      a.download = matrixName + ".ledmap.json";
    }

    a.href = "data:text/html," + document.getElementById("result").innerText; // Grab the HTML
    a.click(); // Trigger a click on the element
}

function copyOutput(){
  var result = document.getElementById("result").innerText;
  navigator.clipboard.writeText(result);
  alert('Copied ' + matrixName + ' to clipboard');
}

function freeOutput(event) {
  freeStyle = 1;
  renumberLEDs();
  drawArrows();
  printMap();
}

function wLedOutput(event) {
  freeStyle = 0;
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
    if (pixelarray[i][0] == "E") {
      pixelElement = document.getElementById(pixelID);
      clearArrows(pixelElement);

      // add a new div to the document
      arrownode = document.createElement("div");

      // apply the correct style to the new div
      if (freeStyle != 1) {
        if (pixelarray[i][1] == "R") {
          arrownode.className = "triangle-right";
        } else if (pixelarray[i][1] == "L") {
          arrownode.className = "triangle-left";
        } else if (pixelarray[i][1] == "U") {
          arrownode.className = "triangle-bottom";
        } else if (pixelarray[i][1] == "D") {
          arrownode.className = "triangle-top";
        }
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
  offsetValue = Number(document.getElementById('startIndex').value);

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
              pixelarray[ledpos][2] = (pixelarray[ledpos][3] + offsetValue);
            } else {
              pixelarray[ledpos][2] = (activeLEDs + offsetValue);
              activeLEDs++;
            }
        } else {
          if (pixelarray[ledpos][0] == "D" || pixelarray[ledpos][0] == "H" ) {
            if (freeStyle == 1 || discardP == 1) {
              pixelarray[ledpos][2] = -1;
            } else {
              pixelarray[ledpos][2] = (inactiveLEDs + offsetValue);
              inactiveLEDs++;
            }
          }
        }

      pixelID = "pixeltext" + ledpos;
      pixelElement = document.getElementById(pixelID);
      pixelElement.innerHTML = "" + pixelarray[ledpos][2].toString();
      matrixName = (document.getElementById("matrixName")).value;
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
  mapHTML += 'wLED ledmap.json file.<BR>';
  if (freeStyle == 1) {
    mapHTML += 'Wired freestyle following the order clicked.<BR>';
  } else {
    mapHTML += 'Wired in ' + wiringVert + ' ' + wiringSerp + ' layout starting at the ' + wiringVFlip + ' ' + wiringHFlip + ' corner.<BR>';
  }

  mapHTML += '' + countActiveLEDs() + ' LEDs visible out of ' + (xdim * ydim) + '<BR><BR>';
  mapHTML += '</PRE>';

  mapDiv.innerHTML = mapHTML;

  mapDiv = document.getElementById("result");

  mapHTML = "";
  ledindex = 0;
  mapHTML += '<PRE>';
  mapHTML += '{"n":"' + matrixName + '","width":' + xdim + ',"height":' + ydim + ',"map":[<BR>';
  for (x = 0; x < num_leds; x++) {
    if (freeStyle == 1) {
      if (pixelarray[ledindex][3] >= 0) {
        mapHTML += (pixelarray[ledindex][3] + offsetValue);
      } else {
        mapHTML += pixelarray[ledindex][3];
      }
    } else {
      mapHTML += pixelarray[ledindex][2]
    }
    
    if (ledindex < (num_leds - 1)) {
      mapHTML += ",";
      if ((ledindex+1) % xdim === 0) {
        mapHTML += '<BR>';
      }
    }
    
  ledindex++;    
  }
  mapHTML += '<BR>]}</PRE>';

  mapDiv.innerHTML = mapHTML;
}

function loadGrid() {
  renumberLEDs();
  buildGrid();
}

window.onload = loadGrid;
