
(function($) {
	$.fn.extend({
		tpbSearch : function(options){
			var defaults = { searchTerm: ''};
			var options = $.extend(defaults, options);
			return this.each(function(){
				doSearch($(this), options.searchTerm);
			})
		}
	});

	// private functions

	function buildSearchUrl(searchTerm)
	{
		var searchUrl = '//thepiratebay.cr/search/' + encodeURIComponent(searchTerm) + '/0/7/0';
		return searchUrl;
	}

	function doSearch(container, searchTerm){
		// here we should iterate over the container selector, because it's possible multiple items will be selected.
		var sanitizedSearchTerm = sanitizeSearchTerm(searchTerm);

		// set the default logo
        var loadingImageUrl = chrome.extension.getURL('images/ajax-loader.gif');
        var logo = $('<img id="tpb-logo">')
                    .attr('src', loadingImageUrl)
                    .css('width', '25px')
                    .css('height', '25px');
        container.children().remove();
        container.append(logo);

        var searchUrl = buildSearchUrl(sanitizedSearchTerm);
		$.get(searchUrl, function(data){
			var resultTds = $(data).find('a[title="Download this torrent using magnet"]:lt(5)').closest('td');

			// Sweet! We have some results!
            var resultsImageUrl = chrome.extension.getURL('images/logo.gif');
			logo.attr('src', resultsImageUrl)
                .css('width', '98px')
                .css('height', '102px');
            $('div.infobar').css('margin', '4px 0 55px');
            container.children().remove();
			buildDropdownList(container, resultTds, sanitizedSearchTerm, logo);
			container.fadeIn('slow');
		});
	}

	function sanitizeSearchTerm(searchTerm){
		return searchTerm.replace(/(\d+ tv series)/ig, '') // get rid of the phrase TV Series, because most torrents don't have that string in there
					 .replace(/(\d+ documentary)/ig, '') // get rid of the word Documentary, because most torrents don't have that string in there
					 .replace(/(\d+ tv movie)/ig, '') // get rid of the phrase Tv Movie, because most torrents don't have that string in there
                     .replace(/\([IV]+\)/g, ' ') // get rid of the roman numerals. This happens when IMDB knows of several movies with the same name in the same year.
					 .replace(/[^\s\w\d]+/ig, '') // get rid of weird-ass characters
					 .replace(/\s+/g, ' ') // get rid of excessive spaces
					 .trim(); // keep that shit trim, motherfucker
	}

	function buildDropdownList(container, items, searchTerm, logo){
		// build the bones of the DDL
		container.append($('<ul class="nav nav-pills">')
			.append($('<li class="dropdown xx">')				
				.append($('<a class="dropdown-toggle" data-toggle="dropdown" href="#">').append(logo))
				.append($('<ul class="dropdown-menu">')
					.append($('<li>').append('<a target="_blank" href="' + buildSearchUrl(searchTerm) + '">Search TPB for "' + searchTerm + '"</a>'))
					.append($('<li class="divider">')))));

		// add all the links for the top 5 magnet links
		items.each(function(i, e) { 
			var description = $(e).find('font.detDesc').text();
			var sizeExtractionRegex = /.+Size (.+?),.+/i;
			var size = sizeExtractionRegex.exec(description)[1];
			var linkName = $(e).find('a.detLink').text();
			var contextMenuTitle = '(' + size + ') ' + linkName;
			var magnetUrl = $(e).find('a[title="Download this torrent using magnet"]').attr('href');
			
			container.find('.dropdown-menu').append($('<li>').append($('<a>').attr('href', magnetUrl).append(contextMenuTitle)));
		});

        // Damn gurl. No results :( Let's let the user know
        if(items.length === 0)  {
            var notFoundImageUrl = chrome.extension.getURL('images/logo-not-found.gif');
            container.find('.dropdown-menu').append($('<li>').append('<a target="_blank" href="' + buildSearchUrl(searchTerm) + '">Sorry! No results found.</a>'));
            container.find('#tpb-logo').attr('src', notFoundImageUrl);
        }
	}

}(jQuery));
