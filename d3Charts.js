//Simple Pie Chart Object
!function() {
    var simplePieChart = {};
    var pie = d3.layout.pie().sort(null).value(function(d) {
        return d.value;
    });
    simplePieChart.draw = function(id, w, h, data) {
        if (Math.min(w, h) < 150) {
            alert('The area is too small to draw a simple pie chart');
            return;
        } else {
            var r = (Math.min(w, h)) / 2;
            var svg = d3.select('#' + id).append('svg').attr('width', w).attr('height', h).append('g').attr('transform', "translate(" + r + "," + r + ")");
            var nodes = svg.selectAll('g').data(pie(data)).enter().append('g');
            var path = nodes.append('path').attr('fill', function(d) {
                return d.data.color;
            }).attr('d', d3.svg.arc().outerRadius(r)).each(function(d) {
                this._current = d;
            });
            nodes.on('mouseover', function(d) {
                if (d3.select(this)[0][0].childElementCount < 3) {
                    d3.select('#' + id + ' svg').selectAll('path').attr('fill', 'grey');
                    d3.select('#' + id + ' svg').selectAll('text').attr('fill', 'none');
                    d3.select(this).select('path').attr('fill', function(d) {
                        return d.data.color;
                    });
                    d3.select(this).select('text').attr('fill', 'white');
                    d3.select('#' + id + ' svg').append('g').attr('id', 'infoRect');
                    d3.select('#infoRect').append('rect').attr('width', r / 2).attr('height', r / 4).attr('rx', r / 30).attr('ry', r / 30).attr('fill', 'white').attr('stroke', 'blue').attr('x', 5).attr('y', 5);
                    //fontSize in percent
                    var fontSize = (r * (1.3) * 100 / 200);
                    d3.select('#infoRect').append('text').text(function() {
                        return d.data.label;
                    }).attr('x', r / 4 + 5).attr('y', r / 8 + 3).attr('text-anchor', 'middle').attr('font-size', fontSize + '%');
                    d3.select('#infoRect').append('text').text(function() {
                        var angle = Math.abs(d.startAngle - d.endAngle) * 180 / Math.PI;
                        var rate = angle * 100 / 360;
                        return parseFloat(rate).toFixed(2) + '%';
                    }).attr('x', r / 4 + 5).attr('y', r / 8 + 5 + fontSize * 15 / 100).attr('text-anchor', 'middle').attr('font-size', fontSize + '%');
                }
                d3.select(this).on('mousemove', function() {
                    d3.select('#' + id + ' svg').select('#infoRect').attr('transform', "translate(" + (d3.event.pageX - d3.select('#' + id + ' svg')[0][0].offsetLeft - d3.select('#' + id + ' svg')[0][0].offsetParent.offsetLeft) + "," + (d3.event.pageY - d3.select('#' + id + ' svg')[0][0].offsetTop - d3.select('#' + id + ' svg')[0][0].offsetParent.offsetTop) + ")");
                });
            });
            nodes.on('mouseleave', function(d) {
                d3.select('#infoRect').remove();
                d3.select('#' + id + ' svg').selectAll('path').attr('fill', function(d) {
                    return d.data.color;
                });
                d3.select('#' + id + ' svg').selectAll('text').attr('fill', 'white');
            });
            nodes.append('text').text(function(d) {
                var angle = Math.abs(d.startAngle - d.endAngle) * 180 / Math.PI;
                var rate = angle * 100 / 360;
                return parseFloat(rate).toFixed(2) + '%';
            }).attr('y', function(d) {
                return (r * 2 / 3) * Math.sin(d.startAngle + (Math.abs(d.startAngle - d.endAngle) / 2) - Math.PI / 2);
            }).attr('x', function(d) {
                var angle = ((Math.abs(d.startAngle - d.endAngle) / 2) + (d.startAngle)) * 180 / Math.PI;
                return (r * 2 / 3) * Math.cos(d.startAngle + (Math.abs(d.startAngle - d.endAngle) / 2) - Math.PI / 2) - (r * 100 / 1000);
            }).attr('fill', 'white').attr('font-size', function() {
                return (r * 100 / 200) + '%';
            });
        }
    };
    this.simplePieChart = simplePieChart;
}();
//Simple Bar Chart Object
!function() {
    var simpleBarChart = {};
    simpleBarChart.draw = function(id, w, h, data) {
        var leftPadding = 50;
        var svg = d3.select('#' + id).append('svg').attr('width', w).attr('height', h).append('g').attr('transform', "translate(" + leftPadding + "," + 10 + ")");
        //calculate maximum and total value for percentage rates
        var maxVal = 0;
        var totalVal = 0;
        $.each(data, function(i, d) {
            if (maxVal < d.value) {
                maxVal = d.value;
            }
            totalVal += d.value;
        });
        //allocate some area for y labels
        var xWidth = w - leftPadding;
        var x = d3.scale.ordinal().rangeRoundBands([0, xWidth], .1).domain(data.map(function(data) {
            return data.label;
        }));
        //allocate some area for labels
        var yHeight = h - 80;
        var y = d3.scale.ordinal().range([yHeight, 0]);
        y.domain([0, d3.max(data, function(data) {
                return parseFloat(data.value * 100 / totalVal).toFixed(2) + '%';
            })]);
        var xAxis = d3.svg.axis().scale(x).orient('bottom');
        var yAxis = d3.svg.axis().scale(y).orient('left').ticks(10, '%');
        var xAxisNode = svg.append('g').attr('class', 'xAxis').attr('transform', "translate(" + 0 + "," + (yHeight) + ")").call(xAxis);
        xAxisNode.select('path').attr('stroke', 'black').attr('stroke-width', 1).attr('fill', 'none').attr('shape-rendering', 'crispEdges');
        xAxisNode.selectAll('text').attr("y", 0).attr("x", 9).attr("dy", ".35em").attr("transform", "rotate(90)").style("text-anchor", "start");
        var yAxisNode = svg.append('g').attr('class', 'yAxis').call(yAxis);
        yAxisNode.select('path').attr('stroke', 'black').attr('stroke-width', 1).attr('fill', 'none').attr('shape-rendering', 'crispEdges');
        yAxisNode.selectAll('text').attr('dx', '.3em').attr('font-size', '70%');
        var unitW = xWidth / data.length;
        var padding = unitW / 4;
        var barW = (xWidth - 6 * padding) / data.length;
        var nodes = svg.selectAll('g.bar').data(data).enter().append('g')

        var rects = nodes.append('rect').attr('width', barW).attr('height', function(d) {
            return d.value / maxVal * (yHeight);
        }).attr('x', function(d, i) {
            return i * (barW + padding) + padding;
        }).attr('y', function(d) {
            return yHeight - (d.value / maxVal * (yHeight));
        }).attr('fill', function(d) {
            return d.color;
        });
        nodes.on('mouseover', function(d) {
            // console.log(this, d3.select(this));
            d3.select('#' + id + " svg").selectAll('rect').attr('fill', 'grey');
            d3.select(this).select('rect').attr('fill', d.color);
            var infoRect = d3.select('#' + id + " svg").append('g').attr('id', 'infoRect');
            var rect = infoRect.append('rect').attr('width', xWidth / 4).attr('height', yHeight / 5).attr('x', 5).attr('y', 5);
            rect.attr('fill', 'white').attr('stroke', 'blue').attr('rx', xWidth / 60).attr('ry', yHeight / 60);
            infoRect.append('text').text(d.label).attr('text-anchor', 'middle').attr('x', xWidth / 8).attr('y', yHeight / 10);
            infoRect.append('text').text(function() {
                return parseFloat(d.value * 100 / totalVal).toFixed(2) + '%';
            }).attr('x', xWidth / 8).attr('y', yHeight / 10 + 20).attr('text-anchor', 'middle');
            d3.select(this).on('mousemove', function() {
                d3.select('#' + id + ' svg').select('#infoRect').attr('transform', "translate(" + (d3.event.pageX - d3.select('#' + id + ' svg')[0][0].offsetLeft - d3.select('#' + id + ' svg')[0][0].offsetParent.offsetLeft) + "," + (d3.event.pageY - d3.select('#' + id + ' svg')[0][0].offsetTop - d3.select('#' + id + ' svg')[0][0].offsetParent.offsetTop) + ")");
            });
        });
        nodes.on('mouseleave', function() {
            d3.select('#infoRect').remove();
            d3.select('#' + id + ' svg').selectAll('rect').attr('fill', function(d) {
                return d.color;
            });
        });
    }
    this.simpleBarChart = simpleBarChart;
}();

