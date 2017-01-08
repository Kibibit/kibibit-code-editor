angular.module('kibibitCodeEditor',
  ['angular-loading-bar',
  'ngAnimate',
  'app.routes',
  'treeControl',
  'ui.ace',
  'ngDialog',
  'ngMaterial',
  'FBAngular',
  'ui.layout',
  'ngScrollbars',
  'ngSanitize',
  'hc.marked',
  'emoji',
  'jsonFormatter',
  'ngclipboard',
  'ng.deviceDetector',
  'ngMdIcons'])

.config(['$compileProvider', function($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
}])

.config(['ScrollBarsProvider', function(ScrollBarsProvider) {
  // the following settings are defined for all scrollbars unless the
  // scrollbar has local scope configuration
  ScrollBarsProvider.defaults = {
    scrollButtons: {
      scrollAmount: 'auto', // scroll amount when button pressed
      enable: false // enable scrolling buttons by default
    },
    scrollInertia: 400, // adjust however you want
    axis: 'yx', // enable 2 axis scrollbars by default,
    theme: 'minimal-dark',
    autoHideScrollbar: true
  };
}])

.config(['markedProvider', function(markedProvider) {
  markedProvider.setOptions({
    gfm: true,
    tables: true,
    highlight: function(code, lang) {
      if (lang) {
        try {
          return hljs.highlight(lang, code, true).value;
        } catch (e) {
          return hljs.highlightAuto(code).value;
        }
      } else {
        return hljs.highlightAuto(code).value;
      }
    }
  });
}])

.filter('marked', ['marked', function(marked) {
  return function(input) {
    return marked(input || '');
  };
}])

