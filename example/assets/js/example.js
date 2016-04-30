// make sure the namespace exists
const bazookas = bazookas || {};

// simpler modules can just return an object
bazookas.example = (function() {
  const $inputField = $('#exampleMultiplier'),
        $btn = $('#exampleButton'),
        $result = $('#result'),
        numbers = [1, 2, 4, 7, 9, 15, 28];

  const init = function() {
    // Object destructuring example
    var example = {
      first: '1',
      second: '2'
    };
    var first = example.first;
    var second = example.second;
    console.log('foo:', first); // logs: foo 1
    console.log('bar:', second); // logs: bar 2

    $btn.on('click', function() {
      let multiplier = parseInt($inputField.val());
      if (_.isNumber(multiplier)) {
        let result = _.map(numbers, (number) => number * multiplier + ', ');
        _.trimEnd(result, ', ');
        $result.html(result);
      }
    });
  };

  return {
    init: init
  };
})();
