// Entry point for the deck.
import './styles/index.css';
import { Deck } from './deck/deck';
import { bindInput } from './deck/input';

const root = document.querySelector<HTMLElement>('.deck');
if (root) {
  const deck = new Deck(root);
  bindInput(deck);
}
