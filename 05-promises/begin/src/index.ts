import './design/index.scss';

import { getHeroTreePromise, Hero, showFetching, showMessage } from './lib';

import { replaceHeroListComponent } from './heroes.component';
import {
  getHeroesViaNewPromise,
  getHeroesViaPromise,
  getHeroesViaPromiseReject,
  getHeroesViaPromiseRejectShorter,
} from './examples/promise';

const searchEmailElement = document.getElementById(
  'search-email',
) as HTMLInputElement;
const button = document.querySelector('.search-button');
searchEmailElement.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.code === 'Enter') render();
});
button.addEventListener('click', render);

document
  .getElementById('resolved-promise')
  .addEventListener('click', resolvedPromise);

document
  .getElementById('resolved-using-promise-ctor')
  .addEventListener('click', resolvedUsingPromiseConstructor);

document
  .getElementById('rejected-promise')
  .addEventListener('click', rejectedPromise);

document
  .getElementById('rejected-promise-shorter')
  .addEventListener('click', rejectedPromiseShorter);

function wrapUp() {
  showFetching(false);
}

function handleErrors(error: any) {
  console.error('Oh no! rejected promise!');
  console.error(error);
  showMessage(`Something bad happened`, 'Error');
}

function showHeroes(heroes: Hero[]) {
  console.table(heroes);
  showMessage(`Returned ${heroes.length} heroes`);
  heroes.forEach(h => showMessage(JSON.stringify(h), 'heroes', true));
}

function resolvedPromise() {
  showFetching();
  showMessage();
  // TODO - get heroes, with a Promise
  getHeroesViaPromise()
    .then(showHeroes)
    .catch(handleErrors)
    .finally(wrapUp);
}

function resolvedUsingPromiseConstructor() {
  showFetching();
  showMessage();
  // TODO - get heroes, with new Promise
  getHeroesViaNewPromise()
    .then(showHeroes)
    .catch(handleErrors)
    .finally(wrapUp);
}

function rejectedPromise() {
  showFetching();
  showMessage();
  // TODO - rejected promise
  getHeroesViaPromiseReject()
    .then(showHeroes)
    .catch(handleErrors)
    .finally(wrapUp);
}

function rejectedPromiseShorter() {
  showFetching();
  showMessage();
  // TODO - rejected promise, but shorter
  getHeroesViaPromiseRejectShorter()
    .then(showHeroes)
    .catch(handleErrors)
    .finally(wrapUp);
}

async function render() {
  showMessage();
  showFetching();
  /**
   * Get all of the hero data.
   * Then show the hero with the hero component.
   * Handle any errors
   * Always turn off the fetching indicator.
   */
  // TODO
  getHeroTreePromise(searchEmailElement.value)
    .then((hero: Hero) => replaceHeroListComponent(hero))
    .catch((error: any) => {
      console.error(error);
      showMessage(error);
      replaceHeroListComponent();
    });
}
