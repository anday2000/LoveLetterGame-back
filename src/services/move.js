const deck = require('./deck');

const { guard, priest, baron, handmaid, prince, king, princess } = require('./cards');
let activeCard = null;

/*
 * Handle player turnings
 * Arguments: 
 *      game - current game
 *      card - turned card
 *      currentPlayer - turning player
 *      relatedInfoObj - extra information for player card (if needed)
 * Return: (String)
 *      Success - if everything ok
 *      (Error message) - else
*/
function move(game, card, currentPlayer, relatedInfoObj) {
    try {
        relatedInfoObj.currentPlayer = currentPlayer;

        if (game.turningPlayer().socketId === currentPlayer.socketId
            && card.playerID === game.turningPlayer().id
            && deck.isExist(card, game.allCards)) {

            activeCard = card;
            game.turningPlayer().removeCard(card);
            cardSeperator(card, relatedInfoObj);
            game.moveOrderId = nextPlayerId(game.moveOrderId, game.activePlayers);
            return "Success";
        }
        else {
            console.error("It's not your turn");
            return "It's not your turn";
        }
    } catch (error) {
        console.error(error)
    }

}

/*
 * Handle cards and call appropirate function
 * Arguments:
 *      card - turned card
 *      relatedInfoObj - extra information for player card (if needed)
 * Return: (Void)
*/
const cardSeperator = (card, relatedInfo) => {
    try {
        switch (card.name) {
            case "Guard":
                guard(relatedInfo.targetPlayer, relatedInfo.guessedCard);
                break;
            case "Priest":
                priest(relatedInfo.targetPlayer);
                break;
            case "Baron":
                baron(relatedInfo.targetPlayer, relatedInfo.currentPlayer);
                break;
            case "Handmaid":
                handmaid(relatedInfo.currentPlayer);
                break;
            case "Prince":
                prince(relatedInfo.targetPlayer);
                break;
            case "King":
                king(relatedInfo.targetPlayer, relatedInfo.currentPlayer);
                break;
            case "Countess":
                break;
            case "Princess":
                princess(relatedInfo.currentPlayer)
                break;
            default:
                break;
        }


    } catch (err) {
        console.log(err)
    }
}



/*
 * Return next turning player id
 * Arguments:
 *      moveOrderId - last turned player id
 *      players - players participating in game
 * Return: (int)
 *      Id of next player
*/
function nextPlayerId(moveOrderId, players) {
    return players[(players.findIndex(p => p.id === moveOrderId) + 1) % players.length].id;
}



module.exports = move
