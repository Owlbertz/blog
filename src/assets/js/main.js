$(document).foundation();
$(document).ready(function() {
  // side navigation
  var $sideNav = $('#side-nav'),
    $listOfContents = $('.list-of-contents');
  $('#content').find('h2').each(function() {
    var $a = $('<a href="#' + $(this).attr('id') + '">' + $(this).text() + '</a>'),
      $li = $('<li>');
    $li.append($a);
    $listOfContents.append($li);
  });

  // scrolling
  $('body').on('click', 'a[href^="#"]', function(e) {
    e.preventDefault();
    var offset = $($(this).attr('href')).offset().top;
    $('body').animate({scrollTop: offset}, 300);
  });

  // toggling tags
  $('.tag').click(function() {
    $(this).toggleClass('hollow');
  });
});