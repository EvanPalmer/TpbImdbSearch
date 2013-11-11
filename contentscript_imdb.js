(function($, undefined){
	window.onload = function(){
		//debugger;
		var thisIsImdb = window.location.href.indexOf('//www.imdb.com/') > 0;
		if(thisIsImdb){
			// debugger;
			// add bootstrap JS from CDN
			$.getScript("//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js", function(){

				var thisIsAMoviePage = window.location.href.indexOf('/title/') > 0;
				if(thisIsAMoviePage){
					var container = $('#prometer_container');
					//debugger;
					var searchTerm = $('h1.header').text();

					if(container == undefined || container.length === 0){
						// this is if it's a TV series.
						container = $('#warplink').parent();
						container.css('float', 'right');
						searchTerm = $('h1.header .itemprop').text();
					}

					// make room for the new DDL
					container.css('left', '-10px').children().remove();
					container.tpbSearch({'searchTerm' : searchTerm });
				}

				var thisIsPersonPage = window.location.href.indexOf('/name/') > 0;
				if(thisIsPersonPage){
					var container = $('#prometer_container');

					// make room for the new DDL
					container.css('left', '-10px').children().remove();

					var header = $('h1.header').clone(); 
					header.find('span').remove()

					container.tpbSearch({'searchTerm' : header.text() });
				}

				var thisIsAListPage = window.location.href.indexOf('/list/') > 0;
				if(thisIsAListPage){
					$('.list.detail .list_item .info b').each(function (i, e){
						var currentElement = $(e);
						var container = $('<span>').attr('class', 'list_container').css('float','right');
						currentElement.append(container);
						// make room for the new DDL
						//container.css('left', '-10px').children().remove();

						var header = $('h1.header').clone(); 
						header.find('span').remove()
						container.tpbSearch({'searchTerm' : currentElement.text() });
					});
				}
			});
		};
	};
}(jQuery));

