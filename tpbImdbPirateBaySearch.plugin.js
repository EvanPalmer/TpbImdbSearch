
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
	function doSearch(container, searchTerm){
		// here we should iterate over the container selector, becuase it's possible multiple items will be selected.
		//debugger;
		container.children().remove();
		var sanitizedSearchTerm = sanitizeSearchTerm(searchTerm);

		// set the default logo
		var logo = $('<img id="tpb-logo" src="//thepiratebay.se/static/downloads/preview-cassette.gif">').css('width', '50px').css('height', '50px');

		var searchUrl = '//thepiratebay.se/search/' + encodeURIComponent(sanitizedSearchTerm) + '/0/7/0'
		$.get(searchUrl, function(data){
			var resultTds = $(data).find('a[title="Download this torrent using magnet"]:lt(5)').closest('td');

			// Handle no results from TPB
			if(resultTds.length === 0)  {
				container.append(logo).attr('title', 'Sorry, no results on TPB for this one...') 
									  .fadeIn('slow');
				return;
			}

			// Sweet! We have some results!
			logo.attr('src', '//thepiratebay.se/static/downloads/preview-tpb-logo.gif');
			buildDropdownList(container, resultTds, sanitizedSearchTerm, logo);

			container.fadeIn('slow');
		});
	}

	function sanitizeSearchTerm(searchTerm){
		return searchTerm.replace(/(\d+ tv series)/ig, '') // get rid of the word TV Series, because most torrents don't have that string in there
					 .replace(/(\d+ documentary)/ig, '') // get rid of the word Documentary, because most torrents don't have that string in there
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
					.append($('<li>').append('<a target="_blank" href="//thepiratebay.se/search/' + encodeURIComponent(searchTerm) + '/0/7/0">Search TPB for "' + searchTerm + '"</a>'))
					.append($('<li class="divider">')))));

		// add all the links for the top 5 magent links
		items.each(function(i, e) { 
			var description = $(e).find('font.detDesc').text();
			var sizeExtractionRegex = /.+Size (.+?),.+/i;
			var size = sizeExtractionRegex.exec(description)[1];
			var linkName = $(e).find('a.detLink').text();
			var contextMenuTitle = '(' + size + ') ' + linkName;
			var magnetUrl = $(e).find('a[title="Download this torrent using magnet"]').attr('href');
			
			container.find('.dropdown-menu').append($('<li>').append($('<a>').attr('href', magnetUrl).append(contextMenuTitle)));
		});
	}

}(jQuery));
