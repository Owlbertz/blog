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
    var activeTag = $(this).text(),
      deactivate = $(this).is('.hollow');
    $('.tag').addClass('hollow');
    if (deactivate) $('.tag[data-tag="' + activeTag + '"]').removeClass('hollow');

    $('.post').removeClass('selected');
    if (deactivate) $('.post[data-tags*="' + activeTag + '"]').addClass('selected');
    if ($('.post.selected').length) {
      $('#content').addClass('filtered');
    } else {
      $('#content').removeClass('filtered');
    }
   
  });


  // fade in scroll to top button
  $(window).scroll(function() {
    if ($(window).scrollTop() >= $(window).innerHeight()) { //if its more than 1 screen scrolled
      $('.jump-to-top').addClass('shown'); // show jump-to-top link
    } else {
      $('.jump-to-top').removeClass('shown'); // hide jump-to-top link
    }
  });
});