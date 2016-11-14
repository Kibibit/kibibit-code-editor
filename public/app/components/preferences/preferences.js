angular.module('kibibitCodeEditor')

.controller('preferencesController', [
	function() {

		var vm = this;

		vm.toppings = [
			{ name: 'Pepperoni', wanted: true },
			{ name: 'Sausage', wanted: false },
			{ name: 'Black Olives', wanted: true },
			{ name: 'Green Peppers', wanted: false }
		];

		vm.settings = [
			{ name: 'Wi-Fi', extraScreen: 'Wi-fi menu', icon: 'wifi', enabled: true },
			{ name: 'Bluetooth', extraScreen: 'Bluetooth menu', icon: 'bluetooth', enabled: false },
		];

		vm.messages = [
			{ id: 1, title: "Message A", selected: false },
			{ id: 2, title: "Message B", selected: true },
			{ id: 3, title: "Message C", selected: true },
		];

		vm.people = chance.unique(chance.user, 5);
	}
]);
