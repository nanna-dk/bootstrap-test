// project paths
var paths = [];

paths.root = "/";
paths.gh_pages= '_gh_pages';
paths.dist =  "dist";
paths.docs = "docs";
paths.js = "js";
paths.less = "less";
paths.fonts = "fonts";
paths.assets = "assets";


paths.jsSrc = [
  'js/ku-global-footer.js',
  //'js/ku-mobile-menu.js',
  'js/transition.js',
  'js/alert.js',
  'js/button.js',
  //'js/carousel.js',
  'js/collapse.js',
  'js/dropdown.js',
  'js/modal.js',
  'js/tooltip.js',
  'js/popover.js',
  //'js/scrollspy.js',
  'js/tab.js',
  //'js/affix.js',
  'js/ku-custom.js'
];
paths.jsDest = paths.dist + '/js';

paths.allLessFiles = 'less/**/*.less';
paths.bsLess = 'less/bootstrap.less';
paths.cssDest = paths.dist + '/css';

paths.FAKstyles = 'less/faculties/*.less';

paths.docsHtmml = [
  "docs/_includes/**/*",
  "docs/_layouts/**/*",
  "docs/assets/**/*",
  "docs/examples/**/*"
];

paths.DocsCss = paths.assets + '/src/docs.css';
paths.DocsJs = paths.assets + '/js/docs.min.js';

module.exports = paths;
