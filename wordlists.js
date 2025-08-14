// wordlists.js (5 topics, expanded; keeps existing entries and adds more)
window.TOPICS = ['Animals','Foods','Games','Cartoons','Occupations'];
window.WORD_LISTS = window.WORD_LISTS || {};

// Helper: merge while preserving your original order, removing duplicates
function mergeList(topic, extra) {
  const original = window.WORD_LISTS[topic] || [];
  const merged = [...new Set([...original, ...extra])];
  window.WORD_LISTS[topic] = merged;
}

// === ANIMALS (additions) ===
mergeList('Animals', [
  'aardwolf','addax','albatross','anaconda','angelfish','anglerfish','antbird','antshrike','axolotl',
  'babirusa','bald eagle','bandicoot','barracuda','basilisk lizard','beetle larva','beluga','binturong',
  'blackbird','blue jay','boa','bobcat','bonobo','bongo','burro',
  'capybara','caracal','cassowary','centipede','chameleon','cicada','civet','coati','condor','cougar',
  'cuttlefish','damselfish','degu','dik-dik','dingo','dodo','dormouse','dromedary',
  'echidna','egret','eland','ermine','eurasian lynx',
  'falabella','fallow deer','fiddler crab','finch','firefly','fisher cat','flounder','fossa','fox terrier','fruit fly',
  'gaur','gazelle','gecko','gerbil','gharial','gibbon','gila monster','goblin shark','goldfinch','goosefish',
  'harp seal','hartebeest','heron','hornbill','horseshoe crab','howler monkey','humpback whale',
  'ibex','ibis','impala','jackrabbit','jacana','jay','jerboa','kakapo','kangaroo rat','katydid',
  'kestrel','kinkajou','kite','kiwi bird','klipspringer','kookaburra','kouprey',
  'lemming','lemur','lionfish','loris','lyrebird','macaque','magpie','manatee','mandrill','markhor',
  'marten','meerkat','mink','mole','mola mola','mongoose','myna','nautilus','narwhal','nighthawk',
  'nudibranch','ocelot','okapi','opossum shrimp','oriole','oryx','oyster','pangolin','peccary','peregrine falcon',
  'pheasant','pika','platypus','porpoise','ptarmigan','pufferfish','puma','python',
  'quetzal','quokka','quoll','ray','red panda','reindeer','roadrunner',
  'saiga','salamander','sandpiper','sardine','sea urchin','serval','shoebill','silkworm','spoonbill','squid','starling','stingray',
  'sugar glider','swift','tamarin','tapir','tarantula','tasmanian devil','tern','thorny devil','thrush','toucan',
  'tuatara','tuna','uakari','urial','vicuna','viper','walleye','warthog','weasel','whip-poor-will',
  'wildebeest','wobbegong','wolverine','woodlouse','yakutian horse','yellowhammer','zebu'
]);

// === FOODS (additions) ===
mergeList('Foods', [
  'bagel','baguette','baked potato','barbecue','bbq ribs','bento','bibimbap','biscuit','bisque','burrito',
  'cabbage rolls','cacio e pepe','calzone','cannoli','caprese salad','carne asada','casserole','ceviche','cheeseburger',
  'cheesesteak','chimichanga','chili','chips and salsa','chow mein','clam chowder','club sandwich','collard greens',
  'couscous','crab cake','croissant','curry','dal','deviled eggs','dumplings','edamame','egg rolls','empanada',
  'enchiladas','fajitas','falafel','fried chicken','fried rice','frittata','garlic bread','gelato','gnocchi',
  'greek salad','grilled cheese','grits','gumbo','gyoza','gyro','halibut','ham sandwich','hummus','ice cream sandwich',
  'jambalaya','jerk chicken','kebab','kimchi','korean bbq','laksa','lasagna','lobster roll','mac and cheese','macaroni salad',
  'maki','mapo tofu','mashed potatoes','meatballs','meatloaf','miso soup','mochi','moussaka','muffin','nachos',
  'nigiri','noodles','oatmeal','omelet','onion rings','pad thai','paella','pakora','pancakes','paneer tikka',
  'panzanella','parmigiana','peking duck','pho','pierogi','pita','pizzetta','poached eggs','poke bowl','polenta',
  'pork chops','pot pie','quesadilla','quiche lorraine','ramen','ratatouille','refried beans','risotto','roast beef','roasted veggies',
  'samosa','sandwich','sashimi','sausage','shawarma','shepherds pie','shrimp scampi','smoothie','soba','souvlaki',
  'spaghetti','spring rolls','steak','stew','stir fry','stuffed peppers','succotash','sushi','tacos','tamagoyaki',
  'tamales','tempura','teriyaki','tikka masala','tiramisu','toast points','tofu','tortilla soup','tuna melt','udon bowl',
  'veggie burger','waffles','wild rice','yakisoba','yukon fries','ziti bake'
]);

