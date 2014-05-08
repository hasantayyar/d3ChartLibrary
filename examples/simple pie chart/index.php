<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title></title>
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
        <script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
        <script src='d3Charts.js'></script>
    </head>
    <body>
        <div id='content'>
            <div id='myChart'></div>
        </div>        
        
        <script>
            var myData = [
                {label: "A", color: "#990099", value: 590},
                {label: "B", color: "#DC3912", value: 1400},
                {label: "C", color: "#FF9900", value: 600},
                {label: "D", color: "#109618", value: 100},
                {label: "E", color: "#6F00FF", value: 1200},
            ];
            simplePieChart.draw('myChart', 300, 500, myData);
        </script>
    </body>
</html>
