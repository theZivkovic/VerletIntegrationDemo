'use strict';

import Message from "./components/message";

let container = document.querySelector('.main');
container.textContent = new Message('mate').render();
