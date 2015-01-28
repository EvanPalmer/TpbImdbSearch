var thisIsImdb = window.location.href.indexOf('//www.imdb.com/') > 0;

if(thisIsImdb){
  $("body").prepend('<div class="extSeARCHresults" id="extSeARCHresults"></div>');

  var container;
  var logo;
  var searchTerm;
  var id;
  var thisIsAMoviePage = window.location.href.indexOf('/title/') > 0;
  if(thisIsAMoviePage){
    //TODO change to something more accurate
    // here we getting id
    id = window.location.href.split("/")[4];
    container = $('#prometer_container');
    searchTerm = $('h1.header').text();

    if(container == undefined || container.length === 0){
      // this is if it's a TV series.
      container = $('#warplink').parent();
      container.css('float', 'right');
      searchTerm = $('h1.header .itemprop').text();
    }
    container.css('left', '-10px').children().remove();
    doSearch(searchTerm);
  }

  // TODO for other pages
  // var th isIsPersonPage = window.location.href.indexOf('/name/') > 0;
  // if(thisIsPersonPage){
  //   container = $('#prometer_container');
  //
  //   // make room for the new DDL
  //   container.css('left', '-10px').children().remove();
  //
  //   var header = $('h1.header').clone();
  //   header.find('span:not(:first)').remove();
  //
  //   // container.tpbSearch({'searchTerm' : header.text() });
  //   searchTerm = header.text();
  //   doSearch(searchTerm);
  // }

  // var thisIsAListPage = window.location.href.indexOf('/list/') > 0;
  // if(thisIsAListPage){
  //   $('.list.detail .list_item .info b').each(function (i, e){
  //     var currentElement = $(e);
  //     container = $('<span>').attr('class', 'list_container').css('float','right');
  //     currentElement.append(container);
  //     // make room for the new DDL
  //     //container.css('left', '-10px').children().remove();
  //
  //     var header = $('h1.header').clone();
  //     header.find('span').remove()
  //     // container.tpbSearch({'searchTerm' : currentElement.text() });
  //     searchTerm = currentElement.text();
  //     doSearch(searchTerm);
  //   });
  // }

  function doSearch(searchTerm){
    var arr = [searchTerm, id];
    safari.self.tab.dispatchMessage("lookForContent", arr);
  }

  // function respondToMessage(theMessageEvent){
  //   if (theMessageEvent.name === "fetchCompleted") {
  //       // safari.self.tab.dispatchMessage("searchComp", theMessageEvent.message);
  //   }
  // }
  
  $(window).on("beforeunload", function() {
    safari.self.tab.dispatchMessage("removeFromPopup", id);
  })
  
  // safari.self.addEventListener("message", respondToMessage, false);
};