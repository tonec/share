
OVERVIEW
========

Adds Share functionality that permits the posting of a message and a link to various social networks.

REQUIREMENTS
============

Each share link must include a rel attribute specifying the particular service. Currently either rel="facebook", rel="twitter" or rel="linkedin". Google+ has yet to be implemented.

OPTIONS
=======

The following options are available - the values show below are the defaults.

givingPageUrl: 'undefined' - url of the current giving page.
fbAppId: 'undefined' - facebook app id
linkElem: '.share-links a' - selector for the links or buttons used to trigger the share options
customContent: false - plugin defaults to sending the page title and the default image. Set to true to specify alternatives.
getParentFunction
sourceTxt: '.share-msg' - selector to be used as the source of the posted message text.
sourceImg: '.share-img img' - selector for a custom image source.
defaultImgUrl: 'https://local-frostcdn.comicrelief.com/assets/layouts/SR12-new/images/sr.png' - the default image source - used if no custom image is found.