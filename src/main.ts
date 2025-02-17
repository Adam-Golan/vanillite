import './style/dist/style.css';
import './utils';

import { Navigation, setMetaTags, State, setOpenGraphTags } from "@services";
import { Modal, Navbar } from "@shared";
import { StateKeys } from '@constants/stateKeys.constant';
import { appConfig } from 'app.config';

class Main {
  // App element.
  app = document.getElementById('app') ?? this.createApp();
  // Services.
  appState: State = new State();
  navigation: Navigation = new Navigation(this.appState, this.app, appConfig.routes);

  // Elements.
  constructor() {
    setMetaTags(appConfig.meta);
    if (appConfig.OGCard) setOpenGraphTags(appConfig.OGCard);
    this.navigation.fisrtLoad();
    this.init();
  }

  /**
   * Creates an 'app' element if it doesn't exist.
   * @returns - 'app' element.
   */
  private createApp(): HTMLDivElement {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.replaceChildren(app);
    return app;
  }

  /**
   * Initializes the application.
   * Adds a Navbar to the application's 'app' element and subscribes to events.
   * @returns - Nothing.
   */
  private init(): void {
    document.body.append(new Navbar(this.navigation.tree, this.appState));
    this.subscribes();
  }

  /**
   * Subscribes to events.
   * Creates a modal if StateKeys.openModal is emitted, and removes it if StateKeys.closeModal is emitted.
   * @returns - Nothing.
   */
  private subscribes(): void {
    const modals: { [key: string]: Modal } = {};
    // Modals.
    this.appState.subscribe(StateKeys.openModal, (key: string, content: Node | string) => modals[key] = new Modal(this.app.append, content, () => delete modals[key]));
  }
}

new Main();