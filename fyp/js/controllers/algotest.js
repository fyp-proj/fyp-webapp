

var req = new XMLHttpRequest();

var url = "http://algotraders.pythonanywhere.com/webDev/";

req.onreadystatechange = function() {

    if (this.readyState == 4 && this.status == 200) {

        var res = JSON.parse(this.responseText);

        Yoko(res);
    }
};

req.open("GET", url, true);

req.send();


function Yoko(arr) {

    document.getElementById("json").innerHTML = JSON.stringify(arr);

    var cst=arr.Constant;

    var matrix=arr.Matrix;

    if(cst==0){

        document.getElementById('error').innerHTML="Error can't divide by 0";

        return;
    }

    for(var i=0;i<matrix.length;i++){

        for(var j=0;j<matrix[i].length;j++){

            matrix[i][j]=matrix[i][j]/cst;

            matrix[i][j]=Math.round(matrix[i][j] * 100) / 100;
        }
    }

    createTable(matrix);

}


function createTable(data) {

  var table = document.createElement('table');

  var tableBody = document.createElement('tbody');

  data.forEach(function(rowData) {

    var row = document.createElement('tr');

    rowData.forEach(function(cellData) {

      var cell = document.createElement('td');

      cell.style.border="1px solid black";

      cell.style.padding="5px";

      cell.appendChild(document.createTextNode(cellData));

      row.appendChild(cell);

    });

    tableBody.appendChild(row);

  });

  table.appendChild(tableBody);

  table.style.border="1px solid black";

  document.body.appendChild(table);

}