!function() {
    var simpleLineChart = {};

    simpleLineChart.draw = function(id, w, h, data) {
        var leftPadding = 50;
        var svg = d3.select('#' + id).append('svg').attr('width', w).attr('height', h).append('g').attr('transform', "translate(" + leftPadding + "," + 10 + ")");
        //calculate maximum and total value for percentage rates
        var maxVal = 0;
        var nodeNum = 0;
        $.each(data, function(i, d) {
            if (maxVal < d.value) {
                maxVal = d.value;
            }
            nodeNum++;
        });
        //allocate some area for y labels
        var xWidth = w - leftPadding;
        var x = d3.scale.ordinal().rangeRoundBands([0, xWidth]);

        //allocate some area for labels
        var yHeight = h - 80;
        var y = d3.scale.linear().range([yHeight, 0]);

        var xAxis = d3.svg.axis().scale(x).orient('bottom');
        var yAxis = d3.svg.axis().scale(y).orient('left');


        var line = d3.svg.line()
                .x(function(d) {
                    return x(d.label);
                })
                .y(function(d) {
                    return y(d.value);
                });

        x.domain(data.map(function(data) {
            return data.label;
        }));
        y.domain([0, d3.max(data, function(data) {
                return maxVal;
            })]);

        var xAxisNode = svg.append('g').attr('class', 'xAxis').attr('transform', "translate(" + 0 + "," + (yHeight) + ")").call(xAxis);
        xAxisNode.select('path').attr('stroke', 'black').attr('stroke-width', 1).attr('fill', 'none').attr('shape-rendering', 'crispEdges');
        
        xAxisNode.selectAll('text').attr("x", -(xWidth/nodeNum/2));
        
        var yAxisNode = svg.append('g').attr('class', 'yAxis').call(yAxis);
        yAxisNode.select('path').attr('stroke', 'black').attr('stroke-width', 1).attr('fill', 'none').attr('shape-rendering', 'crispEdges');
        yAxisNode.selectAll('text').attr('dx', '.3em').attr('font-size', '70%');

        var linePath = svg.append('path').datum(data).attr('class', 'line').attr('d', line).attr('stroke', 'blue').attr('fill', 'none').style('shape-rendering', 'crispEdges');
    };
    this.simpleLineChart = simpleLineChart;
}();
