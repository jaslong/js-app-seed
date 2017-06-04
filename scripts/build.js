const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const rollup_babel = require('rollup-plugin-babel');
const rollup_commonjs = require('rollup-plugin-commonjs');
const rollup_eslint = require('rollup-plugin-eslint');
const rollup_node_resolve = require('rollup-plugin-node-resolve');
const eslint_config = require('./eslint-config');

function build(lastOut) {
  const out_cache_dir='.out_cache';
  if (!fs.existsSync(out_cache_dir)) {
    fs.mkdirSync(out_cache_dir);
  }
  const out_dir = fs.mkdtempSync(out_cache_dir + '/out_XXXXXXXX');
  const out = {
    dist: out_dir + '/dist',
  }
  fs.mkdir(out.dist);

  return build_js(out, lastOut).then(() => {
    build_html(out)

    const out_symlink = 'out';
    if (fs.existsSync(out_symlink)) {
      fs.unlinkSync(out_symlink);
    }
    fs.symlinkSync(out_dir, out_symlink, 'dir');
    return Promise.resolve(out);
  });
}

function build_js(out, lastOut) {
  const include = 'main/js/**';
  return rollup.rollup({
    entry: 'main/js/root.jsx',
    cache: lastOut ? lastOut.rollup_bundle : null,
    plugins: [
      rollup_eslint(
        Object.assign({
          include: include,
          throwError: true,
        }, eslint_config)),
      rollup_babel({
        babelrc: false,
        include: include,
        plugins: [
          'external-helpers',
        ],
        presets: [
          ['env', { modules: false }],
          'react',
        ],
      }),
      rollup_node_resolve({
        jsnext: true,
        main: true,
        browser: true,
        extensions: [ '.js', '.jsx' ],
      }),
      rollup_commonjs(),
    ],
  }).then((bundle) => {
    out.rollup_bundle = bundle;
    const result = bundle.generate({
      format: 'iife',
      dest: out.dist + '/bundle.js',
      moduleName: 'App',
      sourceMap: true,
    });

    const fd = fs.openSync(out.dist + '/bundle.js', 'w');

    // Hack to pretend that we are in a node environment.
    if (process.env.NODE_ENV !== 'production') {
      fs.writeSync(fd, 'var process = {"env": ' + JSON.stringify(process.env) + '};');
    }

    fs.writeSync(fd, result.code);
    fs.closeSync(fd);
    return Promise.resolve(true);
  });
}

function build_html(out) {
  fs.copySync('main/html', out.dist);
}

build();

module.exports = build;
