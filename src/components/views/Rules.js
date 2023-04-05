import React from "react";
import {handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import 'styles/views/Rules.scss';
import Button from '@mui/material/Button';
import TabooLogo from './TabooLogo.png';


const Rules = props => {
    const history = useHistory();
    const doBack = () => {
        try{
            history.push(`/homepage`);
        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }
    };

  return (
    <div className="rulesRoot" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <img src={TabooLogo} alt="Taboo logo" style={{maxWidth: "100%", maxHeight: "40%"}} />
                <div className="rectangle">
                    <div className="rulesText">
                        QUICK!
                        <br />
                        <br />
                        How do you get your team to say APPLE?
                        <br />
                        <br />
                        You can not say RED, FRUIT, PIE, CIDER, or CORE. They are TABOO - utterly
                        unmentionable words!
                        <br />
                        <br />
                        Think fast, write fast and do not write a TABOO word or your team will
                        get buzzed and lose a point!
                        <br />
                        <br />
                        You might say:
                        <br />
                        <br />
                        <div className="rulesText">
                            • “NEW YORK IS THE 'BIG' ONE”
                            <br />
                            • “EAT ONE OF THESE A DAY TO KEEP THE DOCTOR AWAY.
                            <br />
                            • “WILLIAM TELL USED ONE FOR TARGET PRACTICE”
                            <br />
                        </div>
                    <div className="rulesText">
                        <br />
                    </div>
                    <div className="rulesText">
                        As you call out the clues, your teammates guess the answers.
                        <br />
                        <br />
                        Before playing, please read the rules that follow. Not to do so
                        would be TABOO!
                        <br />
                        <br />
                    </div>
                    <div className="rulesText">
                        1. The Clue-giver draws a card which will be displayed with the 5 TABOO
                        words.
                        <br />
                        2. The timer starts as soon as a new turn begins.
                        <br />
                        3. No form or part of ANY word may be given as a clue.
                        <br />
                        4. As the Clue-giver gives clues, his or her teammates write possible
                        words in the chat trying to guess the Guess Word.
                        <br />
                        5. Each time a teammate types out the correct Guess Word, the
                        Clue-giver's team scores a point. A new card will be drawn. For each
                        correctly guessed word the team receives one point.
                        <br />
                        6. Clue-givers can lose points in two ways: by getting buzzed and by
                        passing on a card.
                        <br />
                        7. If a TABOO word is used by the Clue-giver or if any of the RULES FOR
                        CLUES are broken, the buzzer will be used by the opposing team.
                        <br />
                        8. If the Clue-giver cannot describe the given word then he or she can
                        use the Skip button to skip the card.
                        <br />
                        9. After seven rounds the team with the most points will be declared as
                        the winner! <br />
                    </div>
                    </div>
                </div>
        <Button className="button"
          onClick={() => doBack()}
          >
          Back
        </Button>
      </div>
  );
};

export default Rules;