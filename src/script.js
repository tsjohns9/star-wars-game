$(document).ready(function() {

  var selectCharacter = true;
  var selectOponent = false;
  var attackBtn = $(`<div class="col-md-2 mb-3 mb-md-0 text-center"><button type="button" class="btn btn-success btn-lg">Attack</button></div>`);
  var healthBar = $(`<div class="progress"><div class="progress-bar progress-bar-striped bg-danger" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div>`);
  var versesH2;

  //allows a character to be selected at the start of the game.
  $('.character-container').click(function() {
    if (selectCharacter) {
      selectCharacter = false;
      selectOponent = true;
      $(this).addClass('selected-character');
      $('.main-header').text('Choose Your Opponent');

      //all other characters become opponents
      $('.all-characters').find('.character-container')
        .not('.selected-character').addClass('opponents');

      //moves selected character to verses area. Adjusts columns to keep responsive in verses area  
      $(this).parent().appendTo('.verses').removeClass('col-lg-3 col-6').addClass('col-md-5');

      //creates health bar
      var cardBody = $(this).find('.card-body');
      $(healthBar).appendTo(cardBody);

      //adjusts columns to keep opponent characters responsive.
      $('.col-lg-3').removeClass('col-lg-3').addClass('col-lg-4');

      //selects players data-name and adds it to h2 tag in verses area
      versesH2 = $(`<h2 class="text-center mb-4">${$(this).attr('data-name')} VS. </h2>`);
      $(versesH2).prependTo('.fight-area');

    }

    //selects current oponent.
    if ($(this).hasClass('opponents') && selectOponent) {
      $(this).addClass('current-oponent');
      selectOponent = false;
      
      //creates attack button once opponent is selected
      $(attackBtn).appendTo('.verses')

      //moves selected character to verses area, and adjusts columns to keep responsive once in verses area
      $(this).parent().appendTo('.verses').removeClass('col-6').addClass('col-md-5');

      //creates health bar
      var cardBody = $(this).find('.card-body');
      $(healthBar).clone().appendTo(cardBody);
  
      //removes col-lg-4 classes on remaining opponents to keep it responsive
      $('.col-lg-4').removeClass('col-lg-4');

      //selects current oppoents data-name and adds it to h2 tag in verses area
      var vsEnemyH2Span = $(`<span>${$(this).attr('data-name')}</span>`);
      $(vsEnemyH2Span).appendTo(versesH2);
      $('.main-header').text('Remaining Opponents');
    }
  });

  




















  
});