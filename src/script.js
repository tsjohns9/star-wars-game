$(document).ready(function() {

  var selectCharacter = true;
  var selectOponent = false;
  var versesH2;

  //allows a character to be selected at the start of the game.
  //all other characters become opponents
  $('.character-container').click(function() {
    if (selectCharacter) {
      selectCharacter = false;
      selectOponent = true;
      $(this).addClass('selected-character');
      $('.main-header').text('Choose Your Opponent');

      $('.all-characters').find('.character-container')
        .not('.selected-character').addClass('opponents');

      //removes col-lg-3 class and adds col-lg-4 class to keep characters evenly centered. moves selected character to verses area.
      $(this).parent().appendTo('.verses').removeClass('col-lg-3');
      $('.col-lg-3').removeClass('col-lg-3').addClass('col-lg-4');

      //selects players data-name and adds it to h2 tag in verses area
      versesH2 = $(`<h2 class="text-center mb-4">${$(this).attr('data-name')} VS. </h2>`);
      $(versesH2).prependTo('.fight-area');

    }

    //selects current oponent. moves opponent to verses area.
    //removes col-lg-4 classes to keep it responsive
    if ($(this).hasClass('opponents') && selectOponent) {
      $(this).addClass('current-oponent');
      selectOponent = false;
      $(this).parent().appendTo('.verses');
      $('.col-lg-4').removeClass('col-lg-4');

      //selects current oppoents data-name and adds it to h2 tag in verses area
      var vsEnemyH2Span = $(`<span>${$(this).attr('data-name')}</span>`);
      $(vsEnemyH2Span).appendTo(versesH2);
      $('.main-header').text('Opponents Left');
    }
  });

  




















  
});