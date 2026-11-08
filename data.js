export const categories = [
  { id: 'all', name: 'All', icon: 'grid' },
  { id: 'move', name: 'Move', icon: 'move' },
  { id: 'mind', name: 'Mind', icon: 'brain' },
  { id: 'make', name: 'Make', icon: 'scissors' },
  { id: 'everyday', name: 'Everyday', icon: 'sun' },
  { id: 'play', name: 'Play', icon: 'dice' },
  { id: 'digital', name: 'Digital', icon: 'keyboard' },
  { id: 'music', name: 'Music', icon: 'music' },
  { id: 'outdoors', name: 'Outdoors', icon: 'compass' },
];

const personal = (id, title, category, icon, target, unit, description, instructions, options = {}) => ({
  id, title, category, icon, target, unit, description, instructions,
  type: 'personal', direction: 'at-least', time: '5 min', ...options,
});

export const challenges = [
  personal('reflexes', 'Reaction time', 'digital', 'bolt', 300, 'ms', 'Measure your reaction time over five rounds.', 'Complete five rounds of the reaction game. The average of those rounds is your result. Device and display latency affect the score; 300 ms is a personal target, not a population average.', {direction:'under', game:'reaction', time:'2 min', tag:'Quick test'}),
  personal('juggle', 'Juggle three balls', 'play', 'juggle', 20, 'catches', 'Count consecutive catches without dropping a ball.', 'Count consecutive catches while juggling three balls. Start counting after the first throw and stop when a ball drops.', {time:'An afternoon'}),
  personal('signature-dish', 'The signature dish', 'everyday', 'chef', 1, 'dish', 'Cook a favourite meal without following a recipe.', 'Cook a complete dish from memory, without following a recipe. Choose a dish you enjoy making and eating.', {time:'An evening'}),
  personal('typing', 'Typing speed', 'digital', 'keyboard', 52, 'WPM', 'Compare your typing speed with a published study.', 'Use the Aalto typing study’s transcription method: 15 unfamiliar English sentences on a physical keyboard. Record words per minute from a comparable test.', {type:'benchmark', direction:'over', time:'5 min', source:{title:'Aalto & Cambridge typing study', year:2018, metric:'Mean: about 52 words per minute', population:'About 168,000 online volunteers. Most were younger and interested in typing; 68% were US-based. This is not a representative sample of the planet.', note:'This comparison uses the published mean, not a global percentile.', url:'https://www.aalto.fi/en/news/the-traits-of-fast-typists-discovered-by-analysing-136-million-keystrokes'}}),
  personal('balance', 'Balance on one leg', 'move', 'balance', 30, 'seconds', 'Test how long you can hold your balance.', 'Time how long you can comfortably stand on one leg, eyes open, without putting the other foot down. Use a clear space with a support nearby.', {time:'2 min'}),
  personal('paper-crane', 'Fold an origami crane', 'make', 'paper', 1, 'crane', 'Fold a crane from memory using one sheet of paper.', 'Fold an origami crane from memory, starting with a square sheet of paper. Practice with instructions first, then try without them.', {time:'20 min'}),
  personal('maths', 'Mental maths', 'mind', 'brain', 20, 'answers', 'Solve addition questions without a calculator.', 'Answer 20 new two-digit addition questions correctly within two minutes, without a calculator. Have someone prepare the questions or use a random question generator.', {time:'2 min'}),
  personal('song', 'Play a whole song', 'music', 'music', 1, 'song', 'Perform a song from start to finish on your instrument.', 'Play a song from beginning to end on an instrument of your choice. Choose a piece appropriate to your level and record the performance if you like.', {time:'A few evenings'}),
  personal('cube', 'Solve a Rubik’s cube', 'play', 'cube', 180, 'seconds', 'Solve a scrambled 3×3 cube against the clock.', 'Start with a scrambled 3×3 Rubik’s cube. Time your solve and stop when every face is complete. Record the time in seconds.', {direction:'under', time:'An afternoon'}),
  personal('birds', 'Bird spotting', 'outdoors', 'bird', 5, 'species', 'Identify local birds by appearance or call.', 'Correctly identify five local bird species by sight or sound. Check each identification against a reliable local guide.', {time:'A weekend'}),
  personal('pushups', 'Push-ups', 'move', 'move', 10, 'reps', 'Count consecutive push-ups with consistent form.', 'Complete ten consecutive push-ups with a consistent form appropriate to you. Choose a variation that feels comfortable and record it in your notes.', {time:'5 min'}),
  personal('knots', 'Knot bad at all', 'make', 'knot', 3, 'knots', 'Tie three practical knots from memory.', 'Tie three different practical knots from memory, then check them against a guide. Choose non-safety-critical uses for this challenge.', {time:'20 min'}),
  personal('memory', 'Word recall', 'mind', 'layers', 10, 'words', 'Recall a list of words after a short break.', 'Study a fresh list of ten unrelated words for one minute. Hide it, wait one minute, and write down as many as you remember correctly.', {time:'3 min'}),
  personal('puncture', 'Fix a puncture', 'everyday', 'bike', 1, 'repair', 'Repair a bicycle tyre and get it holding pressure again.', 'Repair or replace a punctured bicycle inner tube. Check that the tyre holds pressure and the wheel is correctly refitted. Get guidance if needed.', {time:'An afternoon'}),
  personal('shortcuts', 'Keyboard shortcuts', 'digital', 'command', 10, 'shortcuts', 'Use shortcuts for tasks in your everyday apps.', 'Demonstrate ten keyboard shortcuts you use in your everyday apps, from memory. Record which apps and shortcuts you chose.', {time:'10 min'}),
  personal('rhythm', 'Keep the beat', 'music', 'rhythm', 60, 'seconds', 'Tap a steady rhythm along with a metronome.', 'Tap a steady rhythm along with a 90 BPM metronome for one minute. Record yourself to check that you stayed with the beat.', {time:'5 min'}),
  personal('jump-rope', 'Jump rope', 'move', 'rope', 60, 'jumps', 'Count consecutive jumps without catching the rope.', 'Count consecutive comfortable jumps with a skipping rope, stopping when the rope catches. Choose a clear space and take breaks whenever needed.', {time:'10 min'}),
  personal('sketch', 'Continuous-line drawing', 'make', 'pen', 1, 'sketch', 'Draw an object without lifting your pen.', 'Create a continuous-line sketch of an everyday object without lifting your pen. Spend at least five minutes looking and drawing.', {time:'10 min'}),
  personal('countries', 'World geography', 'mind', 'globe', 20, 'countries', 'Locate countries on an unlabelled world map.', 'Name and correctly locate twenty countries on an unlabelled world map. Check your answers on a labelled map afterwards.', {time:'10 min'}),
  personal('plant', 'Plant care', 'everyday', 'leaf', 30, 'days', 'Care for a plant and track its condition for a month.', 'Care for a plant for thirty days. Learn its light and watering needs, and keep a simple note or photo record.', {time:'30 days'}),
  personal('card-trick', 'Pick a card', 'play', 'cards', 1, 'trick', 'Perform a card trick for someone else.', 'Perform one card trick from start to finish for another person. Practice first, then give it a proper reveal.', {time:'An evening'}),
  personal('name-tune', 'Name that tune', 'music', 'headphones', 8, 'songs', 'Identify songs from ten short clips.', 'Ask someone to play ten short clips from songs you both know. Correctly identify at least eight by title or artist.', {time:'10 min'}),
  personal('north', 'Find north', 'outdoors', 'compass', 1, 'direction', 'Guess the direction of north, then check with a compass.', 'In a familiar, safe outdoor spot, point to north without checking your phone. Use a compass afterwards to confirm your guess is within 20 degrees.', {time:'5 min'}),
  personal('outside-meal', 'Lunch outdoors', 'outdoors', 'mountain', 1, 'meal', 'Plan and prepare a meal to enjoy outside.', 'Prepare a simple meal to enjoy outdoors. Plan the ingredients, bring what you need, and leave the place as you found it.', {time:'An afternoon'}),
];
