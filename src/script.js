$(document).ready(function() {
  var counter = 0;                          //counts attacks to add damage multiplier
  var activeCharacter;                      //current character
  var activeOpponent;                       //current opponent
  var selectCharacter = true;               //if true, then you can select a new character. Only true at start.
  var selectOponent = false;                //if true, you can select a new opponent.
  var canAttack = false;                    //if false, you cannot attack and attack button does not show up
  $("[data-toggle='tooltip']").tooltip();   //initializes bootstrap tooltip
  $('.attack-btn-div').toggle();            // hides attack-btn-div at start.

  //used to create our four characters
  var Character = function(health, totalHealth, attack, origAttack, counter) {
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

////attaches click event to new game button, which is in a modal that pops up when the game is over. starts a new game.
  $('#new-game-btn, .close').on('click', function() {
    location.reload();
  });

////allows a character to be selected at the start of the game.
  $('.character-container').click(function() {
    if (selectCharacter) {

      //sets your character stats. allows you to select opponent.
      activeCharacter = $(this).data();
      selectCharacter = false;
      selectOponent = true;

      //specifies your character. Your character has a green border.
      $(this).addClass('selected-character');

      //hides tooltip when character is selected
      $('#' + activeCharacter.name).tooltip('dispose');

      //shows you to select an opponent
      $('.main-header').text('Choose Your Opponent');

      //designates opponents based off the character you select. Opponents have red border. 
      $('.all-characters').find('.character-container').not('.selected-character').addClass('opponents');

      //moves selected character to verses area
      $(this).parent().prependTo('.verses');

      //Reveals health bar
      $(this).find('.progress').removeClass('d-none');

      //selects players name and adds it to h2 tag in verses area
      $('.fight-area h2').html(`<span>${$(this).find('.card-title').text()} VS. </span>`).removeClass('d-none');
    }

/////selects current oponent
    if ($(this).hasClass('opponents') && selectOponent) {

      //specifies who you are fighting
      $(this).addClass('current-oponent');

      //sets current opponent stats
      activeOpponent = $(this).data();
      selectOponent = false;
      canAttack = true;
      
      // Checks if attackBtn is toggled. only shows attack button when you can attack.
      $('.attack-btn-div').toggle();
      if ($('#attack-btn').is(':hidden')) {
        $('#attack-btn').toggle();
      }

      //moves selected opponent to verses area
      $(this).parent().appendTo('.verses');

      //hides tooltip when opponent is selected
      $('#' + activeOpponent.name).tooltip('dispose');

      //Cleares out all-characters container if no opponents remain
      if ($('.all-characters .d-flex').children().length === 0) {
        $('.all-characters').remove();
      }

      //displays opponent health bar
      $(this).find('.progress').removeClass('d-none');
      
      //selects current opponents name and adds it to h2 tag in verses area
      $('.fight-area h2').html(`<span>${activeCharacter.name} VS. ${$(this).find('.card-title').text()}</span>`);
    }
  });

  /////attaches click event to attack-btn.
  $('#attack-btn').on('click', function() {
    if (canAttack) {
      counter++;

      //Checks if damage should stack. stacks damage after first move. origAttack is the damgage stack.
      if (counter > 1) {
        activeCharacter.attack += activeCharacter.origAttack;
        activeOpponent.health -= activeCharacter.attack;
        activeCharacter.health -= activeOpponent.counter;
      } else {
        activeOpponent.health -= activeCharacter.attack;
        activeCharacter.health -= activeOpponent.counter;
      }

      //displays attack damage within the #damage-pts div
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

        //displays health as 0
        $('#' + activeCharacter.name).find('.card-body p').text(activeCharacter.health);

        //displays health width as 0 %
        $('#' + activeCharacter.name).find('.bg-danger').css('width', '0');

        //shows modal. adjusts modal to display game over and adds a red bg
        $('#modal-title').text('Game Over');
        $('.modal-header').removeClass('alert-success').addClass('alert-danger');
        $('#new-game-modal').modal('show');
      }

      //checks if opponent has health. adjusts opponent health bar
      if (activeOpponent.health > 0) {
        $('#' + activeOpponent.name).find('.card-body p').text(activeOpponent.health);
        $('#' + activeOpponent.name).find('.bg-danger').css('width', opponentHealthWidth + '%');
   
      } else {
        //runs when opponent has no health. displays empty health bar.
        activeOpponent.health = 0;
        canAttack = false;

        //hides attack-btn
        $('#attack-btn').toggle();

        //displays health as 0
        $('#' + activeOpponent.name).find('.card-body p').text(activeOpponent.health);

        //displays health width as 0 %
        $('#' + activeOpponent.name).find('.bg-danger').css('width', '0');

        //If the all-characters div has no children, then the game is over. 
        if ($('.all-characters .d-flex').children().length === 0) {

          //hides the h2 that displays the character and opponent
          $('.fight-area h2').hide();

          //shows modal
          $('#new-game-modal').modal('show');

        //allows selection of new opponent if one still exists.
        } else {
          //Displays the name of the opponent you defeated
          $('.fight-area h2').html(`You defeated ${activeOpponent.name}!`);

          //Removes defeated opponent and runs the following code after 1.5s
          setTimeout(function() {

            //removes opponent by hiding the element
            $('#' + activeOpponent.name).parent().hide();

            //hides attack-btn-div so you cannot attack or see the damage dealt when an opponent is defeated
            $('.attack-btn-div').toggle();

            //removes display of damage
            $('#damage-pts').html('');

            //adjusts h2 to alert you to choose a new opponent. allows selection of new opponent
            $('.fight-area h2').html('Choose Next Opponent');
            selectOponent = true;
          }, 1500);     
        }
      }
    }
  });
});