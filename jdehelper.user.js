// ==UserScript==
// @name        JDE helper
// @namespace   jde-helper
// @include     http://demo.steltix.com/jde/E1Menu*
// @include     http*://sandbox921.steltix.com/jde/*
// @version     1
// @grant       none
// ==/UserScript==

//Create the "Display IDs" button and add it to the page
var ele = document.getElementById("menuContainer");
var button = document.createElement("input");
button.setAttribute("type", "button");
button.setAttribute("value", "Display IDs");
button.setAttribute("style", "height: 75%");
ele.appendChild(button);

button.addEventListener("click", function() {
  var frame = document.getElementById("e1menuAppIframe").contentDocument;
  
  //Get the text fields
  var elements = frame.getElementsByTagName("input");
  
  for (var i=0; i<elements.length; i++) {
    if (elements[i].id.startsWith("C0")) {
      elements[i].setAttribute("value", "");
      elements[i].setAttribute("placeholder", elements[i].id.substr(3)); //Display ID for each text field
    }
  }
  
  //Get the buttons (add, delete, search, etc.)
  var elements = frame.getElementById("WebMenuBar").getElementsByTagName("td");

  for (var i=0; i<elements.length; i++) {
    if (elements[i].id.indexOf("outer") > -1) {
      elements[i].setAttribute("style", "border: 1px solid black");

      var label = document.createElement("div");
      label.innerHTML = elements[i].id.split("_")[1]; 
      elements[i].appendChild(label); //Display ID for each button
    }
  }
  
  //Not harcoded to look for a particular grid ID, will use the first grid it finds (haven't tested with multiple grids but this is 
the intended behaviour)
  //Coded this way to make it trivial to loop through multiple grids if needed
  
  //Get the idObjectList assignment string (var idObjectList=["1", "2", "3" etc.])
  var startInd = frame.body.innerHTML.indexOf("var idObjectList");
  var endInd = frame.body.innerHTML.indexOf("\n", startInd);
  var assignment = frame.body.innerHTML.substring(startInd, endInd);
  
  //Get the ID of the grid used in the assignment
  var gridid_index_start = "var idObjectList".length;
  var gridid_index_end = assignment.indexOf("=", gridid_index_start);
  var gridid = assignment.substring(gridid_index_start, gridid_index_end);
  
  //Extract the array from the asssignment, and assign it to idarray
  var idarraystart = assignment.indexOf("[");
  var idarrayend = assignment.indexOf("]");
  var idarraystr = assignment.substring(idarraystart, idarrayend+1);
  eval("var idarray = " + idarraystr);
  
  //Get the HTML grid
  var grid = frame.getElementById("qbeRow" + gridid);
  console.log(grid);
  for (var i=1 /* i=1 intentional */; i<grid.childNodes.length; i++) {
    var textfield = grid.childNodes[i].childNodes[0].childNodes[0].childNodes[0]; // <input ... /> inside of each <td>
    textfield.setAttribute("placeholder", idarray[i-1]);
  }
  
  
})
