// Music player entry: engine + UI + the gate/returning-visitor behaviour.
import { load } from '../state';
import type { IntroDone } from '../deck/intro';
import { Engine } from './engine';
import { initPlayerUi } from './ui';

export function initPlayer(): void {
  const engine = new Engine();
  initPlayerUi(engine);

  // Boot gate: "Enter with sound" is the gesture that starts audio; "Enter silent" keeps it off.
  document.addEventListener('intro:done', (e) => {
    const { sound, gesture } = (e as CustomEvent<IntroDone>).detail;
    if (sound !== 'on') return;
    if (gesture) void engine.start();
    else engine.armGesture(); // returning visitor: start on the first interaction
  });

  // Visitors who skipped the gate entirely (deep link on a first visit) have no saved choice: stay off.
  // Warm the library once the browser is idle so the card opens instantly.
  if (load().sound === 'on') void engine.loadLibrary();
}
