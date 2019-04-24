var ghpages = require('gh-pages');

const { spawnSync, execFileSync } = require('child_process');
const npmBin = spawnSync('npm', ['bin'], {
  encoding: 'utf8'
});

execFileSync(npmBin.stdout.replace('\n', '') + '/webpack', ['--config', 'webpack.config.js'], {
  encoding: 'utf8',
});

ghpages.publish('dist');