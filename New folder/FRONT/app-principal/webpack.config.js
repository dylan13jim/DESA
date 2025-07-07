const { withModuleFederation } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederation({
  remotes: {
    'mf-autenticacion': 'mf-autenticacion@http://localhost:4201/remoteEntry.js'
  }
});
