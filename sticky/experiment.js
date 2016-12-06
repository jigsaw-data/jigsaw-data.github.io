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

  var expDelay;

  var BlockingModes = {
    // NONE: 0,
    // INPUT: 1, // TODO
    // RENDER: 2,
    // SERIAL: 3,
    STICKY: 4, //TODO
  };

  var blocking;

  var IndicatorModes = {
    // NONE: 0,
    SPINNER: 1,
  };

  var indicator;

  var CorrespondenceModes = {
    // NONE: 0,
    LABEL: 1,
    // SHOWALL: 2,
  };

  var correspondence;

  var TaskModes = {
    // TREND: 0,
    EXTREMA: 1,
    THRESHOLD: 2,
  };

  var dataMode;
  var DataModes = {
    CANNED: 0,
    // RANDOM: 1,
  };

  var taskMode;

  var widgetMode;
  var WidgetModes = {
    SLIDER: 0,
    // MAP: 1,
    // INPLACEMAP: 2, // currently only compability with extrema task and no spinner or label are needed
  };


  // data
  // {{{
  var DelayModes = {
    NONE: -1,
    CONSTANT: function() { return 500; },
    CONSTANT_1: function() { return 1000; },
    CONSTANT_3: function() { return 3000; },
    CONSTANT_5: function() { return 5000; },
    UNIFORM: function() { return getRandomInt(0, 500); },
    UNIFORM_1: function() { return getRandomInt(0, 1000); },
    UNIFORM_3: function() { return getRandomInt(0, 3000); },
    UNIFORM_5: function() { return getRandomInt(0, 5000); },
    // BIMODAL: function() { return bimodal(200, 500, 100); },
  }

  var DelayModesData = {
    NONE: [ 45, 20, 25, 29, 20, 46, 7, 14, 26, 27, 5, 25, 35, 57, 27, 23, 41  ],
    CONSTANT: [ 9, 12, 59, 39, 17, 39, 48, 18, 36, 48, 44, 49, 34, 46, 20, 33, 9  ],
    CONSTANT_1: [ 5, 27, 40, 37, 30, 32, 23, 16, 31, 31, 11, 39, 43, 34, 12, 12, 57  ],
    CONSTANT_3: [ 67, 21, 13, 66, 49, 52, 59, 71, 54, 53, 7, 12, 42, 9, 86, 49, 56  ],
    CONSTANT_5: [ 44, 9, 26, 51, 18, 18, 17, 47, 37, 63, 29, 41, 5, 36, 10, 29, 8  ],
    UNIFORM: [ 12, 71, 25, 54, 71, 31, 11, 86, 32, 25, 38, 27, 70, 17, 31, 43, 36  ],
    UNIFORM_1: [ 18, 60, 47, 21, 14, 27, 34, 47, 14, 73, 41, 45, 86, 7, 48, 31, 76  ],
    UNIFORM_3: [ 14, 16, 23, 35, 76, 27, 22, 90, 61, 37, 50, 27, 74, 73, 39, 27, 11  ],
    UNIFORM_5: [ 27, 63, 26, 28, 72, 47, 61, 61, 55, 86, 10, 19, 18, 20, 32, 15, 37  ],
  };

  var InstructionDelayModesData = {
    NONE: [ 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85 ],
    CONSTANT: [ 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85 ],
    UNIFORM_3: [ 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85 ]
  };

  var TrainingDelayModesData = {
    NONE:      [ 11, 39, 45, 24, 11, 32, 7, 66, 54, 21, 29, 24, 11, 51, 8, 46, 19  ],
    CONSTANT:  [ 63, 67, 38, 61, 34, 73, 88, 70, 13, 63, 46, 56, 21, 42, 31, 70, 48  ],
    UNIFORM_3: [ 70, 40, 10, 61, 61, 70, 41, 18, 60, 85, 34, 47, 62, 20, 55, 62, 28  ],
  }

  // }}}

  var statesIndex = ["AZ", "CA", "CO", "ID", "KS", "MT", "ND", "NE", "NM", "NV", "OK", "OR", "SD", "TX", "UT", "WA", "WY"];
  var trends;

  var trainingTrends;

  var delays;
  var trainingDelays;

  var trendAnswers;

  var trainingTrendAnswers;

  var years = DelayModesData.NONE.length;
  var yearStart = 1999;
  var trackIdx = 2;
  var numBars = 5;
  var ixns = {};
  var renderQueue = [];
  var thresholdValue = 80;
  var extremaDiff = 10;

  var debug = false;
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
      // expDelay = DelayModes.NONE;
      blocking = BlockingModes.NONE;
      indicator = IndicatorModes.NONE;
      correspondence = CorrespondenceModes.NONE;
      taskMode = TaskModes.THRESHOLD;
      dataMode = DataModes.CANNED;
      widgetMode = WidgetModes.SLIDER;
    } else {
      var combos = [];
      for (var w of Object.keys(WidgetModes)) {
        for (var b of Object.keys(BlockingModes)) {
          for (var i of Object.keys(IndicatorModes)) {
            for (var c of Object.keys(CorrespondenceModes)) {
              for (var t of Object.keys(TaskModes)) {
                for (var dm of Object.keys(DataModes)) {
                  combos.push({
                    widgetMode: w,
                    blocking: b,
                    indicator: i,
                    correspondence: c,
                    taskMode: t,
                    dataMode: dm,
                  });
                }
              }
            }
          }
        }
      }
      console.log(combos);
      var idx = getRandomInt(0, combos.length - 1);
      // expDelay = DelayModes[combos[idx].expDelay];
      blocking = BlockingModes[combos[idx].blocking];
      indicator = IndicatorModes[combos[idx].indicator];
      correspondence = CorrespondenceModes[combos[idx].correspondence];
      taskMode = TaskModes[combos[idx].taskMode];
      dataMode = DataModes[combos[idx].dataMode];
      widgetMode = WidgetModes[combos[idx].widgetMode];
      console.log(idx);
      console.log(combos[idx]);
      gpaas.logData({
        type: 'CONFIG',
        // expDelay: combos[idx].expDelay,
        blocking: combos[idx].blocking,
        indicator: combos[idx].indicator,
        correspondence: combos[idx].correspondence,
        taskMode: combos[idx].taskMode,
        dataMode: combos[idx].dataMode,
        widgetMode: combos[idx].widgetMode,
      });
    }

    delays = shuffle(Object.keys(DelayModes));
    console.log(delays);

    trainingDelays = [
      'NONE',
      'CONSTANT',
      'UNIFORM_3'
    ];

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
      // numTrainTasks: trainingTrends.length,
      // numTasks: trends.length, // NOTE: swap trends with canned data
      numTrainTasks: trainingDelays.length,
      numTasks: delays.length,
      instructionsTaskNum: -1,
      qualTaskNum: -1,
      trainTaskNum: -1,
      taskNum: -1,
      taskData: [],
      taskStartTime: -1,
      answerStartTime: -1,
      eventLog: [],
      barData: [],
      eventId: -1,
      showingInstructions: true,
      acceptingAnswer: false,
      showingAnswer: false,
      input: '',
      params: {
        testFactor: 0,
        usersDelayIdx: 0,
        totalsDelayIdx: 0
      },
      currentMapPos: 'AZ',
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
      name: 'sticky_trial',
      task: 'sticky_trial_task',
      researcher: 'jigsaw',
      numTasks: state.numTasks,
      params: {
        params: [
          {
            name: 'testFactor',
            type: 'UniformChoice',
            options: [0] // note: not sure why this was changed. prob dont matter
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
    expDelay = DelayModes[delays[state.taskNum]];

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
      state.instructionsTaskNum += 1;
    } else {
      state.step = Modes.TRAIN;
      state.trainTaskNum += 1;
      state.eventId = -1;
      state.taskStartTime = Date.now();
      state.eventLog = [];
      state.showingInstructions = (state.trainTaskNum === 0);
      state.taskData = generateData();
      state.input = '';
      expDelay = DelayModes[trainingDelays[state.trainTaskNum]];
    }
    updateView();
  }
  var trainingTasks = [trainingTask, trainingTask, trainingTask];



  /*
   * UI functions
   */

  // Disables tasks after qualification failure
  function disableTasks() {
    $('#submit').prop('disabled', true);
  }

  function generateRandomBarValues(years, thresholdValue) {

    var controlledNums = Array.apply(null, Array(years)).map(Number.prototype.valueOf,0);
    var extremaPos = getRandomInt(1, years - 1);
    var maxVal;
    // equal likelihood to cross threshold
    if (Math.random() < 0.5) {
      // cross threshold
      maxVal = getRandomInt(thresholdValue + 5, thresholdValue + 10);
    } else {
      // dont cross threshold
      maxVal = getRandomInt(50, thresholdValue - 5);
    }
    controlledNums[extremaPos] = maxVal;
    // now generate everything that's 10 below max val
    for (var i = 0; i < years; i++) {
      if (i != extremaPos) {
        controlledNums[i] = getRandomInt(5, maxVal - 10);
      }
    }
    return controlledNums;
  }

  // Generates new dataset
  function generateData() {
    function random(i) { return {x: i, y: getRandomInt(5,95) }; }

    var controlledNums = [];
    if (state.step === Modes.TRAIN) {
      if (state.showingInstructions && state.instructionsTaskNum <= 2) {
        controlledNums = InstructionDelayModesData[trainingDelays[state.instructionsTaskNum]];
      } else {
        controlledNums = TrainingDelayModesData[trainingDelays[state.trainTaskNum]];
      }
    } else if (dataMode === DataModes.CANNED) {
      controlledNums = DelayModesData[delays[state.taskNum]];
    } else {
      controlledNums = generateRandomBarValues(years, thresholdValue);
    }

    state.barData = controlledNums;
    function getControlledNums(i) {
      return controlledNums[i];
    }

    function gendata(i) {
      var group = d3.range(numBars).map(random);
      group[trackIdx].y = getControlledNums(i);
      return group;
    }
    var frames = d3.range(years).map(gendata);
    console.log('years', years);
    return frames;
  }


  function drawInMap(data, idx) {
    // color the selected region
    var name = statesIndex[idx];
    var val = data[idx][trackIdx].y
    // get rid of spinner
    $('#'+name).removeClass('inplace-spinner');
    var cVal = parseInt((100-val) * 0.4) + 50;
    var color = 'hsl(0, 80%, ' + cVal +'%)';
    $('#'+name).css("fill", color);

    d3.select('#'+name+'-val').attr('visibility', 'visible');
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

  function tryHighlightExistingChart(idx) {
    $('#month-chart-'+idx).addClass('highlight');
    setTimeout(function(){
      $('#month-chart-'+idx).removeClass('highlight');
    }, 500);
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

    if (correspondence === CorrespondenceModes.SHOWALL) {
      month_svg.append("text")
             .attr("y", margin.top - 10)
             .attr("x", (month_width + margin.left + margin.right) / 2)
             .attr("text-anchor", "middle")
             .text(idx+yearStart);
    }
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

    if (taskMode === TaskModes.THRESHOLD) {
      g_month.append("svg:line")
        .attr("x1", 0)
        .attr("x2", month_width)
        .attr("y1", y_month(thresholdValue))
        .attr("y2", y_month(thresholdValue))
        .style("stroke", "rgb(189, 189, 189)");
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
                     .attr("class", function(d, i) { return i === trackIdx ? 'bar highlight' : 'bar'; })
                     .attr("x", function(d) {return x_month(d.name); })
                     .attr("y", function(d) {return y_month(d.count); })
                     .attr("width", x_month.bandwidth())
                     .attr("height", function(d) {
                       return month_height - y_month(d.count); });

  }

  function renderDataSelection(data, idx, delay) {
    var tid = null;
    var persist = 500;
    var id = ++state.eventId;
    if (id !== 0) {
      state.eventLog.push({event: 'slide', id: id, dataIdx: idx, ts: Date.now()});
      if (indicator === IndicatorModes.SPINNER) {
        d3.select('.month-chart-wrapper').attr('class', 'month-chart-wrapper spinner');
      }
    }

    // a bit hacky; dont need to check anything because if the chart is there, then highlight,
    // if not, it wont work
    // needed because the render call is triggered after delay but this could happen soon
    tryHighlightExistingChart(idx);

    function checkSticky(id, idx) {
      // stickiness basically ensures that new frames don't flash
      // we check if this is the first element in the render queue, and if
      // so we pop it and render, otherwise push it on if there are others
      // in the queue
      // if there is nothing in the queue, we still need to check if the
      // last render happened beyond the persist timeframe, if it didn't
      // then we push this to the render queue, otherwise render immediately
      if (renderQueue.length > 0) {
        if (renderQueue[0].id === id) {
          renderQueue.shift();
          return true;
        }
        renderQueue.push({id: id, idx: idx});
        return false;
      }
      var rendered = state.eventLog.filter(function(e) { return e.event === 'render'; });
      var lastRendered = rendered.slice(-1).pop();
      var timeDiff = Date.now() - lastRendered.ts;
      if (timeDiff < persist) {
        renderQueue.push({id: id, idx: idx});
        return false;
      }
      return true;
    }

    function checkSerial(id, idx) {
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
        state.eventLog.push({event: 'received', id: id, dataIdx: idx, ts: Date.now()});

        if (!checkSerial(id, idx)) {
          return;
        } else {
          console.log('rendering', id, yearStart + idx, '@', parseInt(Date.now()/1000) % 1000);
        }
      }

      if (blocking === BlockingModes.STICKY && id !== 0) {
        if (!checkSticky(id, idx)) {
          return;
        }
      }

      if (blocking === BlockingModes.INPUT) {
        $('#slider').slider('enable');
      }

      // label
      if (correspondence === CorrespondenceModes.LABEL) {
        var text;
        if (widgetMode === WidgetModes.SLIDER) {
          text = yearStart + idx;
        } else {
          text = statesIndex[idx];
        }
        d3.select("#current-month").text('Showing: '+ text);
      }

      // spinner
      if (indicator === IndicatorModes.SPINNER && id !== 0) {
        if (blocking === BlockingModes.RENDER) {
          d3.select('.month-chart-wrapper').attr('class', 'month-chart-wrapper');
        } else if (blocking === BlockingModes.INPUT || blocking === BlockingModes.STICKY || blocking === BlockingModes.SERIAL || blocking === BlockingModes.NONE) {
          var requests = state.eventLog.filter(function(e) { return e.event === 'slide'; }).length;
          var rendered = state.eventLog.filter(function(e) { return e.event === 'render'; }).length;
          if (requests === rendered) {
            d3.select('.month-chart-wrapper').attr('class', 'month-chart-wrapper');
          }
        }
      }

      // actual charts
      if (correspondence === CorrespondenceModes.SHOWALL) {
        drawAppend(data, idx);
      }
      if (widgetMode === WidgetModes.INPLACEMAP) {
        drawInMap(data, idx);
      } else {
        drawInplace(data, idx);
      }

      state.eventLog.push({event: 'render', id: id, dataIdx: idx, ts: Date.now()});

      if (blocking === BlockingModes.STICKY) {
        setTimeout(function() {
          if (renderQueue.length > 0) {
            var next = renderQueue[0];
            render(next.id, next.idx);
          }
        }, persist);
      }
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
    renderQueue = [];
  }

  // note: no longer useful; kept just in case
  function inplaceAllLoaded() {
    for (var i = 0; i < statesIndex.length; i++) {
      if ($('#'+statesIndex[i]+'-val').attr('visibility') === 'hidden') {
        return false;
      }
    }
    return true;
  }

  function drawMap(data) {
    // code taken from http://bl.ocks.org/mapsam/6083585
    if ($('#map-widget').length) {
      // might need some reset logic in the future
      d3.select("#map-widget").remove();
    }

    if (widgetMode !== WidgetModes.INPLACEMAP) {
      $('#state-name').html('AZ');
      state.currentMapPos = 'AZ';
    } else {
      $('#state-name').html('&nbsp');
      state.currentMapPos = '&nbsp';
    }
    var width = 260,
        height = 200;

    var svg = d3.select('#map-wrapper').append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('id', 'map-widget');

    var projection = d3.geoAlbersUsa() //geo.albersUsa()
        .scale(600)
        .translate([width, height / 1.5]);

    var path = d3.geoPath()
        .projection(projection);

    // need to have a mapping of states to years
    d3.json('us.json', function(error, us) {
        var features = topojson.feature(us, us.objects.usStates).features;
        svg.selectAll('.states')
            .data(features)
            .enter()
            .append('path')
            .attr('class', 'states')
            .attr('id', function(d) {return d.properties.STATE_ABBR})
            .attr('d', path)
            .on('mouseover', function(d){
              var name = d.properties.STATE_ABBR;
              state.currentMapPos = name;
              if (name != 'MN') {
                // trigger request
                var yearIdx = statesIndex.indexOf(name);
                // persist the coloring and clear out the previous coloring
                $('#state-name').html(name);
                if (widgetMode === WidgetModes.INPLACEMAP) {
                  if ($('#'+name+'-val').attr('visibility') === 'hidden') {
                    if ($('#'+name).hasClass('inplace-spinner')) {
                      return;
                    }
                    $('#'+name).addClass('inplace-spinner');
                  } else {
                    return;
                  }
                } else {
                  d3.select('#'+ state.currentMapPos).classed('states-selected', false);
                  d3.select('#'+name).classed('states-selected', true);
                }
              }
              renderDataSelection(data, yearIdx, expDelay);
              return;
            });

        svg.on('mouseout', function() {
              if (widgetMode === WidgetModes.INPLACEMAP) {
                $('#state-name').html('&nbsp');
              }
            });
         svg.selectAll('text')
                .data(features)
                .enter()
                .append("svg:text")
                .attr('visibility', 'hidden')
                .style('pointer-events', 'none')
                .attr('id', function(d){
                  return d.properties.STATE_ABBR + '-val';
                    })
                                .attr("x", function(d) {
                    if (path.centroid(d)[0]) {
                      return path.centroid(d)[0] - 8;
                    }})
                                .attr("y", function(d) {
                    if (path.centroid(d)[1]) {
                      if (d.properties.STATE_ABBR == 'TX') {
                        // need to shift up
                        return path.centroid(d)[1] - 17;
                      }
                      return path.centroid(d)[1];
                    }})
                .text(function(d) {
                   var idx = statesIndex.indexOf(d.properties.STATE_ABBR);
                    if (idx > -1) {
                      var val = data[idx][trackIdx].y
                      return val;
                    } else {
                      return '';
                    }
                })
                                .attr("dy", ".35em");

      // remove MN from states to avoid hover issue
      d3.select('#MN').classed("states", false);
      d3.select('#MN').classed("hide", true);
      if (widgetMode !== WidgetModes.INPLACEMAP) {
        d3.select('#AZ').classed('states-selected', true);
      }
    });

      d3.json('us-state-centroids.json', function(error, centroids) {
                svg.selectAll("text")
                        .data(centroids)
                        .enter()
                        .append("svg:text")
                        .text(function(d){
               console.log()
                                return d.properties.name;
                        })
                        .attr("x", function(d){
                console.log('cetroid', path.coordinates(d));
                                return path.coordinates(d)[0];
                        })
                        .attr("y", function(d){
                                return  path.coordinates(d)[1];
                        })
                        .attr("text-anchor","middle")
                        .attr('font-size','6pt');
      });
  }

  // Updates the viz shown to the worker with random data
  // step is the mode of the experiment e.g. qualification or normal task
  // the delay functions determine the latency of a brushing action
  function updateViz(data, step, delay) {
    clearIxns();

    var val = 0;

    if (widgetMode === WidgetModes.SLIDER) {
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
    } else {
      drawMap(data);
    }

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
      } else if (taskMode === TaskModes.EXTREMA) {
        // show a text box
        $('#input').html('<label for="answer-input">Your answer: </label><input id="answer-input" name="task" type="text" value="' + state.input + '">');
      } else {
        // must be threshold
        if (state.input === '') {
          var thresholdHtml = '<label><input type="radio" name="threshold-input" value="YES"> YES </label> \
                             <label><input type="radio" name="threshold-input" value="NO"> NO </label>';
          $('#input').html(thresholdHtml);
        }
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
    } else if (taskMode === TaskModes.EXTREMA){
      if (acceptingAnswer) {
        question = 'For which year did the highlighted bar reach its maximum height? ' +
                   'Write your answer in the text box, and click the "Submit task" button below to submit your answer. ' +
                   'Your answer should be within the range ' + yearStart + '-' + (yearStart + years - 1) + '.';
      } else {
        question = 'For which year did the highlighted bar reach its maximum height? ' +
                   'Click on the "Continue" button below to write your answer. ' +
                   'Note that you may view the visualization, but not interact with it when writing your answer.';
      }
    } else {
      // must be THRESHOLD
      if (acceptingAnswer) {
        question = "Does the height of the highlighted bar ever exceed the value of " + thresholdValue + '? ' +
                   'Click on YES or NO, and click the "Submit task" button below to submit your answer.';
      } else {
        question = "Does the height of the highlighted bar ever exceed the value of " + thresholdValue + '? ' +
                   'Click on the "Continue" button below to select your answer. ' +
                   'Note that you may view the visualization, but not interact with it when selecting your answer.';
      }
    }
    if (state.step === Modes.TRAIN && state.trainTaskNum > 0) {
      question += '<br><br>Note that we have increased the loading delay of the graph from the previous task. ' +
                  'This is intentional, and you should spend some time adjusting your interactions if need be ' +
                  'to prepare for the regular tasks.';
    }
    return question;
  }

  function showViz(disable) {
    $('#viz').removeClass('hidden');
    // display the widget; can only change at the beginning
    if (widgetMode === WidgetModes.SLIDER) {
      $('#slider-wrapper').removeClass('hidden');
      if (disable) {
        $('#slider').slider('option', 'disabled', false);
      }
    } else {
      $('#map-wrapper').removeClass('hidden');
    }
  }
  function disableWidget() {
    if (widgetMode === WidgetModes.SLIDER) {
      $('#slider').slider('option', 'disabled', true);
    } else {
      d3.selectAll('.states').on('mouseover', null);
    }
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
          var disable = false;
          showViz(disable);
        }
      } else {
        var disable = true;
        showViz(disable);
        $('.task-wrapper').removeClass('hidden');
        $('#instruction-buttons').addClass('hidden');
        $('#task-buttons').removeClass('hidden');
      }
    }
    $('#money').text(state.moneyEarned.toFixed(2));

    if (state.acceptingAnswer) {
      disableWidget();
      $('#question-wrapper').removeClass('hidden');
      $('#answer').addClass('hidden');
      if (state.step === Modes.TRAIN && state.showingAnswer) {
        $('#submit').addClass('hidden');
        $('#continue').removeClass('hidden');
        $('#correct').removeClass('hidden');
        $('#correct').html('Correct answer: ' + evaluateAnswer(state.trainTaskNum, state.barData));
      } else {
        $('#submit').removeClass('hidden');
        $('#correct').addClass('hidden');
      }
      updateInput(state.step, state.qualTaskNum);
    } else {
      $('#question-wrapper').addClass('hidden');
      $('#answer').removeClass('hidden');
      $('#submit').addClass('hidden');
      $('#continue').addClass('hidden');
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
    $('#question').html(question);
    if (state.invalidInput) {
      $('#invalid').removeClass('hidden');
    } else {
      //if (state.step === Modes.TRAIN && state.showingInstructions) {
      //  taskData = instructionalData;
      //} else {
      taskData = state.taskData;
      //}
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
      if (widgetMode !== WidgetModes.INPLACEMAP) {
        var val = parseInt(input, 10);
        if (isNaN(val)) {
          return false;
        }
        return (yearStart <= val && val <= yearStart + years - 1);
      } else {
        if (statesIndex.indexOf(input) < 0) {
          return false;
        }
        return true;
      }
    }
    return notEmpty;
  }

  function evaluateAnswer(taskNum, barData) {
    if (taskMode === TaskModes.TREND) {
      return trends[taskNum];
    } else if (taskMode === TaskModes.EXTREMA) {
      if (widgetMode !== WidgetModes.INPLACEMAP) {
        return '' + (yearStart + barData.indexOf(Math.max.apply(null, barData)));
      } else {
        return statesIndex[barData.indexOf(Math.max.apply(null, barData))];
      }
    } else if (taskMode === TaskModes.THRESHOLD) {
      function isBigEnough(value) {
        return value >= thresholdValue;
      }
      var thres = barData.filter(isBigEnough);
      if (thres.length === 0) {
        return 'NO';
      } else {
        return 'YES';
      }
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
  function submitTrainTask(value, trainTaskNum, taskStartTime, answerStartTime, eventLog, barData) {
    console.log('user submitted ' + value);
    console.log('correct answer was ' + answer);

    log = {
      type: 'TRAIN',
      taskNum: trainTaskNum,
      // trend: trainingTrends[trainTaskNum],
      delay: trainingDelays[trainTaskNum],
      response: value,
      vizTime: answerStartTime - taskStartTime,
      answerTime: Date.now() - answerStartTime,
      expected: evaluateAnswer(trainTaskNum, barData), //trainAnswers[taskMode][trainTaskNum][0],
      eventLog: eventLog,
      barData: barData,
    };
    console.log(log)
    gpaas.logData(log);

    state.showingAnswer = true;
    updateView();
  }

  // Submits the current normal task (i.e. not a qual or training task)
  // Happens after the value has been validated
  function submitNormalTask(value, taskNum, taskStartTime, answerStartTime, eventLog, barData) {
    // var trend = dataMode === DataModes.RANDOM ? 'RANDOM' : trends[taskNum];
    var delay = dataMode === DataModes.RANDOM ? 'RANDOM' : delays[taskNum];
    log = {
      type: 'TASK',
      taskNum: taskNum,
      // trend: trend,
      delay: delay,
      response: value,
      vizTime: answerStartTime - taskStartTime,
      answerTime: Date.now() - answerStartTime,
      expected: evaluateAnswer(taskNum, barData),
      eventLog: eventLog,
      barData: barData,
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
    } else if (taskMode === TaskModes.EXTREMA) {
      value = $('input[name="task"]').val();
    } else {
      // must be threshold
      value = $('input[name="threshold-input"]:checked').val();
    }
    console.log('testValue:', value);
    state.input = value;
    state.invalidInput = !isValid(value, taskMode);
    if (!state.invalidInput) {
      if (state.step === Modes.QUAL) {
        submitQualTask(value, state.qualTaskNum);
      } else if (state.step === Modes.TRAIN) {
        submitTrainTask(value, state.trainTaskNum, state.taskStartTime, state.answerStartTime, state.eventLog, state.barData);
      } else if (state.step === Modes.WORK) {
        state.acceptingAnswer = false;
        submitNormalTask(value, state.taskNum, state.taskStartTime, state.answerStartTime, state.eventLog, state.barData);
      }
    } else {
      updateView();
    }
  }

  // Submits demographic survey data at beginning of experiment
  function submitDemographic() {
    var data = {
      type: 'DEMOGRAPHIC',
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
      type: 'USABILITY',
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
    if (state.step === Modes.TRAIN) {
      var log = {
        type: 'INSTRUCTIONS',
        taskNum: state.instructionsTaskNum,
        delay: trainingDelays[state.instructionsTaskNum],
        vizTime: Date.now() - state.taskStartTime,
        eventLog: state.eventLog,
      };
      console.log(log);
      gpaas.logData(log);
    }
    state.instructionsTaskNum += 1;
    state.eventLog = [];
    if (state.step === Modes.WORK || state.instructionsTaskNum > 2) {
      state.showingInstructions = false;
      state.taskStartTime = Date.now();
      if (state.instructionsTaskNum > 2) {
        expDelay = DelayModes[trainingDelays[state.trainTaskNum]];
        state.taskData = generateData();
      }
    } else {
      expDelay = DelayModes[trainingDelays[state.instructionsTaskNum]];
      $('#step-2-instructions p').remove();
      if (state.instructionsTaskNum == 1) {
        $('#step-2-instructions h4').text('Instructions Part 2');
        $('#step-2-instructions').append(
          '<p>We have increased the loading delay of the graph below compared ' +
          'to the previous graph you saw. Now when you drag the slider below the ' +
          'bar chart, the bars will not change immediately but they will change ' +
          'after a small amount of time. The data being shown here is exactly the ' +
          'same as in the previous graph. Spend some time interacting with the ' +
          'visualization below to familiarize yourself with how the delay affects ' +
          'the graph.</p>'
        );
        $('#step-2-instructions').append(
          '<p>When you are ready, you can click the "Next" button below to ' +
          'interact with another visualization where we introduce even more ' +
          'loading delay.</p>'
        );
      } else {
        $('#step-2-instructions h4').text('Instructions Part 3');
        $('#step-2-instructions').append(
          '<p>Now we have increased the loading delay even more compared ' +
          'to the previous graph you saw, and the bars of the graph might not ' +
          'update in the order that you drag the slider. The data being shown ' +
          'here is exactly the same as in the previous graph. Spend some time ' +
          'interacting with the visualization below to familiarize yourself with ' +
          'how the delay affects the graph.</p>'
        );
        $('#step-2-instructions').append(
          '<p>When you are ready, you can click the "Next" button below to ' +
          'start working on a set of training tasks before completing the rest ' +
          'of the tasks. In the training tasks, you will be shown the correct ' +
          'answer after submitting. In some of the training tasks, there will ' +
          'be an intentional loading delay of the graph, and the delay will ' +
          'change between tasks.</p>'
        );
      }
    }
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
      $('#data-config').change(function() { dataMode = DataModes[this.value]; });
      $('#widget-config').change(function() { widgetMode = WidgetModes[this.value]; });
    }
  });

})();
