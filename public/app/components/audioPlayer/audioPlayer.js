angular.module('kibibitCodeEditor')

.directive('kbAudioPlayer', function() {
  return {
    scope: {},
    bindToController: {
      audioFile: '=kbAudioFile'
    },
    controller: 'audioPlayerController',
    controllerAs: 'audioPlayerCtrl',
    templateUrl: 'app/components/audioPlayer/audioPlayerTemplate.html',
    link: function(scope, element, attrs, audioPlayerCtrl) {
      scope.$watch('audioPlayerCtrl.audioFile', function(newAudioFile) {
        audioPlayerCtrl.updatePlayer(newAudioFile);
      });
    }
  };
})

.controller('audioPlayerController', [
  '$timeout',
  'ngAudio',
  function(
    $timeout,
    ngAudio) {

    var vm = this;

    vm.audio = ngAudio.load(vm.audioFile.url);
    vm.audio.playbackRate = 1;
    vm.image = vm.audioFile.albumArt;

    var filenameRegex = /[\\\/]([^\\\/]+)$/;
    vm.fileName = filenameRegex.exec(vm.audioFile.path)[1];

    vm.updatePlayer = function() {
      
    };

    function toImage(imageData, format) {
      var base64String = "";
      for (var i = 0; i < imageData.length; i++) {
          base64String += String.fromCharCode(imageData[i]);
      }
      var base64 = "data:" + format + ";base64," +
              window.btoa(base64String);
    }

  }
]);
