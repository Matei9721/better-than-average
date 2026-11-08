export const categories = [
  { id: 'all', name: 'All things', icon: 'spark' },
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
  personal('reflexes', 'Blink and you’ll miss it', 'digital', 'bolt', 300, 'ms', 'A tiny test of quick hands and a switched-on brain.', 'Complete five rounds of the reaction game. The average of those rounds is your result. Device and display latency affect the score; 300 ms is a playful target, not a population average.', {direction:'under', game:'reaction', time:'2 min', tag:'Try it here'}),
  personal('juggle', 'A little juggling act', 'play', 'juggle', 20, 'catches', 'Three balls. Two hands. A surprisingly satisfying party trick.', 'Count consecutive catches while juggling three balls. Start counting after the first throw and stop when a ball drops.', {time:'An afternoon'}),
  personal('signature-dish', 'The signature dish', 'everyday', 'chef', 1, 'dish', 'That one meal you can confidently call your thing.', 'Cook a complete dish from memory, without following a recipe. Choose a dish you enjoy making and eating.', {time:'An evening'}),
  personal('typing', 'Fast fingers, clear words', 'digital', 'keyboard', 52, 'WPM', 'See how your keyboard skills compare with a published study.', 'Use the Aalto typing study’s transcription method: 15 unfamiliar English sentences on a physical keyboard. Record words per minute from a comparable test. This comparison uses the published mean, not a global percentile.', {type:'benchmark', direction:'over', time:'5 min', tag:'Study comparison', source:{title:'Aalto & Cambridge typing study', year:2018, metric:'Mean: about 52 words per minute', population:'About 168,000 online volunteers. Most were younger and interested in typing; 68% were US-based. This is not a representative sample of the planet.', url:'https://www.aalto.fi/en/news/the-traits-of-fast-typists-discovered-by-analysing-136-million-keystrokes'}}),
  personal('balance', 'A balancing act', 'move', 'balance', 30, 'seconds', 'One leg. A little focus. Find your steady side.', 'Time how long you can comfortably stand on one leg, eyes open, without putting the other foot down. Use a clear space with a support nearby.', {time:'2 min'}),
  personal('paper-crane', 'From paper, with love', 'make', 'paper', 1, 'crane', 'Turn an ordinary square into something rather lovely.', 'Fold an origami crane from memory, starting with a square sheet of paper. Practice with instructions first, then try without them.', {time:'20 min'}),
  personal('maths', 'Your brain, off calculator', 'mind', 'brain', 20, 'answers', 'A quick little mental maths workout. No charging cable required.', 'Answer 20 new two-digit addition questions correctly within two minutes, without a calculator. Have someone prepare the questions or use a random question generator.', {time:'2 min'}),
  personal('song', 'Play the whole thing', 'music', 'music', 1, 'song', 'From the first note to the last. This one’s yours.', 'Play a song from beginning to end on an instrument of your choice. Choose a piece appropriate to your level and record the performance if you like.', {time:'A few evenings'}),
  personal('cube', 'Six sides. One good feeling.', 'play', 'cube', 180, 'seconds', 'A colourful little puzzle with a very satisfying finish.', 'Start with a scrambled 3×3 Rubik’s cube. Time your solve and stop when every face is complete. Record the time in seconds.', {direction:'under', time:'An afternoon'}),
  personal('birds', 'Know your neighbours', 'outdoors', 'bird', 5, 'species', 'The ones with feathers. Start noticing who’s around.', 'Correctly identify five local bird species by sight or sound. Check each identification against a reliable local guide.', {time:'A weekend'}),
  personal('pushups', 'A proper little push', 'move', 'move', 10, 'reps', 'A simple strength goal, at your own pace.', 'Complete ten consecutive push-ups with a consistent form appropriate to you. Choose a variation that feels comfortable and record it in your notes.', {time:'5 min'}),
  personal('knots', 'Knot bad at all', 'make', 'knot', 3, 'knots', 'A small skill that has a way of coming in handy.', 'Tie three different practical knots from memory, then check them against a guide. Choose non-safety-critical uses for this challenge.', {time:'20 min'}),
  personal('memory', 'A little room in your head', 'mind', 'layers', 10, 'words', 'How much can you keep in mind for a moment?', 'Study a fresh list of ten unrelated words for one minute. Hide it, wait one minute, and write down as many as you remember correctly.', {time:'3 min'}),
  personal('puncture', 'Back on two wheels', 'everyday', 'bike', 1, 'repair', 'Make yourself the person who knows what to do with a flat.', 'Repair or replace a punctured bicycle inner tube. Check that the tyre holds pressure and the wheel is correctly refitted. Get guidance if needed.', {time:'An afternoon'}),
  personal('shortcuts', 'Less clicking, more doing', 'digital', 'command', 10, 'shortcuts', 'A few small shortcuts for the things you do every day.', 'Demonstrate ten keyboard shortcuts you use in your everyday apps, from memory. Record which apps and shortcuts you chose.', {time:'10 min'}),
  personal('rhythm', 'Stay in the pocket', 'music', 'rhythm', 60, 'seconds', 'Find a beat and make yourself at home in it.', 'Tap a steady rhythm along with a 90 BPM metronome for one minute. Record yourself to check that you stayed with the beat.', {time:'5 min'}),
  personal('jump-rope', 'Find your rhythm', 'move', 'rope', 60, 'jumps', 'A little bounce goes a long way.', 'Count consecutive comfortable jumps with a skipping rope, stopping when the rope catches. Choose a clear space and take breaks whenever needed.', {time:'10 min'}),
  personal('sketch', 'One line, many possibilities', 'make', 'pen', 1, 'sketch', 'Put a pen to paper. See where it takes you.', 'Create a continuous-line sketch of an everyday object without lifting your pen. Spend at least five minutes looking and drawing.', {time:'10 min'}),
  personal('countries', 'A world in your head', 'mind', 'globe', 20, 'countries', 'A tiny trip around the world, without leaving your chair.', 'Name and correctly locate twenty countries on an unlabelled world map. Check your answers on a labelled map afterwards.', {time:'10 min'}),
  personal('plant', 'A little green responsibility', 'everyday', 'leaf', 30, 'days', 'Keep a little leafy companion happily growing.', 'Care for a plant for thirty days. Learn its light and watering needs, and keep a simple note or photo record.', {time:'30 days'}),
  personal('card-trick', 'Pick a card. Any card.', 'play', 'cards', 1, 'trick', 'A small mystery, delivered with a straight face.', 'Perform one card trick from start to finish for another person. Practice first, then give it a proper reveal.', {time:'An evening'}),
  personal('name-tune', 'Wait, I know this one', 'music', 'headphones', 8, 'songs', 'Your very own, very unofficial music quiz.', 'Ask someone to play ten short clips from songs you both know. Correctly identify at least eight by title or artist.', {time:'10 min'}),
  personal('north', 'A sense of direction', 'outdoors', 'compass', 1, 'direction', 'Put your inner compass to a small, friendly test.', 'In a familiar, safe outdoor spot, point to north without checking your phone. Use a compass afterwards to confirm your guess is within 20 degrees.', {time:'5 min'}),
  personal('outside-meal', 'A meal with a view', 'outdoors', 'mountain', 1, 'meal', 'Sometimes changing the scenery is the whole achievement.', 'Prepare a simple meal to enjoy outdoors. Plan the ingredients, bring what you need, and leave the place as you found it.', {time:'An afternoon'}),
];
