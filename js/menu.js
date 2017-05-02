(function() {

  GroupGame.drawBackground();

  var $gameContainer = document.querySelector('.game');

  var $newGameButton = document.querySelector('.new-game-button');
  $newGameButton.addEventListener('click', function() {
    $gameContainer.innerHTML = '';
    GroupGame.newGame({
      container: $gameContainer,
      columns: 3,
      rows: 3
    });
  });

  var $scrambleButton = document.querySelector('.scramble-button');
  $scrambleButton.addEventListener('click', function() {
    GroupGame.scramble(2);
  });

})();
