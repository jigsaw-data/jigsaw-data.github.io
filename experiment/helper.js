function generate_numbers(type, count, min, max, flatFlux) {
  var result = [];
  var cut = parseInt(count * 0.5);

  for (var i = 0; i < count; i++) {
    result.push(parseInt(i * (max-min)/count + min));
  }
  // then push the extreme a bit off so that it's not all the way at the end
  // hard coded to whatever is around 10%
  var swapIdx = parseInt(count * 0.8);
  result[count - 1] = result[swapIdx];
  result[swapIdx] = max;

  if (type === 'INCREASING') {
    return result;
  }
  else if (type === 'DECREASING') {
    result.reverse();
    return result;
  }
  else if (type === 'FLAT') {
    // reset
    result = [];
    // this is flat with fluctuation
    // the actual flat one shouldn't need to be generated
    var mid = parseInt((min+max)/2);
    var flux = (max-min) * flatFlux;
    for (var i = 0; i < count; i++) {
      var change = parseInt(Math.random() * flux);
      if (Math.random()>0.5) {
        result.push(mid + change);
      } else {
        result.push(mid - change);
      }
    }
    return result;
  }
  else {
    var first = result.slice(0,cut);
    var second = first.slice().reverse();
    first[first.length-1] += parseInt((max-min) * 0.2); // hack to avoid 2 same values
    return first.concat(second);
  }
}

function reorder(array, percentage) {
  var num = array.length * percentage;
  for (var i = 0; i < num; i++) {
    // generate a random number to swap out
    var pos1 = parseInt(Math.random() * array.length);
    var pos = parseInt(Math.random() * array.length);
    // picking somewhere in between to make it less extreme
    // could change the 3 and 4 to adjust how far away the nums should go to
    var pos2 = parseInt((pos + 3*pos1)/4);
    // generate a random position to swap with
    var val1 = array[pos1];
    array[pos1] = array[pos2];
    array[pos2] = val1;
  }
  return array;
}

function main_nums() {
  var count = 15;
  var min = 5;
  var max = 85;
  var types = ['INCREASING', 'DECREASING', 'UPDOWN'];
  for (var i = 0; i < types.length; i ++) {
    var a1 = generate_numbers(types[i], count, min, max, 0);
    var a2 = reorder(a1.slice(), 0.15);
    var a3 = reorder(a1.slice(), 0.3);
    console.log(types[i] +': ', a1, ',');
    console.log(types[i]+'_15: ', a2, ',');
    console.log(types[i]+'_30: ', a3, ',');
  }
  // 'FLAT',
  console.log('FLAT: ', generate_numbers('FLAT',    count, min, max, 0), ',');
  console.log('FLAT_15: ', generate_numbers('FLAT', count, min, max, 0.15), ',');
  console.log('FLAT_30: ', generate_numbers('FLAT', count, min, max, 0.5), ',');
}

main_nums();
