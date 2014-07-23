var semver = require('semver');

function validate(pkginfo, moduleIndex, result) {
  result = result || [];

  pkginfo.parent = pkginfo.parent || [];
  var moduleParent = pkginfo.parent;

  // Check for advisory here
  if (moduleIndex[pkginfo.name]) {
    Object.keys(moduleIndex[pkginfo.name]).forEach(function (key) {
      var advisory = moduleIndex[pkginfo.name][key];
      if (semver.valid(pkginfo.version) && semver.satisfies(pkginfo.version, advisory.vulnerable_versions)) {
        var data = {
          dependencyOf: pkginfo.parent,
          module: pkginfo.name,
          version: pkginfo.version,
          advisory: advisory
        };
        result.push(data);
      }
    });
  }

  if (pkginfo && pkginfo.dependencies) {
    var temp = pkginfo.parent.slice() || [];
    temp.push(pkginfo.name);
    Object.keys(pkginfo.dependencies).forEach(function (pkg) {
      pkginfo.dependencies[pkg].parent = temp;
      pkginfo.dependencies[pkg].name = pkg;
      validate(pkginfo.dependencies[pkg], moduleIndex, result);
    });
  }
  return result;
}

module.exports = validate;
