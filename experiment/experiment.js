(function() {

  // Experiment modes
  var Modes = {
    START: 0,
    QUAL: 1,
    TRAIN: 2,
    WORK: 3,
    USABILITY: 4,
    DEMOGRAPHIC: 5,
  }

  // Dataset for instructional example
  // {{{
  var instructionalData = [[{"x":0,"y":63},{"x":1,"y":13},{"x":2,"y":23},{"x":3,"y":83},{"x":4,"y":54}],[{"x":0,"y":46},{"x":1,"y":45},{"x":2,"y":19},{"x":3,"y":60},{"x":4,"y":47}],[{"x":0,"y":48},{"x":1,"y":14},{"x":2,"y":28},{"x":3,"y":68},{"x":4,"y":33}],[{"x":0,"y":22},{"x":1,"y":70},{"x":2,"y":82},{"x":3,"y":68},{"x":4,"y":49}],[{"x":0,"y":86},{"x":1,"y":39},{"x":2,"y":25},{"x":3,"y":30},{"x":4,"y":20}],[{"x":0,"y":43},{"x":1,"y":24},{"x":2,"y":65},{"x":3,"y":6},{"x":4,"y":39}],[{"x":0,"y":94},{"x":1,"y":15},{"x":2,"y":32},{"x":3,"y":73},{"x":4,"y":51}],[{"x":0,"y":74},{"x":1,"y":23},{"x":2,"y":56},{"x":3,"y":54},{"x":4,"y":50}],[{"x":0,"y":16},{"x":1,"y":71},{"x":2,"y":67},{"x":3,"y":7},{"x":4,"y":48}],[{"x":0,"y":19},{"x":1,"y":10},{"x":2,"y":9},{"x":3,"y":78},{"x":4,"y":68}],[{"x":0,"y":39},{"x":1,"y":66},{"x":2,"y":90},{"x":3,"y":91},{"x":4,"y":50}],[{"x":0,"y":85},{"x":1,"y":82},{"x":2,"y":77},{"x":3,"y":13},{"x":4,"y":61}],[{"x":0,"y":13},{"x":1,"y":12},{"x":2,"y":21},{"x":3,"y":82},{"x":4,"y":57}],[{"x":0,"y":6},{"x":1,"y":26},{"x":2,"y":89},{"x":3,"y":10},{"x":4,"y":12}],[{"x":0,"y":58},{"x":1,"y":44},{"x":2,"y":83},{"x":3,"y":48},{"x":4,"y":14}]];

  // Answers for training tasks
  var trainAnswers = [
    ['<svg width="102" height="102"><g transform="translate(1,1)"><rect width="100" height="100" fill="white" stroke="black"></rect></g><g transform="translate(1,1)"><path id="input" fill-opacity="0" stroke="black" d="M0,31L7.142857142857142,15L14.285714285714285,26L21.428571428571427,37L28.57142857142857,58L35.714285714285715,42.00000000000001L42.857142857142854,53L50,47L57.14285714285714,63L64.28571428571429,79L71.42857142857143,74L78.57142857142857,69L85.71428571428571,85L92.85714285714286,90L100,95L107.14285714285714,NaNL114.28571428571428,NaNL121.42857142857142,NaNL128.57142857142858,NaNL135.71428571428572,NaNL142.85714285714286,NaNL150,NaNL157.14285714285714,NaNL164.28571428571428,NaNL171.42857142857142,NaNL178.57142857142858,NaNL185.71428571428572,NaNL192.85714285714286,NaNL200,NaNL207.14285714285717,NaNL214.28571428571428,NaNL221.42857142857144,NaNL228.57142857142856,NaNL235.71428571428572,NaNL242.85714285714283,NaNL250,NaNL257.14285714285717,NaNL264.2857142857143,NaNL271.42857142857144,NaNL278.57142857142856,NaNL285.7142857142857,NaNL292.85714285714283,NaNL300,NaNL307.14285714285717,NaNL314.2857142857143,NaNL321.42857142857144,NaNL328.57142857142856,NaNL335.7142857142857,NaNL342.85714285714283,NaNL350,NaNL357.14285714285717,NaNL364.2857142857143,NaNL371.42857142857144,NaNL378.57142857142856,NaNL385.7142857142857,NaNL392.85714285714283,NaNL400,NaNL407.1428571428571,NaNL414.28571428571433,NaNL421.42857142857144,NaNL428.57142857142856,NaNL435.71428571428567,NaNL442.8571428571429,NaNL450,NaNL457.1428571428571,NaNL464.28571428571433,NaNL471.42857142857144,NaNL478.57142857142856,NaNL485.71428571428567,NaNL492.8571428571429,NaNL500,NaNL507.1428571428571,NaNL514.2857142857143,NaNL521.4285714285714,NaNL528.5714285714286,NaNL535.7142857142857,NaNL542.8571428571429,NaNL550,NaNL557.1428571428571,NaNL564.2857142857143,NaNL571.4285714285714,NaNL578.5714285714286,NaNL585.7142857142857,NaNL592.8571428571429,NaNL600,NaNL607.1428571428571,NaNL614.2857142857143,NaNL621.4285714285714,NaNL628.5714285714286,NaNL635.7142857142857,NaNL642.8571428571429,NaNL650,NaNL657.1428571428571,NaNL664.2857142857143,NaNL671.4285714285714,NaNL678.5714285714286,NaNL685.7142857142857,NaNL692.8571428571429,NaNL700,NaNL707.1428571428571,NaN"></path></g></svg>'],
    ['2002']
  ];

  // }}}

  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];

  // Returns a random integer between min and max (inclusive)
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function bimodal(low, high, v) {
    if (Math.random() > 0.5) {
      return v*gaussian() + low;
    }
    return v*gaussian() + high;
  }

  function gaussian() {
    var u = 1 - Math.random(); // Subtraction to flip [0, 1) to (0, 1].
    var v = 1 - Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  }

  var DelayModes = {
    NONE: -1,
    CONSTANT: function() { return 500; },
    CONSTANT_5s: function() { return 5000; },
    CONSTANT_10s: function() { return 10000; },
    // UNIFORM: function() { return getRandomInt(200, 500); },
    // PARETO: function() { return 500; }, // TODO
    BIMODAL: function() { return bimodal(200, 500, 100); },
  }

  var expDelay;

  var BlockingModes = {
    NONE: 0,
    // INPUT: 1, // TODO
    RENDER: 2,
    SERIAL: 3,
    STICKY: 4, //TODO
  };

  var blocking;

  var IndicatorModes = {
    NONE: 0,
    SPINNER: 1,
  };

  var indicator;

  var CorrespondenceModes = {
    NONE: 0,
    LABEL: 1,
    SHOWALL: 2,
  };

  var correspondence;

  var TaskModes = {
    TREND: 0,
    EXTREMA: 1,
    THRESHOLD: 2,
  };

  var taskMode;

  // data
  // {{{
  var TrendModesLong = {
    INCREASING:  [ 5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45, 49, 53, 57, 61, 65, 85, 73, 77, 69  ] ,
    INCREASING_15:  [ 5, 9, 13, 17, 21, 25, 41, 33, 37, 29, 61, 49, 53, 57, 45, 65, 85, 73, 77, 69  ] ,
    INCREASING_30:  [ 17, 9, 13, 5, 21, 25, 37, 33, 29, 41, 53, 49, 65, 73, 61, 45, 85, 57, 77, 69  ] ,
    DECREASING:  [ 69, 77, 73, 85, 65, 61, 57, 53, 49, 45, 41, 37, 33, 29, 25, 21, 17, 13, 9, 5  ] ,
    DECREASING_15:  [ 69, 77, 73, 85, 65, 61, 57, 49, 53, 45, 33, 37, 41, 29, 25, 21, 17, 13, 9, 5  ] ,
    DECREASING_30:  [ 69, 77, 73, 85, 65, 61, 57, 53, 49, 45, 41, 37, 29, 21, 33, 25, 17, 13, 9, 5  ] ,
    UPDOWN:  [ 5, 9, 13, 17, 21, 25, 29, 33, 37, 57, 41, 37, 33, 29, 25, 21, 17, 13, 9, 5  ] ,
    UPDOWN_15:  [ 5, 9, 13, 17, 21, 37, 25, 33, 29, 57, 33, 37, 41, 29, 25, 21, 17, 13, 9, 5  ] ,
    UPDOWN_30:  [ 5, 9, 13, 17, 21, 25, 33, 29, 41, 37, 57, 37, 33, 9, 25, 29, 17, 21, 13, 5  ] ,
    FLAT:  [ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45  ] ,
    FLAT_15:  [ 46, 53, 40, 45, 49, 36, 56, 52, 34, 49, 42, 55, 56, 45, 39, 50, 52, 51, 49, 37  ] ,
    FLAT_30:  [ 50, 48, 62, 28, 54, 61, 67, 25, 37, 56, 44, 25, 33, 67, 37, 47, 42, 58, 60, 41  ] ,
  }


  var TrendModesShort = {
    INCREASING:  [ 5, 10, 15, 21, 26, 31, 37, 42, 47, 53, 58, 63, 85, 74, 69  ] ,
    INCREASING_15:  [ 5, 10, 15, 21, 26, 31, 37, 47, 42, 58, 53, 63, 85, 74, 69  ] ,
    INCREASING_30:  [ 5, 10, 15, 31, 26, 47, 37, 21, 42, 53, 58, 69, 85, 74, 63  ] ,
    DECREASING:  [ 69, 74, 85, 63, 58, 53, 47, 42, 37, 31, 26, 21, 15, 10, 5  ] ,
    DECREASING_15:  [ 85, 74, 69, 53, 58, 63, 47, 42, 21, 31, 26, 37, 15, 10, 5  ] ,
    DECREASING_30:  [ 69, 74, 85, 63, 47, 53, 58, 42, 37, 26, 31, 10, 15, 5, 21  ] ,
    DECREASING_30_2:  [ 69, 85, 74, 63, 42, 58, 47, 53, 37, 21, 26, 31, 15, 10, 5  ] ,
    UPDOWN:  [ 5, 10, 15, 20, 25, 30, 35, 56, 40, 35, 30, 25, 20, 15, 10 ] ,
    UPDOWN_15:  [ 5, 10, 15, 20, 30, 25, 35, 56, 40, 20, 30, 25, 35, 15, 10 ] ,
    UPDOWN_30:  [ 10, 5, 15, 20, 35, 25, 30, 56, 40, 35, 30, 10, 20, 15, 25 ] ,
    FLAT:  [ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45  ] ,
    FLAT_15:  [ 43, 35, 56, 45, 46, 35, 40, 48, 44, 44, 54, 40, 45, 50, 45  ] ,
    FLAT_30: [ 67, 45, 43, 78, 7, 49, 12, 71, 39, 22, 55, 17, 17, 84, 78  ], // actually 50 but for naming convenience
  }

  // }}}

  var TrendModes = TrendModesShort;
  var trends;

  var trainingTrends;

  var trendAnswers;

  var trainingTrendAnswers;

  var years = TrendModes.INCREASING.length;
  var yearStart = 2001;
  var maxIdx = 2;
  var numBars = 5;
  var ixns = {};

  var debug = true;
  if (!debug) {
    console.log = function() {};
  }

  // Experiment state
  var state;

  // Generates initial state of experiment by randomly assigning the worker to
  // a combination of each treatment variable
  function generateInitialState() {
    Math.seedrandom(getUrlParameter('workerId'));
    if (debug) {
      expDelay = DelayModes.NONE;
      blocking = BlockingModes.NONE;
      indicator = IndicatorModes.NONE;
      correspondence = CorrespondenceModes.NONE;
      taskMode = TaskModes.EXTREMA;
    } else {
      var combos = [];
      for (var d of Object.keys(DelayModes)) {
        if (d === 'NONE') { continue; }
        for (var b of Object.keys(BlockingModes)) {
          for (var i of Object.keys(IndicatorModes)) {
            for (var c of Object.keys(CorrespondenceModes)) {
              for (var t of Object.keys(TaskModes)) {
                combos.push({
                  expDelay: d,
                  blocking: b,
                  indicator: i,
                  correspondence: c,
                  taskMode: t,
                });
              }
            }
          }
        }
      }
      console.log(combos);
      var idx = getRandomInt(0, combos.length - 1);
      expDelay = DelayModes[combos[idx].expDelay];
      blocking = BlockingModes[combos[idx].blocking];
      indicator = IndicatorModes[combos[idx].indicator];
      correspondence = CorrespondenceModes[combos[idx].correspondence];
      taskMode = TaskModes[combos[idx].taskMode];
      console.log(idx);
      console.log(combos[idx]);
      gpaas.logData({
        expDelay: combos[idx].expDelay,
        blocking: combos[idx].blocking,
        indicator: combos[idx].indicator,
        correspondence: combos[idx].correspondence,
        taskMode: combos[idx].taskMode,
      });
    }

    trends = shuffle([
      'INCREASING',
      'UPDOWN',
      'DECREASING',
      'FLAT_30'
    ]);

    trainingTrends = [
      'DECREASING_30_2'
    ];

    trendAnswers = shuffle([
      'INCREASING',
      'UPDOWN',
      'DECREASING',
      'FLAT',
      'INCREASING_15',
      'UPDOWN_15',
      'DECREASING_15',
      'FLAT_15',
      'INCREASING_30',
      'UPDOWN_30',
      'DECREASING_30',
      'FLAT_30'
    ]);

    trainingTrendAnswers = shuffle([
      'INCREASING',
      'UPDOWN',
      'DECREASING',
      'FLAT',
      'INCREASING_15',
      'UPDOWN_15',
      'DECREASING_15',
      'FLAT_15',
      'INCREASING_30',
      'UPDOWN_30',
      'DECREASING_30_2',
      'FLAT_30'
    ]);

    // Experiment state
    state = {
      step: Modes.START,
      moneyEarned: 0,
      qualTasksCompleted: 0,
      trainTasksCompleted: 0,
      tasksCompleted: 0,
      invalidInput: false,
      numTrainTasks: trainingTrends.length,
      numTasks: trends.length,
      qualTaskNum: -1,
      trainTaskNum: -1,
      taskNum: -1,
      taskData: [],
      taskStartTime: -1,
      answerStartTime: -1,
      eventLog: [],
      eventId: -1,
      showingInstructions: true,
      acceptingAnswer: false,
      showingAnswer: false,
      input: '',
      params: {
        testFactor: 0,
        usersDelayIdx: 0,
        totalsDelayIdx: 0
      }
    };
  }


  // Fisher-Yates shuffle
  function shuffle(array) {
    var m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }

  function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : sParameterName[1];
      }
    }
  };

