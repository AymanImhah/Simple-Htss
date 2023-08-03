class CountdownTimer {
    constructor() {
        this.interval = null;
        this.countdownInterval = 1000;
        this.unitElements = this.retrieveUnitElements();

        // Add event listeners
        for (const key in this.unitElements) {
            this.unitElements[key].addEventListener('input', (event) => {
                this.validateInput(event.target);
            });
        }

        // Add event listeners for buttons
        document.querySelectorAll('.plus, .minus').forEach((button) => {
            button.addEventListener('click', () => this.handleButtonClick(button));
        });

        // Start button event listener
        document.querySelector('.start-countdown').addEventListener('click', () => this.startCountdown());

        // Stop button event listener
        document.querySelector('.stop-countdown').addEventListener('click', () => this.stopCountdown());

        // Reset button event listener
        document.querySelector('.reset').addEventListener('click', ()=> {
            this.resetCountdown()
        })
    }

    retrieveUnitElements() {
        return {
            secondsElement: document.getElementById('seconds'),
            minutesElement: document.getElementById('minutes'),
            hoursElement: document.getElementById('hours'),
            daysElement: document.getElementById('days'),
        };
    }

    validateInput(inputElement) {
        setTimeout(() => {
            let newValue = parseInt(inputElement.innerText);
            const maxValue =  inputElement.id === 'hours' ? 23 : 59
            if (isNaN(newValue) || newValue < 0 || newValue > maxValue) {
                inputElement.innerText = '00';
            } else {
                inputElement.innerText = newValue.toString().padStart(2, '0');
            }
        }, 800);
    }

    updateCountdown(unitElement, value) {
        unitElement.innerText = value.toString().padStart(2, '0');
    }

    countdown() {
        let { secondsElement, minutesElement, hoursElement, daysElement } = this.unitElements;

        let currentSeconds = parseInt(secondsElement.innerText);
        let currentMinutes = parseInt(minutesElement.innerText);
        let currentHours = parseInt(hoursElement.innerText);
        let currentDays = parseInt(daysElement.innerText);

        currentSeconds--;
        if (currentSeconds < 0) {
            currentSeconds = 59;
            currentMinutes--;
            if (currentMinutes < 0) {
                currentMinutes = 59;
                currentHours--;
                if (currentHours < 0) {
                    currentHours = 23;
                    currentDays--;
                    if (currentDays < 0) {
                        this.stopCountdown();
                        return;
                    }
                }
            }
        }
        this.updateCountdown(secondsElement, currentSeconds);
        this.updateCountdown(minutesElement, currentMinutes);
        this.updateCountdown(hoursElement, currentHours);
        this.updateCountdown(daysElement, currentDays);
    }

    handleButtonClick(node) {
        const parentNode = node.parentNode;
        const targetElement = parentNode.querySelector('.number');
        let currentValue = parseInt(targetElement.innerText);
        const maxValue = parentNode.className.includes('days-c')? 31 : parentNode.className.includes('hours-c')? 24 : 60
        if (node.classList.contains('plus')) {
            targetElement.innerText = (++currentValue % maxValue).toString().padStart(2, '0');
        } else if (node.classList.contains('minus')) {
            targetElement.innerText = ((--currentValue % maxValue + maxValue) % maxValue).toString().padStart(2, '0');
        }
    }j

    startCountdown() {
        this.makeButtonsVisible(false);
        if (!this.interval) {
            this.interval = setInterval(() => this.countdown(), this.countdownInterval);
        }
    }

    stopCountdown() {
        this.makeButtonsVisible(true);
        clearInterval(this.interval);
        this.resetCountdown();
        this.interval = null;
    }

    resetCountdown() {
        let { daysElement, hoursElement, minutesElement, secondsElement } = this.unitElements;
        this.updateCountdown(secondsElement, 0);
        this.updateCountdown(minutesElement, 0);
        this.updateCountdown(hoursElement, 0);
        this.updateCountdown(daysElement, 0);
    }

    makeButtonsVisible(visible) {
        const buttons = document.getElementsByClassName('buttons');
        for (let button of buttons) {
            if (button.classList.contains('stop-countdown')) {
                button.style.display = visible ? 'none' : 'inline';
            } else {
                button.style.display = visible ? 'inline' : 'none';
            }
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new CountdownTimer();
});
