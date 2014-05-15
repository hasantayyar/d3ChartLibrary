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
                    }).attr('x', r / 4 + 5).attr('y', r / 8+3).attr('text-anchor', 'middle').attr('font-size', fontSize + '%');


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
                //var angle = ((Math.abs(d.startAngle - d.endAngle) / 2) + (d.startAngle)) * 180 / Math.PI+45;
                console.log();
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

!function() {

}();