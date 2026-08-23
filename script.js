function startGaming() {
    alert("🎮 Welcome to GameZone!");
}

function playGame(gameName) {
    if (gameName === "Battle Arena") {
        window.location.href = "battle-arena.html";
    } else {
        alert(gameName + " is coming soon!");
    }
}