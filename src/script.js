$(document).ready(function() {
  var counter = 0;                      //counts attacks to add damage multiplier
  var activeCharacter;                  //current character
  var activeOpponent;                   //current opponent
  var selectCharacter = true;           //if true, then you can select a new character. Only true at start.
  var selectOponent = false;            //if true, you can select a new opponent.
  var canAttack = false;                //if false, you cannot attack and attack button does not show up
  var vsPlayerH2Span;                   //h2 changes to display current character and opponent, and only shows up when character is selected.
  var versesH2 = $(`<h2 class="text-center mb-4 alert alert-warning w-50 mx-auto"></h2>`);
  var attackBtn = $(`<div class="mb-3 mb-md-0 text-center"><button type="button" class="btn btn-success mb-2" id="attack-btn">Attack</button><div id="damage-pts"></div></div>`);
  var healthBar = $(`<div class="progress"><div class="progress-bar progress-bar-striped bg-danger" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div>`);
  var opponentHealthBar = $(`<div class="progress"><div class="progress-bar progress-bar-striped bg-danger" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div>`);

  //used to create our four characters
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
      //stacks damage after first move. origAttack is what gets added to activeCharacter.Attack.
      if (counter > 1) {
        activeCharacter.attack += activeCharacter.origAttack;
        activeOpponent.health -= activeCharacter.attack;
        activeCharacter.health -= activeOpponent.counter;
      } else {
        activeOpponent.health -= activeCharacter.attack;
        activeCharacter.health -= activeOpponent.counter;
      }

      //displays attack damage within the #damage-pts div, which is made within the attackBtn variable
      $('#damage-pts').html(`<p class="text-white">You attacked ${activeOpponent.name} for ${activeCharacter.attack} damage!</p><p class="text-white">${activeOpponent.name} attacked you for ${activeOpponent.counter} damage!</p>`);

      //Displays percentage of health left on progress bar if health is greater than 0.
      var healthWidth = activeCharacter.health / activeCharacter.totalHealth * 100;
      var opponentHealthWidth = activeOpponent.health / activeOpponent.totalHealth * 100;
      if (activeCharacter.health > 0) {
        $('#' + activeCharacter.name).find('.card-body p').text(activeCharacter.health);
        $('#' + activeCharacter.name).find('.bg-danger').css('width', healthWidth + '%');
      } else {
        //runs when character health is less than 0. displays an empty health bar, and alerts the game over modal.
        activeCharacter.health = 0;
        canAttack = false;
        $(versesH2).remove();
        $('#' + activeCharacter.name).find('.card-body p').text(activeCharacter.health);
        $('#' + activeCharacter.name).find('.bg-danger').css('width', '0');
        $('.alert-danger').removeClass('d-none')
        $('#modal-title').text('Game Over');
        $('.modal-header').removeClass('alert-success').addClass('alert-danger');
        $('#new-game-modal').modal('show');
      }

      //checks if opponent has health. displays opponent health bar
      if (activeOpponent.health > 0) {
        $('#' + activeOpponent.name).find('.card-body p').text(activeOpponent.health);
        $('#' + activeOpponent.name).find('.bg-danger').css('width', opponentHealthWidth + '%');
      } else {
        //runs when opponent has no health. displays empty health bar.
        activeOpponent.health = 0;
        canAttack = false;
        $('#attack-btn').toggle();
        $('#' + activeOpponent.name).find('.card-body p').text(activeOpponent.health);
        $('#' + activeOpponent.name).find('.bg-danger').css('width', '0');

        //If all opponents are defeated then the game is over
        if ($('.all-characters .d-flex').children().length === 0) {
          $(versesH2).remove();
          $('#new-game-modal').modal('show');

        //allows selection of new opponent if one still exists.
        } else {
          $(versesH2).html(`You defeated ${activeOpponent.name}!`);

          //Removes defeated opponent
          setTimeout(function() {
            $('#' + activeOpponent.name).parent().hide();
            $(attackBtn).toggle();
            $('#damage-pts').html('');
            $(versesH2).html('Choose Next Opponent');
            selectOponent = true;
          }, 1500);     
        }
      }
    }
  });

////allows a character to be selected at the start of the game.
  $('.character-container').click(function() {
    if (selectCharacter) {
      //sets your character stats. allows you to select opponent.
      activeCharacter = $(this).data();
      selectCharacter = false;
      selectOponent = true;
      $(this).addClass('selected-character');
      $('.main-header').text('Choose Your Opponent');

      //designates opponents. moves selected character to verses area
      $('.all-characters').find('.character-container').not('.selected-character').addClass('opponents');
      $(this).parent().appendTo('.verses');

      //creates health bar
      $(healthBar).appendTo($(this).find('.card-body'));

      //selects players name and adds it to h2 tag in verses area
      vsPlayerH2Span = $(`<span>${$(this).find('.card-title').text()} VS. </span>`);
      $(vsPlayerH2Span).appendTo(versesH2);
      $(versesH2).prependTo('.fight-area');
    }

/////selects current oponent.
    if ($(this).hasClass('opponents') && selectOponent) {
      $(this).addClass('current-oponent');
      //sets current opponent stats
      activeOpponent = $(this).data();
      selectOponent = false;
      canAttack = true;
      
      //creates attack button once opponent is selected. Checks if attackBtn is toggled. only shows attack button when you can attack.
      $(attackBtn).appendTo('.verses');
      if ($('#attack-btn').is(':hidden')) {
        $(attackBtn).toggle();
        $('#attack-btn').toggle();
      }

      //moves selected character to verses area
      $(this).parent().appendTo('.verses');

      //Cleares out all-characters container if no opponents remain
      if ($('.all-characters .d-flex').children().length === 0) {
        $('.all-characters').remove();
      }

      //creates health bar
      $(opponentHealthBar).find('.bg-danger').css('width', '100%');
      $(opponentHealthBar).appendTo($(this).find('.card-body'));
      
      //selects current opponents name and adds it to h2 tag in verses area
      var vsEnemyH2Span = $(`<span>${$(this).find('.card-title').text()}</span>`);
      $(versesH2).empty();
      $(vsPlayerH2Span).appendTo(versesH2);
      $(vsEnemyH2Span).appendTo(versesH2);
      $('.main-header').text('Remaining Opponents');
    }
  });
});