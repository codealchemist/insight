'use strict';

angular
  .module('graph')
  .service('graph', graph);

//------------------------------------------------------------

function graph() {
  var service = {
    createSvg,
    createPng,
    donut
  };
  return service;

  //------------------------------

  function createSvg(el) {
    var svg = d3.select(el)
      .append('svg')
      // .attr('id', 'svg-' + id)
      .attr('style', 'font-family: "Helvetica Neue", Helvetica, Arial, sans-serif')
      .append('g');

    return svg;
  }

  function donut(svg, data) {
    // add graph component containers
    svg.append('g').attr('class', 'slices');
    svg.append('g').attr('class', 'labels');
    svg.append('g').attr('class', 'lines');

    var width = getContainerWidth(svg);
    var height = getContainerHeight(svg);
    setContainerHeight(svg, height);

    svg.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    function getRadius(percentage) {
      percentage = percentage || 1;

      var radius = Math.min(width * percentage, height * percentage) / 2;
      return radius;
    }

    setDataOnGraph(svg, data, getRadius);
  } // end graph

  function setDataOnGraph(svg, data, getRadius) {
    // set graph components
    var key = function(d){ return d.data.label; };
    var color = getColor(data);

    var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) {
        return d.value;
      });

    var arc = d3.svg.arc()
      .outerRadius(getRadius() * 0.8)
      .innerRadius(getRadius() * 0.4);

    var outerArc = d3.svg.arc()
      .innerRadius(getRadius() * 0.9)
      .outerRadius(getRadius() * 0.9);

    function midAngle(d){
      return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    // compose graph
    // NOTE: object shorthand breaks uglify; must transpile before piping to it
    var components = {svg, data, pie, color, arc, outerArc, getRadius, midAngle, key};
    setSlices(components);
    setLabels(components);
    setLines(components);
  }

  function setSlices({svg, data, pie, color, arc, key}) {
    var slice = svg.select('.slices')
      .selectAll('path.slice')
      .data(pie(data), key);

    slice.enter()
      .insert('path')
      .style('fill', function(d) { return color(d.data.label); })
      .attr('class', 'slice')
      .attr('id', (d) => `slice-${d.data.id}`)
      .on('mouseover', function(d){
        // highlight slice
        d3.select(this)
          .classed('highlight', true);

        // highlight text
        d3.select(`#text-${d.data.id}`)
          .classed('highlight', true);

        // highlight line
        d3.select(`#line-${d.data.id}`)
          .classed('highlight', true);
      })
      .on('mouseout', function(d){
        // remove slice highlighting
        d3.select(this)
          .classed('highlight', false);

        // remove text highlighting
        d3.select(`#text-${d.data.id}`)
          .classed('highlight', false);

        // remove line highlighting
        d3.select(`#line-${d.data.id}`)
          .classed('highlight', false);
      });

    slice   
      .transition().duration(1000)
      .attrTween('d', function(d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          return arc(interpolate(t));
        };
      })

    slice
      .exit()
      .remove();
  }

  function setLabels({svg, data, pie, outerArc, getRadius, midAngle, key}) {
    var text = svg.select('.labels')
      .selectAll('text')
      .data(pie(data), key);

    text.enter()
      .append('text')
      .attr('dy', '.35em')
      .text(function(d) {
        return d.data.label;
      })
      .attr('id', (d) => `text-${d.data.id}`)
      .on('mouseover', function(d){
        // highlight text
        d3.select(this)
          .classed('highlight', true);

        // highlight slice
        d3.select(`#slice-${d.data.id}`)
          .classed('highlight', true);

        // highlight line
        d3.select(`#line-${d.data.id}`)
          .classed('highlight', true);
      })
      .on('mouseout', function(d){
        // remove text highlighting
        d3.select(this)
          .classed('highlight', false);

        // remove slice highlighting
        d3.select(`#slice-${d.data.id}`)
          .classed('highlight', false);

        // remove line highlighting
        d3.select(`#line-${d.data.id}`)
          .classed('highlight', false);
      });

    text.transition().duration(1000)
      .attrTween('transform', function(d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          var d2 = interpolate(t);
          var pos = outerArc.centroid(d2);
          pos[0] = getRadius() * (midAngle(d2) < Math.PI ? 1 : -1);
          return 'translate('+ pos +')';
        };
      })
      .styleTween('text-anchor', function(d){
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          var d2 = interpolate(t);
          return midAngle(d2) < Math.PI ? 'start':'end';
        };
      });

    text
      .exit()
      .remove();
  }

  function setLines({svg, data, pie, arc, outerArc, getRadius, midAngle, key}) {
    var polyline = svg.select('.lines')
      .selectAll('polyline')
      .data(pie(data), key);
    
    polyline.enter()
      .append('polyline')
      .attr('id', (d) => `line-${d.data.id}`)
      .attr('style', 'opacity: .3; stroke: black; stroke-width: 2px; fill: none;')
      .on('mouseover', function(d){
        // highlight line
        d3.select(this)
          .classed('highlight', true);

        // highlight text
        d3.select(`#text-${d.data.id}`)
          .classed('highlight', true);

        // highlight slice
        d3.select(`#slice-${d.data.id}`)
          .classed('highlight', true);
      })
      .on('mouseout', function(d){
        // remove line highlighting
        d3.select(this)
          .classed('highlight', false);

        // remove text highlighting
        d3.select(`#text-${d.data.id}`)
          .classed('highlight', false);

        // remove slice highlighting
        d3.select(`#slice-${d.data.id}`)
          .classed('highlight', false);
      });

    polyline.transition().duration(1000)
      .attrTween('points', function(d){
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          var d2 = interpolate(t);
          var pos = outerArc.centroid(d2);
          pos[0] = getRadius() * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
          return [arc.centroid(d2), outerArc.centroid(d2), pos];
        };      
      });
    
    polyline.exit()
      .remove();
  }

  function getContainerWidth(svg) {
    var width = $(svg.node().parentNode).width() - 40;
    return width;
  }

  function getContainerHeight(svg) {
    var width = getContainerWidth(svg);
    var height = width / 2;
    return height;
  }

  function setContainerHeight(svg, height) {
    $(svg.node().parentNode).height(height);
  }

  function getColor() {
    var scale = d3.scale.ordinal()
      .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);

    return scale;
  }

  function createPng(svg, callback) {
    // get svg dimensions
    var svg = d3.select(svg);
    var width = svg.style('width').replace('px', '');
    var height = svg.style('height').replace('px', '');

    var html = svg
      .attr('version', 1.1)
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .node().parentNode.innerHTML;

    var imgsrc = 'data:image/svg+xml;base64,'+ btoa(html);
    
    var canvas = d3.select('body')
      .append('canvas')
      .attr('style', 'display:none')
      .node();
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext('2d');

    var image = new Image;
    image.width = width;
    image.height = height;
    image.src = imgsrc;
    var tempImg = document.body.appendChild(image); // img needs to render on page for it to work on Safari
    
    image.onload = function() {
      setTimeout(() => { // timeout is needed in Safari to allow the image to render on the page
        context.drawImage(image, 0, 0);
        var canvasdata = canvas.toDataURL('image/png');
        var binary = dataURItoBlob(canvasdata);
        tempImg.remove();
        canvas.remove();

        callback(binary, canvasdata);
      });
    };
  }

  // Convert a data URI to blob
  function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {
      type: 'image/png'
    });
  }
}
