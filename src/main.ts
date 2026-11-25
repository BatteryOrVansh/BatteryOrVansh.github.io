// Entry point for the deck.
import './styles/index.css';
import { Deck } from './deck/deck';
import { bindInput } from './deck/input';
import { initIntro } from './deck/intro';
import { initWork } from './deck/work';
import { initReveal } from './motion/reveal';
import { initMagnetic } from './motion/magnetic';
import { initTilt } from './motion/tilt';
import { initCursor } from './motion/cursor';

const root = document.querySelector<HTMLElement>('.deck');
if (root) {
  const deck = new Deck(root);
  bindInput(deck);
  initWork(deck);
  initIntro(deck);
  initReveal();
  initTilt();
  initMagnetic();
  initCursor();
}
