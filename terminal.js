const log = document.getElementById("log");
const commandInput = document.getElementById("command-input");
const anomalyForm = document.getElementById("anomaly-form");
const anomalyType = document.getElementById("anomaly-type");

let isLoggedIn = false;
let currentUser = null;
let postLoginQuestionAsked = false;
const usernameRequired = "saif";
const passwordRequiredUsers = { "general logs": "secure123" };
const anomalies = [];

function addLogEntry(message) {
    const entry = document.createElement("div");
    entry.textContent = message;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

function processCommand(command) {
    const args = command.trim().split(" ");
    const mainCommand = args[0].toLowerCase();

    if (!isLoggedIn) {
        if (mainCommand === "login") {
            if (args[1] === usernameRequired) {
                const username = args[1];
                if (passwordRequiredUsers[username]) {
                    if (args[2] === passwordRequiredUsers[username]) {
                        isLoggedIn = true;
                        currentUser = username;
                        return `Welcome, ${username}! Type 'help' for available commands.`;
                    } else {
                        return "Incorrect password. Please try again.";
                    }
                } else {
                    isLoggedIn = true;
                    currentUser = username;
                    return `Welcome, ${username}! Type 'help' for available commands.`;
                }
            } else {
                return "Usage: login [username] [password]";
            }
        }
        return "Access Denied. Please log in using 'login [username] [password]'.";
    }

    if (!postLoginQuestionAsked) {
        postLoginQuestionAsked = true;
        return "Have you seen an anomaly? (yes/no)";
    }

    if (postLoginQuestionAsked && (mainCommand === "yes" || mainCommand === "no")) {
        postLoginQuestionAsked = false;
        if (mainCommand === "yes") {
            return "Please report the anomaly using 'Anomaly' or 'No anomaly'.";
        } else {
            return "Stay alert. Report any sightings immediately!";
        }
    }

    switch (mainCommand) {
        case "help":
            return `Available commands:
- login [username] [password]: Log in to the terminal.
- list: List all reported anomalies.
- clear: Clear the terminal.`;

        case "list":
            if (anomalies.length > 0) {
                return `Reported Anomalies:\n${anomalies.map((a, i) => `${i + 1}. ${a}`).join("\n")}`;
            } else {
                return "No anomalies have been reported yet.";
            }

        case "clear":
            log.innerHTML = "";
            return null;

        default:
            return `Unknown command: "${mainCommand}". Type 'help' for available commands.`;
    }
}

commandInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const command = commandInput.value.trim();
        if (command) {
            addLogEntry(`> ${command}`);
            const response = processCommand(command);
            if (response) {
                addLogEntry(response);
            }
        }
        commandInput.value = "";
    }
});

anomalyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const type = anomalyType.value.trim().toLowerCase();

    if (type === "anomaly") {
        anomalies.push("Anomaly reported.");
        addLogEntry("Anomaly reported.");
    } else if (type === "no anomaly") {
        anomalies.push("No anomaly reported.");
        addLogEntry("No anomaly reported.");
    } else {
        addLogEntry("Invalid input. Please type 'Anomaly' or 'No anomaly'.");
    }

    anomalyForm.reset();
});

addLogEntry("Welcome to the Anomaly Terminal.");
addLogEntry("Type 'login [username] [password]' to begin.");