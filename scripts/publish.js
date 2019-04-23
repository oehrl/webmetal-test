var ghpages = require('gh-pages');

const { spawnSync } = require('child_process');
const npmBin = spawnSync('npm', ['bin'], {
  encoding: 'utf8'
});

const webpack = spawnSync(npmBin.stdout.replace('\n', '') + '/webpack', ['--config', 'webpack.config.js'], {
  encoding: 'utf8'
});
console.log(webpack.stdout);

ghpages.publish('dist');