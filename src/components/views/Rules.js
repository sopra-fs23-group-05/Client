import React, {useState} from "react";
import {handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import 'styles/views/Rules.scss';
import 'styles/views/Homepage.scss';
import Button from '@mui/material/Button';
import TabooLogo from './TabooLogo.png';
import Button_Click from "./sounds/Button_Click.mp3";
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';

const Rules = () => {
    const history = useHistory();
    const doBack = () => {
        try {
            playSound(Button_Click);
            history.push(`/homepage`);
        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }
    };

    const playSound = (soundFile) => {
        const audio = new Audio(soundFile);
        audio.play();
    };

    const [currentPointExample, setCurrentPointExample] = useState(1);
    const [currentPointRules, setCurrentPointRules] = useState(1);
    const handlePrevClick = (pointType) => {
        playSound(Button_Click);
        if (pointType === "example") {
            if (currentPointExample > 1) {
                setCurrentPointExample(currentPointExample - 1);
            }
        }
        if (pointType === "rules") {
            if (currentPointRules > 1) {
                setCurrentPointRules(currentPointRules - 1);
            }
        }
    };

    const handleNextClick = (pointType) => {
        playSound(Button_Click);
        if (pointType === "example") {
            if (currentPointExample < 3) {
                setCurrentPointExample(currentPointExample + 1);
            }
        }
        if (pointType === "rules") {
            if (currentPointRules < 9) {
                setCurrentPointRules(currentPointRules + 1);
            }
        }
    };

    return (
        <div className="homePageRoot">
            <div className="flex-container">
                <img className="tabooLogo" src={TabooLogo} alt="Taboo Logo"/>
                <div className="rulesRectangle">
                    <div className="rulesText">
                        How do you get your team to say APPLE?
                        <br/><br/>
                        You can not say RED, FRUIT, PIE, CIDER, or CORE. They are TABOO - utterly
                        unmentionable words!
                        <br/><br/>
                        Think fast, write fast and do not write a TABOO word or your team will
                        get buzzed and lose a point!
                        <br/><br/>
                        You might say:
                        <br/><br/>
                        <div className="slider" style={{height: '80px'}}>
                            <ArrowBackIosNewOutlinedIcon
                                className={currentPointExample === 1 ? 'grey-button' : ''}
                                onClick={() => handlePrevClick("example")}></ArrowBackIosNewOutlinedIcon>
                            {currentPointExample === 1 && (
                                <>
                                    “NEW YORK IS THE 'BIG' ONE”<br/>
                                </>
                            )}
                            {currentPointExample === 2 && (
                                <>
                                    “EAT ONE OF THESE A DAY TO KEEP THE DOCTOR AWAY" <br/>
                                </>
                            )}
                            {currentPointExample === 3 && (
                                <>
                                    “WILLIAM TELL USED ONE FOR TARGET PRACTICE” <br/>
                                </>
                            )}
                            <ArrowForwardIosOutlinedIcon
                                className={currentPointExample === 3 ? 'grey-button' : ''}
                                onClick={() => handleNextClick("example")}></ArrowForwardIosOutlinedIcon>
                        </div>

                        <br/>
                        As you call out the clues, your teammates guess the answers.
                        <br/><br/>
                        Before playing, please read the rules that follow. Not to do so
                        would be TABOO!
                        <br/><br/><br/>

                        <div className="slider" style={{height: '200px'}}>
                            <ArrowBackIosNewOutlinedIcon
                                className={currentPointRules === 1 ? 'grey-button' : ''}
                                onClick={() => handlePrevClick("rules")}></ArrowBackIosNewOutlinedIcon>
                            {currentPointRules === 1 && (
                                <>
                                    The Clue-giver draws a card which will be displayed with the 5 TABOO words.
                                    <br/>
                                </>
                            )}
                            {currentPointRules === 2 && (
                                <>
                                    The timer starts as soon as a new turn begins.
                                    <br/>
                                </>
                            )}
                            {currentPointRules === 3 && (
                                <>
                                    No form or part of ANY word may be given as a clue.
                                    <br/>
                                </>
                            )}
                            {currentPointRules === 4 && (
                                <>
                                    As the Clue-giver gives clues, his or her teammates write possible words in the chat
                                    trying to guess the Guess Word.
                                    <br/>
                                </>
                            )}
                            {currentPointRules === 5 && (
                                <>
                                    Each time a teammate types out the correct Guess Word, the Clue-giver's team scores
                                    a point. A new card will be drawn. For each correctly guessed word the team receives
                                    one point.
                                    <br/>
                                </>
                            )}
                            {currentPointRules === 6 && (
                                <>
                                    Clue-givers can lose points in two ways: by getting buzzed and by passing on a card.
                                    <br/>
                                </>
                            )}
                            {currentPointRules === 7 && (
                                <>
                                    If a TABOO word is used by the Clue-giver or if any of the RULES FOR CLUES are
                                    broken, the buzzer will be used by the opposing team.
                                    <br/>
                                </>
                            )}
                            {currentPointRules === 8 && (
                                <>
                                    If the Clue-giver cannot describe the given word then he or she can use the Skip
                                    button to skip the card.
                                    <br/>
                                </>
                            )}
                            {currentPointRules === 9 && (
                                <>
                                    After seven rounds the team with the most points will be declared as the winner!
                                    <br/>
                                </>
                            )}
                            <ArrowForwardIosOutlinedIcon
                                className={currentPointRules === 9 ? 'grey-button' : ''}
                                onClick={() => handleNextClick("rules")}></ArrowForwardIosOutlinedIcon>
                        </div>
                    </div>
                </div>
                <Button className="button"
                        onClick={() => doBack()}
                >
                    Back
                </Button>
            </div>
        </div>
    );
};

export default Rules;