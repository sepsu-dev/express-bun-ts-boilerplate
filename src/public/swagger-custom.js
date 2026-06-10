/**
 * Swagger UI Custom JS – Auto-fill Bearer Token after Login
 *
 * Waits for SwaggerUI to initialize (window.ui becomes available),
 * then intercepts fetch calls to /auth/login. When a login succeeds,
 * automatically calls ui.preauthorizeApiKey() to fill the "Authorize" dialog
 * with the JWT token. The persistAuthorization swagger option ensures the
 * token survives page reloads.
 */
(function () {
  var checkCount = 0;

  var interval = setInterval(function () {
    // Wait for SwaggerUI to fully initialize
    if (window.ui && window.ui.preauthorizeApiKey) {
      clearInterval(interval);

      // Patch fetch to intercept login responses
      var originalFetch = window.fetch;
      window.fetch = function () {
        var args = arguments;
        var resource = args[0];
        var url =
          typeof resource === 'string'
            ? resource
            : resource && resource.url
              ? resource.url
              : '';

        return originalFetch.apply(this, args).then(function (response) {
          // Only process successful login calls
          if (url.indexOf('/auth/login') !== -1 && response.ok) {
            response
              .clone()
              .json()
              .then(function (body) {
                var token = body && body.data && body.data.token;
                if (token) {
                  window.ui.preauthorizeApiKey(
                    'bearerAuth',
                    'Bearer ' + token
                  );
                }
              })
              .catch(function () {
                // Ignore parse errors
              });
          }
          return response;
        });
      };
    }

    // Safety: stop polling after 50 attempts (10 seconds)
    checkCount++;
    if (checkCount > 50) {
      clearInterval(interval);
    }
  }, 200);
})();