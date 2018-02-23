$(document).ready(function() {
  var counter = 0;
  var activeCharacter;
  var activeOpponent;
  var selectCharacter = true;
  var selectOponent = false;
  var canAttack = false;
  var vsPlayerH2Span;
  var versesH2 = $(`<h2 class="text-center mb-4 alert alert-warning w-50 mx-auto"></h2>`);
  var attackBtn = $(`<div class="mb-3 mb-md-0 text-center"><button type="button" class="btn btn-success" id="attack-btn">Attack</button></div>`);
  var healthBar = $(`<div class="progress"><div class="progress-bar progress-bar-striped bg-danger" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div>`);

  var Character = function(health, totalHealth, attack, origAttack, counter, ) {
    this.health = health;
    this.totalHealth = totalHealth;
    this.attack = attack;
    this.counter = counter;
    this.origAttack = origAttack;
  }

  //sets character object to their html element
  $('#luke').data(new Character(225, 225, 20, 20, 18));
  $('#kylo').data(new Character(130, 130, 10, 10, 7));
  $('#rey').data(new Character(125, 125, 7, 7, 5));
  $('#snoke').data(new Character(165, 165, 15, 15, 9));

////attaches click event to new game button, which is in a modal that pops up when the game is over
  $('#new-game-btn, .close').on('click', function() {
    location.reload();
  });

/////attaches click event to attack-btn. Attached to .verses div, and then specifies a selector because the btn was dynamically generated
  $('.verses').on('click', '#attack-btn', function() {
    if (canAttack) {
      counter++;
      //keeps track each attack to stack attack power. 
      var startingHealth = activeCharacter.totalHealth;  //may not need these 2 variables
      var startingOpponentHealth = activeOpponent.totalHealth;
      //stacks damage after first move. origAttack is what gets added to activeCharacter.Attack.
      if (counter > 1) {
        activeCharacter.attack += activeCharacter.origAttack;
        activeOpponent.health -= activeCharacter.attack;
        activeCharacter.health -= activeOpponent.counter;
      } else {
        activeOpponent.health -= activeCharacter.attack;
        activeCharacter.health -= activeOpponent.counter;
      }

      //Displays percentage of health left on progress bar if health is greater than 0.
      var healthWidth = activeCharacter.health / startingHealth * 100;
      var opponentHealthWidth = activeOpponent.health / startingOpponentHealth * 100;
      if (activeCharacter.health > 0) {
        $('#' + activeCharacter.name).find('.card-body p').text(activeCharacter.health);
        $('#' + activeCharacter.name).find('.bg-danger').css('width', healthWidth + '%');      
      } else {
        activeCharacter.health = 0;
        $('#' + activeCharacter.name).find('.card-body p').text(activeCharacter.health);
        $('#' + activeCharacter.name).find('.bg-danger').css('width', '0');  
      }
      if (activeOpponent.health > 0) {
        $('#' + activeOpponent.name).find('.card-body p').text(activeOpponent.health);
        $('#' + activeOpponent.name).find('.bg-danger').css('width', opponentHealthWidth + '%');      
      } else {
        activeOpponent.health = 0;
        $('#' + activeOpponent.name).find('.card-body p').text(activeOpponent.health);
        $('#' + activeOpponent.name).find('.bg-danger').css('width', '0');  
      }
    }

    //Removes defeated enemy and allows selection of new enemy
    if (activeOpponent.health === 0) {
      canAttack = false;
      $(attackBtn).toggle();
      //If all opponents are defeated then the game is over
      if ($('.all-characters .d-flex').children().length === 0) {
        // $(versesH2).removeClass('alert-warning').addClass('alert-success').html(`You Won!`);
        $(versesH2).remove();
        $('#new-game-modal').modal('show');
      //allows selection of new opponent if one still exists.
      } else {
          //Displays the name of the opponent you defeated
          $(versesH2).html(`You defeated ${activeOpponent.name}!`);
          setTimeout(function() {
            //Removes defeated opponent
            $('#' + activeOpponent.name).parent().hide();
            $(versesH2).html('Choose Next Opponent');
            selectOponent = true;
          }, 1500);      
        }
    }

    //restarts game on loss. removes verses h2 tag. changes modal alert style
    if (activeCharacter.health === 0) {
      canAttack = false;
      $(versesH2).remove();
      $('.alert-danger').removeClass('d-none')
      $('#modal-title').text('Game Over');
      $('.modal-header').removeClass('alert-success').addClass('alert-danger');
      $('#new-game-modal').modal('show');
    }
  });

////allows a character to be selected at the start of the game.
  $('.character-container').click(function() {
    if (selectCharacter) {
      activeCharacter = $(this).data();
      selectCharacter = false;
      selectOponent = true;
      $(this).addClass('selected-character');
      $('.main-header').text('Choose Your Opponent');

      //designates opponents. moves selected character to verses area
      $('.all-characters').find('.character-container').not('.selected-character').addClass('opponents');
      $(this).parent().appendTo('.verses');

      //creates health bar
      var cardBody = $(this).find('.card-body');
      $(healthBar).appendTo(cardBody);

      //selects players name and adds it to h2 tag in verses area
      vsPlayerH2Span = $(`<span>${$(this).find('.card-title').text()} VS. </span>`);
      $(vsPlayerH2Span).appendTo(versesH2);
      $(versesH2).prependTo('.fight-area');
    }

/////selects current oponent.
    if ($(this).hasClass('opponents') && selectOponent) {
      $(this).addClass('current-oponent');
      activeOpponent = $(this).data();
      selectOponent = false;
      canAttack = true;
      
      //creates attack button once opponent is selected. Checks if attackBtn is toggled.
      $(attackBtn).appendTo('.verses');
      if ($(attackBtn).is(':hidden')) {
        $(attackBtn).toggle();
      }

      //moves selected character to verses area
      $(this).parent().appendTo('.verses');

      //Cleares out all-characters container if no opponents remain
      if ($('.all-characters .d-flex').children().length === 0) {
        $('.all-characters').remove();
      }

      //creates health bar
      var cardBody = $(this).find('.card-body');
      $(healthBar).clone().appendTo(cardBody);
  
      //selects current oppoents name and adds it to h2 tag in verses area
      var vsEnemyH2Span = $(`<span>${$(this).find('.card-title').text()}</span>`);
      $(versesH2).empty();
      $(vsPlayerH2Span).appendTo(versesH2);
      $(vsEnemyH2Span).appendTo(versesH2);
      $('.main-header').text('Remaining Opponents');
    }
  });
});