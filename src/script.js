$(document).ready(function() {

  var counter = 0;
  var activeCharacter;
  var activeOpponent;
  var selectCharacter = true;
  var selectOponent = false;
  var versesH2 = $(`<h2 class="text-center mb-4"></h2>`);
  var attackBtn = $(`<div class="col-md-2 mb-3 mb-md-0 text-center"><button type="button" class="btn btn-success btn-lg" id="attack-btn">Attack</button></div>`);
  var healthBar = $(`<div class="progress"><div class="progress-bar progress-bar-striped bg-danger" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div>`);

  var Character = function(health, totalHealth, attack, counter) {
    this.health = health;
    this.totalHealth = totalHealth;
    this.attack = attack;
    this.counter = counter;
  }

  var luke = new Character(200, 200, 25, 20);
  var rey = new Character(100, 100, 8, 5);
  var kylo = new Character(150, 150, 12, 8);
  var snoke = new Character(180, 180, 20, 15);

  //sets character object to their html element
  $('#luke').data(luke);
  $('#kylo').data(kylo);
  $('#rey').data(rey);
  $('#snoke').data(snoke);

  // var luke = $('#luke');
  // var kylo = $('#kylo');
  // var rey = $('#rey');
  // var snoke = $('#snoke');

  // console.log($('#luke').data().name)

  //attaches click event to attack-btn. Attached to .verses div, and then specifies a selector because the btn was dynamically generated
  $('.verses').on('click', '#attack-btn', function() {
    counter++
    var startingHealth = activeCharacter.totalHealth;
    var startingOpponentHealth = activeOpponent.totalHealth;

    //deals double after first move
    if (counter > 1) {
      activeCharacter.attack *= 2;
      activeOpponent.health -= activeCharacter.attack;
      activeCharacter.health -= activeOpponent.counter;
    } else {
      activeOpponent.health -= activeCharacter.attack;
      activeCharacter.health -= activeOpponent.counter;
    }

    var healthWidth = activeCharacter.health / startingHealth * 100;
    var opponentHealthWidth = activeOpponent.health / startingOpponentHealth * 100;
    
    //deals attack and counter damage. Displays percentage of health left on progress bar.
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

    //Removes defeated enemy and allows selection of new enemy
    if (activeOpponent.health === 0) {
      setTimeout(function() {
        $('#' + activeOpponent.name).remove();
        $(versesH2).html('Choose Next Opponent');
      }, 1000);

      $(versesH2).html('You Win!');
    }



  });

  //allows a character to be selected at the start of the game.
  $('.character-container').click(function() {
    if (selectCharacter) {
      activeCharacter = $(this).data();
      selectCharacter = false;
      selectOponent = true;
      $(this).addClass('selected-character');
      $('.main-header').text('Choose Your Opponent');

      //all other characters become opponents
      $('.all-characters').find('.character-container').not('.selected-character').addClass('opponents');

      //moves selected character to verses area. Adjusts columns to keep responsive in verses area  
      $(this).parent().appendTo('.verses').removeClass('col-lg-3 col-6').addClass('col-md-5');

      //creates health bar
      var cardBody = $(this).find('.card-body');
      $(healthBar).appendTo(cardBody);

      //adjusts columns to keep opponent characters responsive.
      $('.col-lg-3').removeClass('col-lg-3').addClass('col-lg-4');

      //selects players data-name and adds it to h2 tag in verses area
      // versesH2 = $(`<h2 class="text-center mb-4">${$(this).find('.card-title').text()} VS. </h2>`);
      var vsPlayerH2Span = $(`<span>${$(this).find('.card-title').text()} VS. </span>`);
      $(vsPlayerH2Span).appendTo(versesH2);
      $(versesH2).prependTo('.fight-area');
    }

    //selects current oponent.
    if ($(this).hasClass('opponents') && selectOponent) {
      $(this).addClass('current-oponent');
      activeOpponent = $(this).data();
      // console.log(activeOpponent);
      selectOponent = false;
      
      //creates attack button once opponent is selected
      $(attackBtn).appendTo('.verses');

      //moves selected character to verses area, and adjusts columns to keep responsive once in verses area
      $(this).parent().appendTo('.verses').removeClass('col-6').addClass('col-md-5');

      //creates health bar
      var cardBody = $(this).find('.card-body');
      $(healthBar).clone().appendTo(cardBody);
  
      //removes col-lg-4 classes on remaining opponents to keep it responsive
      $('.col-lg-4').removeClass('col-lg-4');

      //selects current oppoents data-name and adds it to h2 tag in verses area
      var vsEnemyH2Span = $(`<span>${$(this).find('.card-title').text()}</span>`);
      $(vsEnemyH2Span).appendTo(versesH2);
      $('.main-header').text('Remaining Opponents');
    }
  });

});