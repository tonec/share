
(function ( $ ) {

	$.fn.share = function ( options ) {

		// Default options
		$.fn.share.options = {
			url: 'undefined',
			title: '', 
			fbAppId: 'undefined',
			linkElem: '',
			customContent: false,
			sourceTxt: 'title',
			sourceImg: '',
			defaultImgUrl: ''
		};

		// Merge options
		options = $.extend( {}, $.fn.share.options, options );

		window.twttr = window.twttr || {};

		// Ready Facebook
		$( 'body' ).append( '<div id="fb-root"></div>' );
		$( 'head' ).append( '<sc' + 'ript src="//connect.facebook.net/en_US/all.js"></sc' + 'ript>' );
		$( 'head' ).append( '<sc' + 'ript type="text/javascript" src="//assets.pinterest.com/js/pinit.js"></sc' + 'ript>' );

		this.each( function() {
			var elem = $( this );
			
			// Add click events
			$( this ).delegate( options.linkElem, 'click', function( event ){

				event.preventDefault();
				event.stopPropagation();

				var service = $(this).attr('rel'),
					message = {},
					tgt = event.target;

				message.txt = '';
				message.img = '';

				if ( service === undefined ) {

					service = $(this).find('[rel]').attr('rel').split('|')[0];
				} else {

					service = service.split('|')[0];
				}
				
				if ( options.customContent && options.customContentFunction === undefined ) {

					message.txt = $( options.sourceTxt ).text().replace( /\s+/g , ' ' ).replace(/(^[\s\xA0]+|[\s\xA0]+$)/g, '');
					message.img = $( options.sourceImg ).attr('src');

					if ( message.img !== '' && typeof message.img !== 'undefined' ) {
						message.img = message.img.split('://')[1];
					}

				} else if ( options.customContent && typeof options.customContentFunction === 'function' ) {

					message = options.customContentFunction( tgt, options );
				} else {

					message.txt = $( 'title' ).text();
				}

				shareSwitch( service, message.txt, message.img );
			});


			function shareSwitch ( service, msg, img ) {
							
				switch (service) {
					case 'twitter':
						shareTwitter( msg, img );
						break;
					case 'linkedin':
						shareLinkedin( msg, img );
						break;
					case 'facebook':
						shareFacebook( msg, img );
						break;
					case 'googleplus':
						shareGoogleplus( msg, img );
						break;
					case 'pinterest':
						sharePinterest( msg, img );
						break;
					case 'email':
						shareEmail( msg, img );
						break;
				}
			}


			function shareFacebook ( msg, img ) {

				FB.init({
					appId : options.fbAppId,
					status : true,
					cookie : true,
					xfbml : true,
					oauth: true
				});

				FB.Event.subscribe('auth.statusChange', handleStatusChange);

				function handleStatusChange(response) {
					
					if ( response.authResponse ) {
						$( 'body' ).addClass('connected');
					} else {
						$( 'body' ).addClass('not_connected');
					}
				}

				//in safari (and hence iphone) you cannot call an FB event based on a callback and therefore cannot check the login state using getLoginStatus function and then calling FB.Login
				if ( $('body').hasClass('connected') ) {
					publish(msg, img);
				} else {
					FB.login(function(response) {
						if (response.authResponse) {
							publish(msg, img);
						} else {
							//console.log("You must login to Facebook in order to post to your wall");
						}
					});
				}

				function publish ( msg, img ){
					
					if ( img === '' || typeof img === 'undefined' ){
						var img = options.defaultImgUrl;
					}

					if ( !msg ){
						var msg = $('.message_facebook').text();
					}

					var params = {
						method : 'feed',
						message : '',
						name : options.title,
						description : msg,
						link : options.url,
						picture : img
					};
										
					FB.ui(params, function(response) {
							if (response && response.post_id) {
									// All ok
							} else {
									// Not ok
							}
					});
				}
			}


			function shareTwitter ( msg, img ) {
				var popWidth = 550,
					popHeight = 260,
					winHeight = $(window).height(),
					winWidth = $(window).width(),
					leftPos = Math.round( ( winWidth / 2 ) - ( popWidth / 2 ) ),
					topPos = 0,
					elem;

				if ( winHeight > popHeight ) {
					topPos = Math.round( ( winHeight / 2 ) - ( popHeight / 2 ) );
				}

				if ( !msg ) {
					var msg = $('.message_twitter').text();
				}

				msg = encodeURIComponent( msg );

				window.twttr.shareWin = window.open(
					'https://twitter.com/share?url=' + options.url + '&text=' + msg,
					'', 'left=' + leftPos + ',top=' + topPos + ',width=' + popWidth + ',height=' + popHeight + ',personalbar=0,toolbar=0,scrollbars=1,resizable=1');

				elem = document.createElement('script');
				elem.src = 'https://platform.twitter.com/widgets.js';
				document.getElementsByTagName('head')[0].appendChild( elem );
			}


			function shareLinkedin ( msg, img ) {
				var popWidth = 550,
					popHeight = 450,
					winHeight = $(window).height(),
					winWidth = $(window).width(),
					leftPos = Math.round( ( winWidth / 2 ) - ( popWidth / 2 ) ),
					topPos = 0,
					elem;

				if ( winHeight > popHeight ) {
					topPos = Math.round( ( winHeight / 2 ) - ( popHeight / 2 ) );
				}

				var url = 'http://www.linkedin.com/shareArticle?mini=true&url=' + options.url + '&title=&summary=' + msg;

				window.linkedin = window.linkedin || {};
				window.linkedin.shareWin = window.open( url, '', 'left=' + leftPos + ',top=' + topPos + ',width=' + popWidth + ',height=' + popHeight + ',personalbar=0,toolbar=0,scrollbars=1,resizable=1');
			}

			function shareGoogleplus ( msg, img ) {
				var popWidth = 550,
					popHeight = 450,
					winHeight = $(window).height(),
					winWidth = $(window).width(),
					leftPos = Math.round( ( winWidth / 2 ) - ( popWidth / 2 ) ),
					topPos = 0,
					elem;

				if ( winHeight > popHeight ) {
					topPos = Math.round( ( winHeight / 2 ) - ( popHeight / 2 ) );
				}

				var url = 'https://plus.google.com/share?url=' + options.url;
				window.gplus = window.gplus || {};
				window.gplus.shareWin = window.open( url, '', 'left=' + leftPos + ',top=' + topPos + ',width=' + popWidth + ',height=' + popHeight + ',personalbar=0,toolbar=0,scrollbars=1,resizable=1');
			}

			function sharePinterest ( msg, img ) {
					var popWidth = 550,
					popHeight = 450,
					winHeight = $(window).height(),
					winWidth = $(window).width(),
					leftPos = Math.round( ( winWidth / 2 ) - ( popWidth / 2 ) ),
					topPos = 0,
					elem;

				if ( winHeight > popHeight ) {
					topPos = Math.round( ( winHeight / 2 ) - ( popHeight / 2 ) );
				}

				var url = '//www.pinterest.com/pin/create/button/?url=' + options.url;
				window.pinterest = window.pinterest || {};
				window.pinterest.shareWin = window.open( url, '', 'left=' + leftPos + ',top=' + topPos + ',width=' + popWidth + ',height=' + popHeight + ',personalbar=0,toolbar=0,scrollbars=1,resizable=1');
			}

			function shareEmail ( msg, img ) {
				window.location.href = "mailto:?body=options.url";
			}

		});
	};

})( jQuery );