/*
 * Experiment lifecycle functions
 */

  // Experiment setup function, returns a setup object
  // refer to gpaas documentation
  function setupExperiment() {
    return {
      name: 'test_experiment',
      task: 'test_task',
      researcher: 'jigsaw',
      numTasks: state.numTasks,
      params: {
        params: [
          {
            name: 'testFactor',
            type: 'UniformChoice',
            options: [0, 1, 2, 3, 4]
          },
          {
            name: 'usersDelayIdx',
            type: 'UniformChoice',
            options: [0]
          },
          {
            name: 'totalsDelayIdx',
            type: 'UniformChoice',
            options: [0]
          }
        ]
      },
      viewTask: viewTask,
      clearTask: clearTask,
      finish: finish,
      trainingTasks: trainingTasks,
    };
  }

  // Update the application state when a new task is loaded
  function viewTask(opt) {
    console.log('task started');
    state.step = Modes.WORK;
    state.moneyEarned = opt.moneyEarned;
    state.tasksCompleted = opt.tasksCompleted;
    state.params = opt.params;
    state.taskNum += 1;
    state.taskData = generateData();
    state.taskStartTime = Date.now();
    state.eventLog = [];
    state.eventId = -1;
    state.showingInstructions = (state.taskNum === 0);
    state.input = '';

    updateView();
  };

  // Called before a task is loaded
  function clearTask(opt) {}

  // Called when all tasks have been submitted,
  // calling opt.submit() will end the HIT
  function finish(opt) {
    if (debug) {
      alert('finished all tasks');
    } else {
      // submit HIT
      opt.submit();
    }
  }

  // Update the application state when a new training task is loaded
  function trainingTask() {
    if (state.step === Modes.START) {
      state.step = Modes.DEMOGRAPHIC;
    } else {
      state.step = Modes.TRAIN;
      state.trainTaskNum += 1;
      state.eventId = -1;
      state.taskData = generateData();
      state.showingInstructions = (state.trainTaskNum === 0);
      state.input = '';
    }
    updateView();
  }
  var trainingTasks = [trainingTask];



  /*
   * UI functions
   */

  // Disables tasks after qualification failure
  function disableTasks() {
    $('#submit').prop('disabled', true);
  }

  // Generates new dataset
  function generateData() {
    function random(i) { return {x: i, y: getRandomInt(5,95) }; }
    function trendFn(i) {
      if (state.step === Modes.TRAIN) {
        return TrendModes[trainingTrends[state.trainTaskNum]][i];
      }
      return TrendModes[trends[state.taskNum]][i];
    }
    function gendata(i) {
      var group = d3.range(numBars).map(random);
      group[maxIdx].y = trendFn(i);
      return group;
    }
    var frames = d3.range(years).map(gendata);
    return frames;
  }


  function drawInplace(data, idx) {
    // get rid of old one
    d3.select(".month_chart").selectAll("*").remove();
    var month_svg = d3.select(".month_chart");
    drawChart(data, idx, month_svg, true);
  }

  function drawAppend(data, idx) {
    // should only draw if new
    // check state for what has been render
    function pred(e) {
      if ((e.event === 'render') && (e.dataIdx === idx)) {
        return true;
      } else {
        return false;
      }
    }
    var rendered = state.eventLog.filter(pred);
    if (rendered.length > 0) {
      // high light the results briefly
      $('#month-chart-'+idx).addClass('highlight');
      setTimeout(function(){
        $('#month-chart-'+idx).removeClass('highlight');
      }, 500);
    } else {
      // create a new div and pass to create
      var month_svg = d3.select('#all-charts-wrapper').append('svg');
      month_svg.attr('id', 'month-chart-'+idx)
               .attr('class', 'temp-chart')
               .attr('width', 200)
               .attr('height', 150);
      drawChart(data, idx, month_svg, false);
    }
  }

  function drawChart(data, idx, month_svg, showAxisLabel) {

    var month_counts = [];
    for (var i = 0; i < months.length; i++) {
      month_counts.push({
        name: months[i],
        count: data[idx][i].y
      });
    }

    var margin = {top: 20, right: 30, bottom: 50, left: 70},
        month_width = month_svg.attr("width") - margin.left - margin.right,
        month_height = month_svg.attr("height") - margin.top - margin.bottom;

    var x_month = d3.scaleBand()
                    .domain(months)
                    .rangeRound([0, month_width])
                    .padding(0.1);

    var y_month = d3.scaleLinear()
                    .domain([0, 100])
                    .rangeRound([month_height, 0]);

    var g_month = month_svg.append("g")
                           .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    g_month.append("g")
           .attr("class", "axis axis--x")
           .attr("transform", "translate(0," + month_height + ")")
           .call(d3.axisBottom(x_month));

    month_svg.append("text")
             .attr("y", margin.top - 10)
             .attr("x", (month_width + margin.left + margin.right) / 2)
             .attr("text-anchor", "middle")
             .text(idx+yearStart);
    if (showAxisLabel) {
      month_svg.append("text")
               .attr("y", month_height + margin.top + margin.bottom - 14)
               .attr("x", (month_width + margin.left + margin.right) / 2)
               .attr("text-anchor", "middle")
               .text("Month");

      month_svg.append("text")
               .attr("transform", "rotate(-90)")
               .attr("y", 35)
               .attr("text-anchor", "middle")
               .attr("x", -(month_height + 40) / 2)
               .text("Number of users");
    }
    g_month.append("g")
           .attr("class", "axis axis--y")
           .call(d3.axisLeft(y_month));

    var bar = g_month.append("g")
                     .attr("class", "bar")
                     .selectAll("rect")
                     .data(month_counts)
                     .enter()
                     .append("rect")
                     .attr("class", function(d, i) { return i === maxIdx ? 'bar highlight' : 'bar'; })
                     .attr("x", function(d) {return x_month(d.name); })
                     .attr("y", function(d) {return y_month(d.count); })
                     .attr("width", x_month.bandwidth())
                     .attr("height", function(d) {
                       return month_height - y_month(d.count); });

    if (indicator === IndicatorModes.SPINNER && id !== 0) {
        if (blocking === BlockingModes.RENDER) {
          d3.select('.month-chart-wrapper').attr('class', 'month-chart-wrapper');
        } else if (blocking === BlockingModes.INPUT || blocking === BlockingModes.SERIAL || blocking === BlockingModes.NONE) {
          var requests = state.eventLog.filter(function(e) { return e.event === 'slide'; }).length;
          var rendered = state.eventLog.filter(function(e) { return e.event === 'render'; }).length;
          if (requests === rendered) {
            d3.select('.month-chart-wrapper').attr('class', 'month-chart-wrapper');
          }
        }
      }

  }

  function renderDataSelection(data, idx, delay) {
    var tid = null;
    var id = ++state.eventId;
    if (id !== 0) {
      state.eventLog.push({event: 'slide', id: id, dataIdx: idx, ts: Date.now()});
      if (indicator === IndicatorModes.SPINNER) {
        d3.select('.month-chart-wrapper').attr('class', 'month-chart-wrapper spinner');
      }
    }

    function checkSerial(id, idx) {
      var persist = 2000;
      // only render if its the most immediate
      // check eventLog
      var rendered = state.eventLog.filter(function(e) { return e.event === 'render'; });
      var received = state.eventLog.filter(function(e) { return e.event === 'received'; });
      var lastRendered = rendered.slice(-1).pop();

      if (id === lastRendered.id + 1) {
        var timeDiff = Date.now() - lastRendered.ts
        if ( timeDiff < persist) {
          // cannot render, schedule for later
          setTimeout(function(){render(id, idx)}, persist - timeDiff);
          return false;
        }
        // check last received
        var receivedNext = received.filter(function(e) { return e.id === id + 1 });
        if (receivedNext[0]) {
          setTimeout(function(){render(receivedNext[0].id, receivedNext[0].dataIdx)}, persist);
        }
        return true;
      }
      return false;
    }

    function render(id, idx) {
      delete ixns[tid];
      if (blocking === BlockingModes.RENDER && id !== 0 && state.eventId !== id) {
        state.eventLog.push({event: 'blockedRender', id: id, dataIdx: idx, ts: Date.now()});
        return;
      }

      // TODO verify that the eventId is only triggered by sliding
      if (blocking === BlockingModes.SERIAL && id !== 0) {
        console.log('in serial checking', id, yearStart + idx);
        state.eventLog.push({event: 'received', id: id, dataIdx: idx, ts: Date.now()});

        if (!checkSerial(id, idx)) {
          console.log('not serial', id, yearStart + idx);
          return;
        } else {
          console.log('rendering', id, yearStart + idx, '@', parseInt(Date.now()/1000) % 1000);
        }
      }

      if (blocking === BlockingModes.INPUT) {
        $('#slider').slider('enable');
      }

      // label
      if (correspondence === CorrespondenceModes.LABEL) {
        var year = yearStart + idx;
        d3.select("#current-month").text('Showing: '+ year);
      }

      if (correspondence === CorrespondenceModes.SHOWALL) {
        drawAppend(data, idx);
      }
      drawInplace(data, idx);

      state.eventLog.push({event: 'render', id: id, dataIdx: idx, ts: Date.now()});
    }

    if (delay !== DelayModes.NONE) {
      tid = setTimeout(function(){render(id, idx)}, delay());
      ixns[tid] = true;
    } else {
      render(id, idx);
    }
  }

  // Cleans up viz by removing any outstanding interaction requests
  function clearIxns() {
    for (var tid of Object.keys(ixns)) {
      clearTimeout(tid);
      delete ixns[tid];
    }
    // remove spinner
    if (indicator === IndicatorModes.SPINNER) {
      d3.select('.month-chart-wrapper').attr('class', 'month-chart-wrapper');
    }
    state.eventId = -1;
  }

  // Updates the viz shown to the worker with random data
  // step is the mode of the experiment e.g. qualification or normal task
  // the delay functions determine the latency of a brushing action
  function updateViz(data, step, delay) {
    clearIxns();

    var val = 0;
    $('#slider-value').text(yearStart + val);
    $('#slider').slider({
      min: val,
      max: years - 1,
      value: val,
      slide: function(event, ui) {
        var year = yearStart + ui.value;
        $('#slider-value').text(year);
        if (blocking === BlockingModes.INPUT) {
          $(this).slider('disable');
        }
        renderDataSelection(data, ui.value, expDelay);
      }
    });

    renderDataSelection(data, val, DelayModes.NONE);
    // hack
    d3.select("#all-charts-wrapper").selectAll("*").remove();
  }

  function showTrend(trendIdx) {
    var answers = state.step === Modes.TRAIN ? trainingTrendAnswers : trendAnswers;
    function trend(i) {
      return {x: i, y: TrendModes[answers[trendIdx]][i]};
    }

    var width = height = 100;
    var trend_svg = d3.select('.trend-input-wrapper')
                      .append('div')
                      .attr('class', 'trend-input')
                      .attr('data-trend', answers[trendIdx])
                      .append('svg')
                      .attr('width', width + 2)
                      .attr('height', height + 2);
    trend_svg.append('g')
             .attr('transform', 'translate(1,1)')
             .append('rect')
             .attr('width', width)
             .attr('height', height)
             .attr('fill', 'white')
             .attr('stroke', 'black');
    var trendyscale = d3.scaleLinear()
                        .domain([0, height])
                        .range([height, 0]);
    var trendy = function(d) { return trendyscale(d.y); };
    var trendxscale = d3.scaleLinear()
                              .domain([0, years-1])
                              .range([0, width]);
    var trendx = function(d) { return trendxscale(d.x); };
    var lineContainer = trend_svg.append('g').attr('transform', 'translate(1,1)');
    line = d3.line().x(trendx).y(trendy);
    path = lineContainer.append("path")
                        .attr('id', 'input')
                        .attr('fill-opacity', 0.0)
                        .attr('stroke', 'black');
    pathData = d3.range(width).map(trend);
    path.datum(pathData)
        .attr("d", line);

    $('.trend-input').click(function() {
      $('.trend-input.selected').removeClass('selected');
      $(this).addClass('selected');
    });
  }

  // Updates the input according to the type of task being performed
  function updateInput(step, qualTaskNum) {
    if (step === Modes.QUAL) {
      if (qualTaskNum === 0) {
        $('#input').html('<label><input type="radio" name="qual" value="2"> 2</label><br> \
                          <label><input type="radio" name="qual" value="6"> 6</label><br> \
                          <label><input type="radio" name="qual" value="14"> 14</label><br>');
      } else if (qualTaskNum === 1) {
        $('#input').html('<label><input type="radio" name="qual" value="34"> 34</label><br> \
                          <label><input type="radio" name="qual" value="128"> 128</label><br> \
                          <label><input type="radio" name="qual" value="200"> 200</label><br>');
      }
    } else {
      if (taskMode === TaskModes.TREND) {
        // show a multiple choice trend input
        $('#input').html('<div class="trend-input-wrapper"></div>');
        for (var i = 0; i < trendAnswers.length; i++) {
          showTrend(i);
        }
        if (state.input !== '') {
          $('.trend-input[data-trend="' + state.input + '"]').addClass('selected');
        }
      } else {
        // show a text box
        $('#input').html('<label for="answer-input">Your answer: </label><input id="answer-input" name="task" type="text" value="' + state.input + '">');
      }
    }
  }

  // Updates the question according to the type of task and whether the
  // UI is accepting answers or not
  function updateQuestion(taskMode, acceptingAnswer) {
    var question = '';
    if (taskMode === TaskModes.TREND) {
      if (acceptingAnswer) {
        question = 'Which graph best corresponds to the trend of the height of the highlighted bar over time? ' +
                   'Click on the graph to select it, and click the "Submit task" button below to submit your answer.';
      } else {
        question = 'What is the trend of the height of the highlighted bar over time? ' +
                   'Click on the "Continue" button below to select an answer. ' +
                   'Note that you may view the visualization, but not interact with it when selecting your answer.';
      }
    } else {
      if (acceptingAnswer) {
        question = 'For which year did the highlighted bar reach its maximum height? ' +
                   'Write your answer in the text box, and click the "Submit task" button below to submit your answer. ' +
                   'Your answer should be within the range ' + yearStart + '-' + (yearStart + years - 1) + '.';
      } else {
        question = 'For which year did the highlighted bar reach its maximum height? ' +
                   'Click on the "Continue" button below to write your answer. ' +
                   'Note that you may view the visualization, but not interact with it when writing your answer.';
      }
    }
    return question;
  }

  // Updates the UI view given a new state
  function updateView() {
    console.log(state);
    $('.step').removeClass('current');
    if (state.step === Modes.START) {
      $('#step-0').addClass('current');
      return;
    } else if (state.step === Modes.DEMOGRAPHIC) {
      $('#step-5').addClass('current');
      return;
    } else if (state.step === Modes.USABILITY) {
      $('#step-4').addClass('current');
      return;
    } else {
      $('#step-123').addClass('current');
      // get rid of the cumulated view
      d3.select("#all-charts-wrapper").selectAll("*").remove();
      if (state.showingInstructions) {
        $('#step-' + state.step + '-instructions').addClass('current');
        $('.task-wrapper').addClass('hidden');
        $('#instruction-buttons').removeClass('hidden');
        $('#task-buttons').addClass('hidden');
        if (state.step === Modes.WORK) {
          $('#viz').addClass('hidden');
        } else {
          $('#viz').removeClass('hidden');
        }
      } else {
        $('.task-wrapper').removeClass('hidden');
        $('#instruction-buttons').addClass('hidden');
        $('#task-buttons').removeClass('hidden');
        $('#viz').removeClass('hidden');
        $('#slider').slider('option', 'disabled', false);
      }
    }
    $('#money').text(state.moneyEarned.toFixed(2));

    if (state.acceptingAnswer) {
      // $('#viz').addClass('hidden');
      $('#slider').slider('option', 'disabled', true);
      $('#question-wrapper').removeClass('hidden');
      $('#answer').addClass('hidden');
      if (state.step === Modes.TRAIN && state.showingAnswer) {
        $('#submit').addClass('hidden');
        $('#continue').removeClass('hidden');
        $('#correct').removeClass('hidden');
        $('#correct').html('Correct answer: ' + trainAnswers[taskMode][state.trainTaskNum]);
      } else {
        $('#submit').removeClass('hidden');
        $('#correct').addClass('hidden');
      }
      updateInput(state.step, state.qualTaskNum);
    } else {
      $('#question-wrapper').addClass('hidden');
      $('#answer').removeClass('hidden');
      $('#submit').addClass('hidden');
    }

    var taskTypeTitle;
    var taskType;
    var tasksCompleted;
    var totalTasks;
    var question;
    var taskData;
    if (state.step === Modes.QUAL) {
      taskTypeTitle = 'Qualification Task';
      taskType = 'Qualification tasks';
      tasksCompleted = state.qualTaskNum;
      totalTasks = state.numQualTasks;
      question = updateQuestion(taskMode, state.acceptingAnswer);
    } else if (state.step === Modes.TRAIN) {
      taskTypeTitle = 'Training Task';
      taskType = 'Training tasks';
      tasksCompleted = state.trainTaskNum;
      totalTasks = state.numTrainTasks;
      question = updateQuestion(taskMode, state.acceptingAnswer);
    } else if (state.step === Modes.WORK) {
      taskTypeTitle = 'Task';
      taskType = 'Tasks';
      tasksCompleted = state.taskNum;
      totalTasks = state.numTasks;
      question = updateQuestion(taskMode, state.acceptingAnswer);
      $('#continue').addClass('hidden');
      $('#reward, #cancel').removeClass('hidden');
      if (state.taskNum > 0) {
        $('#cancel').prop('disabled', false);
      }
    }
    $('#task-type-title').text(taskTypeTitle);
    $('#task-type').text(taskType);
    $('#tasks').text(tasksCompleted);
    $('#current-task-num').text(tasksCompleted + 1);
    $('#total-tasks').text(totalTasks);
    $('#question').text(question);
    if (state.invalidInput) {
      $('#invalid').removeClass('hidden');
    } else {
      if (state.step === Modes.TRAIN && state.showingInstructions) {
        taskData = instructionalData;
      } else {
        taskData = state.taskData;
      }
      if (!state.acceptingAnswer) {
        updateViz(taskData, state.step, expDelay);
      }
      $('#invalid').addClass('hidden');
    }
  }

  // Performs user input validation
  function isValid(input, taskMode) {
    var notEmpty = (input != null && input !== '');
    if (taskMode === TaskModes.EXTREMA && notEmpty) {
      var val = parseInt(input, 10);
      if (isNaN(val)) {
        return false;
      }
      return (yearStart <= val && val <= yearStart + years - 1);
    }
    return notEmpty;
  }

  function evaluateAnswer(taskNum) {
    if (taskMode === TaskModes.TREND) {
      return trends[taskNum];
    } else if (taskMode === TaskModes.EXTREMA) {
      var a = TrendModes[trends[taskNum]];
      return '' + (yearStart + a.indexOf(Math.max.apply(null, a)));
    }
    return '';
  }

  // Submits the current qualification task
  // Happens after the value has been validated
  function submitQualTask(value, qualTaskNum) {
    var success = (value === qualAnswers[qualTaskNum]);
    gpaas.nextQualification(success);
  }

  // Submits the current training task
  // Happens after the value has been validated
  function submitTrainTask(value, trainTaskNum) {
    if (taskMode === TaskModes.EXTREMA) {
      var a = TrendModes[trainingTrends[state.trainTaskNum]];
      var answer = '' + (yearStart + a.indexOf(Math.max.apply(null, a)));
      trainAnswers[taskMode][state.trainTaskNum] = answer;
    }
    console.log('user submitted ' + value);
    console.log('correct answer was ' + answer);
    state.showingAnswer = true;
    updateView();
  }

  // Submits the current normal task (i.e. not a qual or training task)
  // Happens after the value has been validated
  function submitNormalTask(value, taskNum, taskStartTime, answerStartTime, eventLog) {
    log = {
      taskNum: taskNum,
      trend: trends[taskNum],
      response: value,
      vizTime: answerStartTime - taskStartTime,
      answerTime: Date.now() - answerStartTime,
      expected: evaluateAnswer(taskNum),
      eventLog: eventLog,
    };
    console.log(log)
    gpaas.logData(log);
    if (taskNum === state.numTasks - 1) {
      state.step = Modes.USABILITY;
      updateView();
    } else {
      gpaas.nextTask();
    }
  }

  // Worker submits current task, loads next one if another task exists,
  // otherwise ends the experiment with all tasks completed
  function submitTask() {
    console.log('task submitted');
    var value;
    if (state.step === Modes.QUAL) {
      value = $('input[name="qual"]:checked').val();
    } else if (taskMode === TaskModes.TREND) {
      value = $('.trend-input.selected').data('trend');
    } else {
      value = $('input[name="task"]').val();
    }
    console.log('testValue:', value);
    state.input = value;
    state.invalidInput = !isValid(value, taskMode);
    if (!state.invalidInput) {
      if (state.step === Modes.QUAL) {
        submitQualTask(value, state.qualTaskNum);
      } else if (state.step === Modes.TRAIN) {
        submitTrainTask(value, state.trainTaskNum);
      } else if (state.step === Modes.WORK) {
        state.acceptingAnswer = false;
        submitNormalTask(value, state.taskNum, state.taskStartTime, state.answerStartTime, state.eventLog);
      }
    } else {
      updateView();
    }
  }

  // Submits demographic survey data at beginning of experiment
  function submitDemographic() {
    var data = {
      age: $('#age').val(),
      gender: $('#gender').val(),
      education: $('#education').val(),
      occupation: $('#occupation').val(),
      computer: $('input[name="computer-usage"]:checked').val(),
      viz: $('input[name="visualization-exp"]:checked').val(),
    };
    console.log(data);
    gpaas.logData(data);
    trainingTask();
  }

  function submitUsability() {
    var data = {
      confidence: $('input[name="confidence"]:checked').val(),
      usability: $('input[name="usability"]:checked').val(),
      difficulty: $('input[name="difficulty"]:checked').val(),
      comments: $('#comments').val(),
    };
    console.log(data);
    if (data.confidence == null || data.usability == null || data.difficulty == null) {
      $('#invalid-survey').removeClass('hidden');
    } else {
      gpaas.logData(data);
      gpaas.nextTask();
    }
  }

  // Removes instructions and shows first task
  function showTask() {
    state.showingInstructions = false;
    state.taskStartTime = Date.now();
    updateView();
  }

  // Removes visualization from UI and shows an input for the question
  function showAnswerInput() {
    state.acceptingAnswer = true;
    state.answerStartTime = Date.now();
    clearIxns();
    updateView();
  }

  // Loads the next training task
  function nextTrainingTask() {
    state.acceptingAnswer = false;
    state.showingAnswer = false;
    gpaas.nextTraining();
  }

  // Worker can end experiment without completing all tasks
  function endExperiment() {
    var msg = 'Are you sure you want to exit the HIT? You will only be paid ' +
              '$' + state.moneyEarned + ' if you exit right now.';
    if (confirm(msg)) {
      gpaas.cancelTasks();
    }
  }

  // Register start button handler on DOM load
  $(function() {
    generateInitialState();
    console.log(state);
    // Start experiment once worker has acknowledged consent to participate
    $('button#start').click(function() {
      e = gpaas.startExperiment(setupExperiment);
      if (e.setupSuccessful) {
        $('button#submit').click(submitTask);
        $('button#submit-demographic').click(submitDemographic);
        $('button#submit-usability').click(submitUsability);
        $('button#answer').click(showAnswerInput);
        $('button#next').click(showTask);
        $('button#continue').click(nextTrainingTask);
        $('button#cancel').click(endExperiment);
        // e.run();
      }
      // } else {
      //   alert('Unable to start experiment! Refresh the page, and try again.');
      // }
    });

    // FOR TESTING PURPOSES ONLY:
    if (debug) {
      $('#configs').removeClass('hidden');
      $('#indicator-config').change(function() { indicator = IndicatorModes[this.value]; });
      $('#blocking-config').change(function() { blocking = BlockingModes[this.value]; });
      $('#delay-config').change(function() { expDelay = DelayModes[this.value]; });
      $('#correspondence-config').change(function() { correspondence = CorrespondenceModes[this.value]; });
      $('#task-config').change(function() { taskMode = TaskModes[this.value]; });
    }
  });

})();
