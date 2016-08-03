angular.module('kibibitCodeEditor')

.directive('kbZombify', function() {
  return {
    scope: {},
    controller: 'zombifyController',
    controllerAs: 'zombifyCtrl',
    bindToController: {
      ngModel: '='
    },
  };
})

.controller('zombifyController', function() {

  var vm = this;

  var zombieCount = 0;
  var zombiesToCreate = 0;
  var score = 0;
  var end = false;
  var zombiesHolderDiv;

  function create() {
    zombiesHolderDiv = document.createElement('div');
    zombiesHolderDiv.setAttribute('id', 'zombies');
    document.body.appendChild(zombiesHolderDiv);
    addZombie();
  }

  function showText(message) {
    var textOverlay = document.createElement('div');
    textOverlay.innerText = message;
    textOverlay.setAttribute('id', 'overlay');
    textOverlay.classList.add('bounceIn');
    document.body.appendChild(textOverlay);
  }

  function gameOver() {
    end = true;
    alert('GAME OVER! YOU KILLED ' +
      score +
      ' ZOMBIES BEFORE BECOMING ZOMBIEFOOD!');
    zombiesHolderDiv.parentNode.removeChild(zombiesHolderDiv);
    vm.ngModel = false;
  }

  function random(min, max) {
    return Math.ceil((min * 1000) + (Math.random() * (max * 1000)));
  }

  function addScore() {
    zombiesToCreate++;
    zombieCount--;
    score++;
    /*chrome.extension.sendMessage({score: score}, function (response) {
      if (response.message) {
        showText(response.message);
      }
    });*/
  }

  function addZombie() {
    if(end) {
      return;
    }

    var div = document.createElement('div');
    div.setAttribute('class', 'zombie-' + Math.round(Math.random()));

    div.addEventListener('click', function(e) {
      div.parentNode.removeChild(div);
      addScore();
      window.setTimeout(addZombie, random(1, 3));
    });

    zombiesHolderDiv.appendChild(div);
    if(zombiesToCreate > 0) {
      zombiesToCreate--;
      window.setTimeout(addZombie, random(2, 5));
    }

    zombieCount++;
    if(zombieCount > 20) {
      gameOver();
    }
  }

  create();
});