.run(function() {
  _.mixin({
    'first': function(array, n) {
      var element = _.take(array, n);
      return element.length <= 1 ? element[0] : element;
    },
    'last': function(array, n) {
      var element = _.takeRight(array, n);
      return element.length <= 1 ? element[0] : element;
    },
    'isPromise': function(value) {
      return value && _.isFunction(value.then);
    },
    'color': function(value) {
      return tinycolor(value);
    },
    'queryString': function(originalObj) {
      if (!_.isObject(originalObj)) {
        return;
      }

      var resultString = '';

      for (var key in originalObj) {
        if (resultString !== '') {
          resultString += '&';
        }
        resultString += key + '=' + _.encodeURI(originalObj[key]);
      }

      return resultString;
    },
    'encodeURI': function(value) {
      if (!_.isString(value)) {
        return;
      }

      return encodeURIComponent(value);
    },
    'decodeURI': function(encodedURI) {
      if (!_.isString(value)) {
        return;
      }

      return decodeURIComponent(encodedURI);
    },
    'pluck': _.map,
    'where': _.filter,
    'findWhere': _.find
  });

  chance.mixin({
    'user': function() {
      return {
        name: chance.name(),
        email: chance.email(),
        newMessage: chance.bool(),
        avatar: chance.avatar({fileExtension: 'jpeg'}) + '?d=identicon'
      };
    },
    'file': function() {
      return {
        content: chance.unique(chance.paragraph, 10).join('\n'),
        mimeType: [
          chance.string({pool: 'abcdefghijklmnop', length: 5}), '/',
          chance.string({pool: 'abcdefghijklmnop', length: 5})
        ].join(''),
        path: [
          chance.string({pool: 'abcdefghijklmnop', length: 5}), '/',
          chance.string({pool: 'abcdefghijklmnop', length: 5})
        ].join('')
      };
    },
    'teamName': function generateRandomTeamName() {
      /** The Drug-O-Matic name generator
       *  created by WordLab - http://www.wordlab.com
       *  - please do not plunder without credit. Thank you.
       */
      var max1 = 283;
      var max2 = 177;
      var max3 = 367;

      var index1 = Math.round(Math.random() * max1);
      var index2 = Math.round(Math.random() * max2);
      var index3 = Math.round(Math.random() * max3);

      var array1 = new Array('Ancient ','Angry ','Annoying ','Artificial ',
        'Atomic ','Awful ','Bad ','Beige ','Big ','Bitchy ','Bitter ','Black ',
        'Blue ','Boiling ','Bottom ','Bouncing ','Brass ','Breakaway ','Brown ',
        'Bumbling ','Buzzing ','Bygone ','Chernobyl ','Chillin ','Choking ',
        'Chronic ','Clumsy ','Cold ','Copperhead ','Country ','Curving ',
        'Cutting ','Damaged ','Dancing ','Dastardly ','Dead ','Deadly ','Deep ',
        'Dirty ','Distinguished ','Dramatic ','Drinking ','East ','Eastern ',
        'El ','Electric ','Emotional ','End ','Engorged ','Enraged ',
        'Extended ','Famous ','Fat ','Final ','Finishing ','Flashing ',
        'Flattened ','Flaunting ','Flying ','Former ','Fortunate ','Foul ',
        'Friday ','Frozen ','Fumbling ','Furious ','Gentle ','Giant ',
        'Gigantic ','Gloating ','Global ','Gold ','Golden ','Gonzo ','Good ',
        'Gothic ','Great ','Green ','Gritty ','Grumbling ','Grumpy ',
        'Grunting ','Hack ','Hard ','Headless ','Heartland ','Hideous ',
        'Hilltop ','Hissing ','Homeland ','Hopping ','Horny ','Hot ',
        'Huckin ','Huge ','Humble ','Indigo ','Infamous ','Inland ',
        'Inner ','Instant ','International ','Invisible ','Irrational ',
        'Irregular ','Irrelevant ','Johnny ','Jumping ','Junk ','Killing ',
        'La ','Lady ','Lake ','Large ','Las ','Latin ','Lazy ','Le ',
        'Leaping ','Legal ','Legendary ','Limping ','Lingering ','Little ',
        'Long ','Longshot ','Los ','Lucky ','Macho ','Magenta ',
        'Majestic ','Marvelous ','Mauve ','Mental ','Mighty ','Moist ',
        'Multiple ','Mysterious ','Nada ','New ','Nile ','No ','Noble ',
        'North ','Northern ','Nutty ','Optimistic ','Orange ','Outer ',
        'Paper ','Part-Time ','Pastel ','Peculiar ','Pesky ','Phat ',
        'Plastic ','Prancing ','Prickly ','Prison ','Psychic ','Psychotic ',
        'Purple ','Pyroclastic ','Quivering ','Rabid ','Random ','Ravaged ',
        'Ravishing ','Raw ','Reconditioned ','Red ','Redundant ',
        'Reformed ','Regular ','Roasting ','Royal ','Running ','Salty ',
        'Salty ','Saturday ','Savage ','Scalding ','Screaming ',
        'Sealevel ','Seaside ','Seaview ','Sexy ','Shivering ','Shooting ',
        'Short ','Silver ','Simmering ','Sitting ','Skinny ','Small ',
        'Soaring ','Soft ','South ','Southern ','Spiked ','Spinning ',
        'Sprinting ','Standing ','Stealth ','Steel ','Stiff ','Stomping ',
        'Strategic ','Streaking ','Streetwise ','Strutting ','Stumbling ',
        'Stupid ','Sucky ','Sunday ','Sweaty ','Sweeping ','Sweet ',
        'Swishing ','Tacky ','Tainted ','Tall ','Tan ','Terrible ',
        'Terrifying ','Testy ','The ','The ','The ','The ','The ','The ',
        'The ','The ','The ','The ','The ','The ','The ','The ','The ',
        'The ','The ','The ','The ','The ','The ','The ','The ','The ',
        'The ','The ','The ','The ','The ','The ','Thick ','Tiny ',
        'Titanium ','Top ','Tri-City ','Tri-County ','Triple ',
        'Tripping ','Trudging ','Twirling ','Ugly ','Unemployed ',
        'Unfair ','Vaulting ','Victorious ','Violet ','Viral ',
        'Volleywood ','Walking ','Watery ','Wayside ','West ','Western ',
        'Whirling ','White ','Wise ','Woebegone ','Yellow ');

      var array2 = new Array('','','','','','','','','','','','','','','','',
        '','','','','','','','','','','','','','','','','','','','','','',
        '','','Air ','Ass ','Astro ','Axe ','Bacon ','Ball ','Ballz ',
        'Bayside ','Bean ','Beat ','Bedtime ','Beige ','Black ','Blank ',
        'Blue ','Boomerang ','Bovine ','Breakfast ','Brick ','Brown ',
        'Bug ','Bush ','Butt ','Butte ','Cat ','Caviar ','Champagne ',
        'Chemical ','City ','Cliff ','Cloud ','Concrete ','Court ',
        'Day ','Death ','Desert ','Diamond ','Dog ','Donkey ','Dope ',
        'Drug ','End ','Endzone ','Field ','Fire ','Foam ','Free ',
        'Freedom ','Geo ','Goal ','Gonzo ','Goon ','Grass ','Gravity ',
        'Green ','Grunting ','Happy ','HelterSkelter ','Hill ','Indigo ',
        'InnerCity ','Jet ','Karma ','Land ','Laughing ','Leather ',
        'Liberty ','Lightning ','Luck ','Lucky ','Lunatic ','Mad ',
        'Magenta ','Magic ','Marsh ','Mauve ','Metal ','Midnight ',
        'Milk ','Mountain ','Murder ','Net ','Night ','Nova ',
        'Novelty ','Ocean ','Orange ','Ozone ','Paper ','Pastel ',
        'Picnic ','Pinewoods ','Pony ','Postal ','Puck ','Pulp ',
        'Purple ','Rag ','Red ','Return ','Roast ','Score ',
        'Scoreless ','Sea ','Sky ','Slime ','Smoke ','Sore ','Space ',
        'Steel ','Streak ','Street ','Strike ','Stucco ','Surf ',
        'Swamp ','Sweat ','Tan ','Taupe ','Thunder ','Titanium ',
        'Touch ','Tundra ','Turf ','Turtle ','Uniform ','Violet ',
        'Volley ','Voodoo ','Water ','White ','Whiz ','Wicket ',
        'Wood ','World ','Worm ','Yellow ','Zone');

      var array3 = new Array('','','','','','','','','','','A-holes',
        'Addicts','Afrostars','Aftermath','Aggies','Anacondas','Apocalypse',
        'Armageddon','Assassins','Attackers','Avalanche','Avengers',
        'Babies','Bangers','Banshees','Basilisks','Bastards','Beancounters',
        'Beaters','Beatniks','Bison','Bitches','Blast','Blasters',
        'Blisters','Blitz','Bluehairs','Boils','Bombers','Boneheads',
        'Boxers','Boys','Bricks','Bruisers','Bugs','Burnouts','Busters',
        'Butterflies','Buzzards','Cacophony','Carp','Chameleons','Champs',
        'Chard','Chillers','Chokers','Chumps','Cicadas','Cleavage','Clones',
        'Clowns','Cockpits','Cockrats','Cockroaches','Corsairs','Crabs',
        'Crawlers','Crew','Croppers','Crows','Crunchers','Cult','Curves',
        'Cyclops','Dabblers','Damage','Deadheads','Dervish','Desperados',
        'Destroyers','Diggers','Dirtbags','Doctors','Dogs','Dribblers',
        'Ducks','Dudes','Dunkers','Dwellers','Easterners','Einsteins',
        'Elephants','Elves','Empire','Enchiladas','Epidemic','Fairies',
        'Fallout','Family','Farmers','Feeders','Femmes','Fighters',
        'Finish','Fish','Flash','Flashers','Flies','Flotsam','Flu','Flux',
        'Flyers','Force','Frogs','Gaffers','Gals','Gamblers','Gamers',
        'Gang','Gargoyles','Gators','Gazelles','Generals','Gentlemen',
        'Geriatrics','Giants','Girls','Gnomes','Goats','Godzillas','Gold',
        'Gophers','Grasshoppers','Graybeards','Greenbacks','Greenspans',
        'Grinders','Groundhogs','Grumblers','Gunners','Gunslingers',
        'Guppies','Guys','Hackers','Hardbodies','Hardhats','Hatters',
        'Hillbillies','Hitmen','Hollyrollers','Honkers','Hookers','Hoops',
        'Hoppers','Horsemen','Hostages','Hotshots','Humblers','Hurl',
        'Hurricanes','Hyenas','Icebergs','Idiots','Imperials','Jackals',
        'Junkers','Killers','Kings','Kittens','Landslide','Leaders',
        'Leprechauns','Llamas','Logic','Longhairs','Longshots','Losers',
        'Lovers','Machine','Magicians','Mailers','Makers','Maniacs',
        'Marionettes','Maulers','Maxwells','Meteors','Militia','Milkers',
        'Miltons','Mimes','Mirage','Missiles','Mobsters','Monkeys',
        'Monsters','Mosquitoes','Mounders','Muzak','Nailers','Nazis',
        'Nerds','Newts','Nitpickers','Nodes','Noose','Norsemen',
        'Northerners','Oldtimers','Operatives','Opossums','Oracles',
        'Order','Orgasms','Orphans','Outlaws','OwnGoalers','Oxen',
        'Pandas','Pandemic','Pandoras','Patsies','Penises','Pests',
        'Phobias','Piranhas','Pirates','Pixies','Plainsmen','Planets',
        'Plasma','Players','Pod','Porcupines','Prawns','Predators',
        'Presidents','Prisoners','Professors','Puppets','Puppies',
        'Pussies','Queens','Racers','Ramblers','Rappers','Rats','Razors',
        'Rebels','Rebuttals','Redheads','Renegade','Reptiles',
        'Resistance','Rex','Riot','Rockers','Rockets','Rollers','Roosters',
        'Rounders','Runners','Rush','Salamanders','Samaritans','Samurai',
        'Savages','Scorers','Scorgasms','Scumbags','Sensation','Sentinels',
        'Sharks','Silencers','Silos','Silverbacks','Silverfish','Simpletons',
        'Skeletons','Skyhooks','Slammers','Sliders','Sluts','Snakes',
        'Southerners','Spawn','Spikers','Spinners','Spores','Spree',
        'Sprinters','Spuds','Squad','Squall','Squares','Squirrels',
        'Stampede','Steers','Stingers','Stompers','Stoners','Storm',
        'Stormers','Stormtroopers','Streakers','Strikers','Stripes',
        'Strokers','Stumblers','Summit','Supernovas','Surgeons','Swells',
        'Syndrome','Talcum','Tamales','Tarts','Termites','Terror',
        'Threat','Thrillers','Thunderballs','Tigresses','Tigrettes',
        'Titans','Toads','Toddlers','Tornadoes','Tossers','Tractors',
        'Traders','Trample','Tramps','Triangles','Trippers','Troopers',
        'Turmoil','Turtles','Twins','Twisters','Universe','Urge',
        'Vampires','Vanguard','Vegetables','Venison','Vigilantes',
        'Vikings','Wallabies','Wankers','Wannabees','Warthogs','Wasps',
        'Wedge','Werewolves','Westerners','Whackers','Wheelers',
        'Wigglers','Wipeout','Wolfpack','Woodies','Worms','Wranglers',
        'Zealots','Zombies','Zone','Zonkers');

      return array1[index1] + array2[index2] + array3[index3];
    }
  });
});
