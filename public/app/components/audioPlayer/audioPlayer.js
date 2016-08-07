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
        audioPlayerCtrl.updatePlayer();
      });
    }
  };
})

.controller('audioPlayerController', [
  '$scope',
  '$timeout',
  'ngAudio',
  function(
    $scope,
    $timeout,
    ngAudio) {

    var vm = this;

    vm.updatePlayer = updatePlayer;
    vm.start = start;

    function updatePlayer() {
      var volume = 1;
      if (vm.audio) {
        vm.audio.pause();
        volume = vm.audio.volume;
      }

      vm.audio = ngAudio.load(vm.audioFile.url);
      vm.audio.playbackRate = 1;
      vm.audio.volume = volume;
      vm.image = vm.audioFile.albumArt || 'assets/images/no-cover-large.png';

      var filenameRegex = /[\\\/]([^\\\/]+)$/;
      vm.fileName = filenameRegex.exec(vm.audioFile.path)[1];
    }

    function start() {
      // visualization
      vm.context = new AudioContext();
      vm.analyzer = vm.context.createAnalyser();
      vm.source = vm.context.createMediaElementSource(vm.audio.audio);
      //vm.source.connect(vm.analyser);
      vm.analyzer.connect(vm.context.destination);
      // END visualization
      vm.audio.play();
    }

  }
]);
