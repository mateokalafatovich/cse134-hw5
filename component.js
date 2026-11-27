class TriviaCard extends HTMLElement {
    constructor() {
        super();
        this._data = [
            {
                question: "When did Mateo start playing soccer?",
                options: ["4", "6", "10", "15"],
                correctAnswer: "4"
            },
            {
                question: "Why did Mateo first become interested in Computer Science?",
                options: ["His parents", "High school", "Social media", "Minecraft"],
                correctAnswer: "Minecraft"
            },
            {
                question: "Which is Mateo's favorite Premier League team?",
                options: ["Arsenal", "Man City", "Tottenham", "Everton"],
                correctAnswer: "Tottenham"
            }
        ];
        this._index = 0;
    }

    // Attributes the browser watches
    static get observedAttributes() {
        return ['reveal'];
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
        this.update();
    }

    attributeChangedCallback(name) {
        // If <trivia-card reveal> is written in the HTML, this runs before
        // connectedCallback()
        if (name === 'reveal' && this.querySelector('.options')) {
            this.update();
            this.dispatchEvent(new CustomEvent('reveal-change'));
        }
    }

    render() {
        this.replaceChildren();

        // Heading
        const heading = document.createElement('h3');
        heading.textContent = 'Trivia Time';
        this.appendChild(heading);

        // Question text 
        const question = document.createElement('p');
        question.className = 'question';
        this.appendChild(question);

        // Answer choices, lettered A-D 
        const options = document.createElement('ol');
        options.className = 'options';
        options.type = 'A';
        this.appendChild(options);

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'prev';
        prevBtn.textContent = 'Previous question';
        this.appendChild(prevBtn);

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'next';
        nextBtn.textContent = 'Next question';
        this.appendChild(nextBtn);

        // Status message, e.g. "Question 2 of 3"
        const status = document.createElement('p');
        status.className = 'status';
        status.setAttribute('role', 'status');
        this.appendChild(status);
    }

    attachEventListeners() {
        const prev = this.querySelector('.prev');
        const next = this.querySelector('.next');
        prev.addEventListener('click', () => {
            this.showQuestion((this._index-1 + this._data.length) % this._data.length);
        });
        next.addEventListener('click', () => {
            this.showQuestion((this._index+1) % this._data.length);
        });
    }

    // Switch to a question and hide its answer again
    showQuestion(newIndex) {
        this._index = newIndex;
        this.removeAttribute('reveal');
        this.update();
    }

    update() {
        // Get question object
        const item = this._data[this._index];
        const revealed = this.hasAttribute('reveal');

        // Update question
        const question = this.querySelector('.question');
        question.textContent = item['question'];

        // Update options
        const options = this.querySelector('.options');
        options.replaceChildren();
        item.options.forEach(option => {
            const answerChoice = document.createElement('li');
            if (revealed && option === item.correctAnswer) {
                // Highlight the correct choice while the reveal attribute is set
                const highlight = document.createElement('mark');
                highlight.textContent = option;
                answerChoice.appendChild(highlight);
            } else {
                answerChoice.textContent = option;
            }
            options.appendChild(answerChoice);
        });

        // Update status
        const status = this.querySelector('.status');
        status.textContent = `Question ${this._index+1} of ${this._data.length}`;
    }

}

customElements.define('trivia-card', TriviaCard);

// Page control: a button OUTSIDE the component toggles its observed `reveal` attribute
const triviaCard = document.querySelector('#trivia-card');
const revealToggle = document.querySelector('#reveal-toggle');

if (triviaCard && revealToggle) {
    revealToggle.addEventListener('click', () => {
        triviaCard.toggleAttribute('reveal');
    });

    // Runs whenever `reveal` changes, whether from this button or from the
    // card's Previous/Next buttons hiding the answer again
    triviaCard.addEventListener('reveal-change', () => {
        revealToggle.textContent = triviaCard.hasAttribute('reveal') ? 'Hide Answer' : 'Reveal Answer';
    });
}