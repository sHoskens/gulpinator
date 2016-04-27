// Every gulp task defined in the gulp folder will call this function.
// This function will ensure that every module export of such a file contains
// an object with a getStream function, used in for example an injection task,
// and a getTask function, used when creating a seperate gulp task.

module.exports = function(stream) {
  return {
    getStream: stream,
    getTask: function() {
      return stream;
    }
  };
};
