var util = require('gulp-util');

module.exports = {
  // jscs:disable
  paintBazookas: function () {
    util.log(util.colors.bgCyan("                                              "));
    util.log(util.colors.bgCyan(util.colors.white("  ______                      _               ")));
    util.log(util.colors.bgCyan(util.colors.white("  | ___ \\                    | |              ")));
    util.log(util.colors.bgCyan(util.colors.white("  | |_/ / __ _ _______   ___ | | ____ _ ___   ")));
    util.log(util.colors.bgCyan(util.colors.white("  | ___ \\/ _` |_  / _ \\ / _ \\| |/ / _` / __|  ")));
    util.log(util.colors.bgCyan(util.colors.white("  | |_/ / (_| |/ / (_) | (_) |   < (_| \\__ \\  ")));
    util.log(util.colors.bgCyan(util.colors.white("  \\____/ \\__,_/___\\___/ \\___/|_|\\_\\__,_|___/  ")));
    util.log(util.colors.bgCyan("                                              "));
  }
};