// === GAMES (additions) ===
mergeList('Games', [
  'uno','uno flip','phase 10','skip-bo','go','mahjong','yahtzee','rummy','canasta','euchre','hearts','spades','gin rummy',
  'old maid','war','crazy eights','skat','bridge','dominoes','backgammon','go fish','connect four','battleship','risk','clue',
  'catan','ticket to ride','carcassonne','pandemic','azul','splendor','dixit','codenames','taboo','pictionary','charades',
  'twister','jenga','boggle','trivial pursuit','guess who','operation','kerplunk','mancala','ouija','tic tac toe','paper football',
  'hangman','simon says','red light green light','four square','marbles','jacks','kick the can','capture the flag','duck duck goose',
  'musical chairs','freeze tag','telephone game','truth or dare','spin the bottle','werewolf','one night werewolf','mafia','avalon',
  'exploding kittens','bananagrams','monopoly deal','wordle','crossword','sudoku','kakuro','nonogram','minesweeper','snake',
  'tetris','pac-man','space invaders','donkey kong','street fighter','mortal kombat','mario kart','super smash bros','zelda',
  'pokemon','animal crossing','minecraft','roblox','fortnite','apex legends','call of duty','overwatch','league of legends','dota',
  'valorant','hearthstone','starcraft','rocket league','fifa','nba 2k','madden','just dance','guitar hero','beat saber',
  'geo guesser','portal','bioshock','halo','diablo','the sims'
]);

// === CARTOONS (additions) ===
mergeList('Cartoons', [
  'adventure time','regular show','steven universe','gravity falls','avatar the last airbender','the legend of korra',
  'phineas and ferb','kim possible','the owl house','amphibia','bluey','peppa pig','paw patrol','dora the explorer','go diego go',
  'caillou','arthur','curious george','looney tunes','tiny toons','animaniacs','the fairly oddparents','danny phantom',
  'hey arnold','rugrats','doug','rockos modern life','catdog','johnny bravo','the powerpuff girls','samurai jack',
  'dexters laboratory','ben 10','fosters home for imaginary friends','the amazing world of gumball','chowder',
  'home movies','south park','family guy','american dad','king of the hill','rick and morty','bojack horseman','big mouth',
  'bobs burgers','disenchantment','star vs the forces of evil','she-ra and the princesses of power','voltron legendary defender',
  'teen titans','teen titans go','young justice','x-men the animated series','batman the animated series','spider-man the animated series',
  'gargoyles','darkwing duck','ducktales','chip n dale rescue rangers','tailspin','recess','teacher’s pet','the weekenders',
  'code lyoko','winx club','sailor moon crystal','dragon ball z','dragon ball super','naruto shippuden','one piece','bleach',
  'my hero academia','demon slayer','attack on titan','fullmetal alchemist brotherhood','cowboy bebop','yu-gi-oh','beyblade',
  'cardcaptor sakura','inuyasha','fairy tail','sailor moon r','pokemon journeys','digimon'
]);

// === OCCUPATIONS (additions) ===
mergeList('Occupations', [
  'accountant','actor','actuary','administrator','air traffic controller','analyst','animator','archaeologist','architect',
  'artist','astronaut','attorney','audio engineer','baker','banker','barber','bartender','biologist','bookkeeper',
  'bricklayer','bus driver','butcher','cab driver','carpenter','cashier','chef','chemical engineer','chemist','chiropractor',
  'civil engineer','coach','construction worker','consultant','content creator','cook','copywriter','court reporter',
  'customer service representative','data analyst','data engineer','data scientist','dental hygienist','dentist','designer',
  'developer','dietitian','dispatcher','doctor','driver','electrician','emergency medical technician','event planner',
  'farmer','farrier','fashion designer','filmmaker','financial advisor','firefighter','fisherman','flight attendant','florist',
  'game designer','gardener','geologist','graphic designer','hair stylist','housekeeper','hr manager','interpreter','janitor',
  'journalist','judge','landscaper','lawyer','lecturer','librarian','lifeguard','line cook','locksmith','machine operator',
  'mail carrier','maintenance worker','marketing manager','massage therapist','mechanic','medical assistant','meteorologist',
  'midwife','miner','musician','network engineer','nutritionist','occupational therapist','office manager','optometrist',
  'painter','paramedic','park ranger','pharmacist','photographer','physical therapist','physician','physicist','pilot',
  'plumber','police officer','politician','postal worker','principal','producer','product manager','programmer',
  'project manager','psychiatrist','psychologist','publicist','quality assurance tester','real estate agent','receptionist',
  'researcher','sailor','salesperson','scientist','security guard','social worker','software engineer','soldier',
  'speech therapist','statistician','surgeon','taxi driver','teacher','teacher aide','technician','therapist','translator',
  'truck driver','tutor','uber driver','veterinarian','videographer','waiter','waitress','welder','writer','yoga instructor',
  'zookeeper'
]);

// Optional: ensure each topic exists even if the original file didn’t have it
['Animals','Foods','Games','Cartoons','Occupations'].forEach(t => {
  window.WORD_LISTS[t] = window.WORD_LISTS[t] || [];
});
