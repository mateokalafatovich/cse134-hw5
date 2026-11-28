const API = "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en";

class FunFact extends HTMLElement {
    constructor() {
        super();
        this._fact = null;   // last fact that loaded successfully: { text, source, sourceUrl }
        this._count = 0;     // how many facts have loaded this visit
    }

    // Attributes the browser watches
    static get observedAttributes() {
        return ['reveal'];
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
        this.update();
        this.loadFact();     // request the first fact as soon as the component is on the page
    }

    attributeChangedCallback(name) {
        // If <fun-fact reveal> is written in the HTML, this runs before
        // connectedCallback(), when there are no elements to update yet
        if (name === 'reveal' && this.querySelector('.fact')) {
            this.update();
            this.dispatchEvent(new CustomEvent('reveal-change'));
        }
    }

    render() {
        this.replaceChildren();

        // Heading
        const heading = document.createElement('h3');
        heading.textContent = 'Random Fun Fact';
        this.appendChild(heading);

        // Fact text
        const fact = document.createElement('p');
        fact.className = 'fact';
        this.appendChild(fact);

        // Fact source
        const source = document.createElement('p');
        source.className = 'source';
        this.appendChild(source);

        // Get fact button
        const factBtn = document.createElement('button');
        factBtn.type = 'button';
        factBtn.className = 'get-fact';
        factBtn.textContent = 'Get a new fact';
        this.appendChild(factBtn);

        // Status message for loading, success, and failure
        const status = document.createElement('p');
        status.className = 'status';
        status.setAttribute('role', 'status');
        this.appendChild(status);
    }

    attachEventListeners() {
        const factBtn = this.querySelector('.get-fact');
        factBtn.addEventListener('click', () => {
            this.loadFact();
        });
    }

    update() {
        const revealed = this.hasAttribute('reveal');

        // Update fact text (textContent, so remote text is never read as HTML)
        const fact = this.querySelector('.fact');
        fact.textContent = this._fact ? this._fact.text : 'Your first fact is on its way…';

        // Update source: hidden unless the reveal attribute is set
        const source = this.querySelector('.source');
        source.hidden = !revealed;
        source.replaceChildren();
        if (!this._fact) {
            source.textContent = 'Source: no fact loaded yet.';
        } else if (this._fact.sourceUrl) {
            source.append('Source: ');
            const link = document.createElement('a');
            link.href = this._fact.sourceUrl;
            link.textContent = this._fact.source;
            source.appendChild(link);
        } else {
            source.textContent = `Source: ${this._fact.source}`;
        }
    }

    setStatus(message) {
        this.querySelector('.status').textContent = message;
    }

    async loadFact() {
        const factBtn = this.querySelector('.get-fact');
        const fact = this.querySelector('.fact');

        // prevent double requests
        factBtn.disabled = true;
        fact.setAttribute('aria-busy', 'true');
        this.setStatus('Loading a new fact…');

        try {
            const response = await fetch(API);
            if (!response.ok) {
                throw new Error(`HTTP status ${response.status}`);
            }
            const data = await response.json();  
            if (typeof data?.text !== 'string' || typeof data?.source !== 'string') {
                throw new Error('Expected text and source in the response.');
            }

            // Success: save the fact, hide the previous fact's source, and show it
            this._fact = {
                text: data.text,
                source: data.source,
                sourceUrl: FunFact.safeUrl(data.source_url)
            };
            this._count++;
            this.update();
            this.setStatus(`Fact ${this._count} loaded.`);
        } catch (err) {
            // Failure: keep the previous fact on screen and explain how to retry
            console.error('Could not load a fact.', err);
            this.setStatus('Could not load a new fact. Check your connection, then select "Get a new fact" to try again.');
        } finally {
            // Runs after success or failure: restore the control so the visitor can retry
            factBtn.disabled = false;
            fact.removeAttribute('aria-busy');
        }
    }

    // Returns the URL only if it is a valid https: link, otherwise null
    static safeUrl(value) {
        if (typeof value !== 'string') {
            return null;
        }
        try {
            const url = new URL(value);
            return url.protocol === 'https:' ? url.href : null;
        } catch {
            return null;
        }
    }
}

customElements.define('fun-fact', FunFact);

/* Use local storage */

const SOURCE_KEY = 'hw5-fun-fact-source';
const SOURCE_DEFAULT = 'hidden';

function readSourcePref() {
    try { 
        const saved = localStorage.getItem(SOURCE_KEY);
        return saved === 'shown' || saved === 'hidden' ? saved : SOURCE_DEFAULT;
    } catch(err) {
        console.warn('The fun fact source preference could not be read.', err);
        return SOURCE_DEFAULT;
    }
}

function saveSourcePref(value) {
    try { 
        localStorage.setItem(SOURCE_KEY, value);
    } catch(err) {
        console.warn('The fun fact source preference could not be saved.', err);
    }
}

function applySourcePref(value) {
    funFact.toggleAttribute('reveal', value === 'shown');
}

function updateLabel() {
    revealToggle.textContent = funFact.hasAttribute('reveal') ? 'Hide Source' : 'Show Source';
}


// Page control: a button OUTSIDE the component toggles its observed `reveal` attribute
const funFact = document.querySelector('#fun-fact');
const revealToggle = document.querySelector('#reveal-toggle');

if (funFact && revealToggle) {
    revealToggle.addEventListener('click', () => {
        const next = funFact.hasAttribute('reveal') ? 'hidden' : 'shown';
        applySourcePref(next);
        saveSourcePref(next);
    });

    // Runs whenever `reveal` changes, whether from this button or from the
    // component hiding the source again after a new fact loads
    funFact.addEventListener('reveal-change', () => {
        updateLabel();
    });

    applySourcePref(readSourcePref());
    updateLabel();
}