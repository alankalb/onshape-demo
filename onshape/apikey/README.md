# Onshape API Key encoding package

[![Build](https://travis-ci.org/onshape-public/node-apikey.svg?branch=master)](https://travis-ci.org/onshape-public/node-apikey)

Make HTTP requests to Onshape using an API Key.

---

### Getting Started

Please see the [node examples](https://github.com/onshape-public/apikey/tree/master/Node) for further examples of using this package.

### Why API Keys?

API keys are useful for small applications meant for personal use, allowing developers to avoid the overhead of the OAuth workflow.  Creating an app is very easy with API keys, as the samples hopefully demonstrate: create an API key with the Developer Portal, set up a function to build your API key header as in the samples, and make your API calls!  There's no need to deal with OAuth redirects or things like that.

We've moved over to using API keys for authenticating requests instead of using
cookies for several reasons.

1. Security: Each request is signed with unique headers so that we can be sure it's
coming from the right place.
2. OAuth: The API key system we're now using for HTTP requests is the same process
developers follow when building full-blown OAuth applications; there's no longer a disconnect
between the two.

### Questions and Concerns

If you need information or have a question unanswered in this documentation,
feel free to chat with us by sending an email to
[api-support@onshape.com](mailto:api-support@onshape.com) or by checking out
the [forums](https://forum.onshape.com/).

### Working with API Keys

Read the following and you'll be up and running with using API keys in your
application:

##### Instructions

1. Create and manage your API key pairs from the [Developer Portal](https://dev-portal.onshape.com);
note that the secret will only be displayed once! Keep it somewhere safe.

2. Now that you have a key pair, see [below](#signing-an-http-request) for
information on signing your requests to use our API.

Once you have your access key and secret, you will want to avoid giving others access to them since they're tied directly to your personal Onshape account.  Think of your API key as a username and password pair.  Therefore, you should avoid placing them directly in the code for your application, especially if others might see it.  The samples use a separate configuration file that you yourself will need to create that will contain this information, but there are other ways to keep the access key and secret safe, like setting them as environment variables.

##### Scopes

There are several scopes available for API keys (equivalent to OAuth scopes):

* "OAuth2Read" - Read non-personal information (documents, parts, etc.)
* "OAuth2ReadPII" - Read personal information (name, email, etc.)
* "OAuth2Write" - Create and edit documents / etc.
* "OAuth2Delete" - Delete documents / etc.
* "OAuth2Purchase" - Authorize purchases from account

##### Signing an HTTP Request

```js
var client = require('@onshape/apikey');

var apiKeyDetails = {
    'baseUrl': 'https://cad.onshape.com',
    'accessKey': YOUR_ACCESS_KEY,
    'secretKey': YOUR_SECRET_KEY
};

client(apiKeyDetails).getDocuments({}, function (data) {
    // Process the response data
    })
```

Some API endpoints return 307 redirects.  You must generate an Authorization header for the redirect as well, but please note that the server portion of the URL might be different, the redirect URL may contain query parameters that must be encoded in the Authorization header, etc.  Please see the samples for examples.

### API keys and OAuth

Our API key workflow differs from our OAuth workflow in one important characteristic: an API key allows a *user* (specifically, a developer) to make requests, while OAuth allows an *application* to make requests on behalf of the user.  We require the OAuth workflow for apps in the Onshape App Store, so if you develop an app using API keys and want to distribute it through the App Store, you will need to change to OAuth.  Please see our OAuth sample apps for examples of how to make OAuth work (onshape/app-bom is a great place to start).  The good news is that we've structured API keys to work very similarly to OAuth in the operation of your app.  While you will need to build your Authorization header differently (and set up redirects and signins as in the onshape/app-bom sample), the API calls themselves will work the same in both versions, provided that the API key and the OAuth app have the same scopes.  An API key with the OAuth2Read and OAuth2Write scopes will have the same access to the same API endpoints as an OAuth application with the OAuth2Read and OAuth2Write scopes, for example.  (The only differences are when calling API endpoints relating to the OAuth application itself, since an API key request obviously does not come from an OAuth application.)
