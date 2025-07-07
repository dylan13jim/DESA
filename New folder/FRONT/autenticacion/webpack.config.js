const { withModuleFederation } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederation({
  name: 'mf-autenticacion',
  exposes: {
    './ModuloAutenticacion': './src/app/modulo-autenticacion/modulo-autenticacion.module.ts'
  },
  shared: {
    '@angular/core': { singleton: true, strictVersion: true },
    '@angular/common': { singleton: true, strictVersion: true },
    '@angular/router': { singleton: true, strictVersion: true },
    '@angular/forms': { singleton: true, strictVersion: true }
  }
});
