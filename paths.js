// project paths
var paths = [];

paths.root = "/";
paths.gh_pages = '_gh_pages';
paths.dist = "dist";
paths.docs = "docs";
paths.js = "js";
paths.less = "less";
paths.fonts = "fonts";
paths.assets = "docs/assets";

// Relevant js files
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

// Output js path
paths.jsDest = paths.dist + '/js';

// Less files
paths.allLessFiles = 'less/**/*.less';
paths.bsLess = 'less/bootstrap.less';
paths.gridboxStyles = 'less/ku-gridboxes-bootstrap.less';
paths.cssDest = paths.dist + '/css';

// FAK files
paths.FAKstyles = 'less/faculties/*.less';

// CMS Doctype files
paths.docTypesCss = [
  paths.assets + '/css/doctypes/**/*'
];

// Docs input files
paths.docsHtmml = [
  paths.docs + '/_includes/**/*',
  paths.docs + '/_layouts/**/*'
];

// Docs output files
paths.docsParsedHtmml = '_gh_pages/*.html';

// Docs css and js files
paths.DocsCss = paths.assets + '/src/docs.css';
paths.DocsJs = paths.assets + '/js/docs.min.js';

// Assets scripts
paths.assetsJS = [
  paths.assets + '/js/datatables/datatables.js',
  paths.assets + '/js/datetimepicker/bootstrap-datetimepicker.js',
  paths.assets + '/js/multiple-select/multiple-select.js',
  paths.assets + '/js/social-feeds/instagram/instagramByAccount.js',
  paths.assets + '/js/social-feeds/instagram/instagramByHashtag.js',
  paths.assets + '/js/videoControls/videoControls.js'
];

// Assets css
paths.assetsCss = [
  paths.assets + '/css/datatables/datatables.css',
  paths.assets + '/css/multiple-select/multiple-select.css',
  paths.assets + '/css/ku-dk-frontpage/ku-dk-frontpage.css',
  paths.assets + '/css/social-feeds/instagram.css',
  paths.assets + '/css/social-feeds/twitter.css',
  paths.assets + '/css/print/print.css'
];

module.exports = paths;
