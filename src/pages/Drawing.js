import React, { Component } from "react";
import Button from "../components/Button";
import Picture from "../components/Picture";
import data from "../data.json";
import leftScores from "../leftScores.json";
import rightScores from "../rightScores.json"
import Tray from "../components/Tray";

class Drawing extends Component {
    state = {
        data,
        dice: [],
        counter: 0,
        rolls: 0,
        turn: 12,
        total: 0,
        location: 1,
        leftScores,
        rightScores
    }



    // DICE LOGIC

    // myDice checks turn and roll is approved then rolls dice
    myDice = (data) => {
        let turn = this.state.turn;
        let rolls = this.state.rolls;
        let i = 0;
        let myDice = this.checkHold();
        let x = 5 - myDice.length;
        let counter = this.state.counter;
        if (rolls < 3 && turn > 0) {
            while (i < x) {
                let num = (Math.floor(Math.random() * 6) + 1);
                counter++;
                i++;
                for (let e of data) {
                    if (e.value === num) {
                        let empty = {};
                        e.id = counter
                        myDice.push(Object.assign(empty, e));
                        break
                    }
                }
            }
            this.setState({
                dice: myDice,
                rolls: (rolls + 1),
                counter: counter
            });
        } else if (rolls === 3 && turn > 0) {
            alert("You have no rolls left!");
        } else {
            alert("Game Over! Click restart to play again!")
        }
    }

    // checkHold updates dice to keep
    checkHold = () => {
        let data = this.state.dice;
        let hold = [];
        for (let e of data) {
            if (e.clicked === true) {
                hold.push(e);
            }
        }
        return hold;

    }

    // handleDiceClick updates if dice is saved
    handleDiceClick = id => {
        let data = this.state.dice;
        for (let e of data) {
            if (e.id === id) {
                if (e.clicked === false) {
                    console.log(e);
                    e.clicked = true;
                    e.class = "col-2 border";
                    break
                } else {
                    e.clicked = false;
                    e.class = "col-2";
                    break
                }
            }
        }
        this.setState({
            dice: data
        });
    }


    // SCORING SECTION

    // cycleScores goes through and temporarily updates score.
    cycleScores = () => {
        let loca = this.state.location;
        let leftScores = this.state.leftScores;
        let rightScores = this.state.rightScores;
        this.checkClear();
        if (loca < 7) {
            for (let l of leftScores) {
                if (l.value === loca) {
                    if (l.entered === false) {
                        loca = loca + 1;
                        console.log(loca);
                        l.class = "col-2 text-danger";
                        this.setState({
                            l: this.checkMyDice(l),
                            location: loca
                        })
                        console.log("cycleScores found where to update");
                        break
                    } else if (l.entered === true) {
                        loca = loca + 1;
                        this.setState({
                            location: loca
                        })
                        console.log("No matching moving to next.");
                    } else {
                        console.log("Error on finding entered in leftScores");
                    }
                }
            }
        } else if (loca > 6) {
            for (let r of rightScores) {
                if (r.value === loca) {
                    if (r.entered === false) {
                        loca = loca + 1;
                        console.log(loca);
                        r.class = "col-2 text-danger";
                        this.setState({
                            r: this.checkMyDice(r),
                            location: loca
                        })
                        console.log("cycleScores found where to update");
                        break
                    } else if (r.entered === true) {
                        loca = loca + 1;
                        this.setState({
                            location: loca
                        })
                        console.log("No matching moving to next.");
                    } else {
                        console.log("Error on finding entered in leftScores");
                    }
                }
            }
        }
        else {
            console.log("Error finding location for scoring.")
        }
    }

    // checkMyDice checks dice and gets score for current location
    checkMyDice = (box) => {
        let myDice = this.state.dice;
        let counter = 0;
        // Handles all right side score locations
        if (box.value < 7) {
            for (let e of myDice) {
                if (box.value === e.value) {
                    counter = counter + e.value;
                }
            }
            box.score = counter;
            return box;
            // Handles all left side score locations
        } else if (box.value > 6) {
            // Handles 3x
            if (box.value === 7) {
                let transfer = this.checkMostMatches(myDice, counter);
                let length = transfer.array.length;
                if (length > 2) {
                    box.score = transfer.counter;
                    return box;
                } else {
                    box.score = 0;
                    return box;
                }
                // Handles 4x
            } else if (box.value === 8) {
                let transfer = this.checkMostMatches(myDice, counter);
                let length = transfer.array.length;
                if (length > 3) {
                    box.score = transfer.counter
                    return box;
                } else {
                    box.score = 0;
                    return box;
                }
                // Handles Yahtzee
            } else if (box.value === 12) {
                let transfer = this.checkMostMatches(myDice, counter);
                let length = transfer.array.length;
                if (length > 4) {
                    box.score = transfer.counter
                    return box;
                } else {
                    box.score = 0;
                    return box;
                }
                // Handles Full House
            } else if (box.value === 9) {
                let tripple = this.checkMostMatches(myDice, counter);
                let length = tripple.array.length;
                if (length === 3) {
                    tripple = this.checkLeastMatches(myDice);
                    length = tripple.length;
                    if (length === 2) {
                        box.score = 25;
                    } else {
                        box.score = 0;
                    }
                } else {
                    box.score = 0;
                    return box;
                }
                // Handles Low Straight
            } else if (box.value === 10) {
                counter = this.lowStraight(myDice);
                box.score = counter;
                return box;
                // Handles High Straight
            } else if (box.value === 11) {
                counter = this.highStraight(myDice);
                box.score = counter;
                return box;
            }
        }
    }


    // Checks for Low Straight
    lowStraight = (myDice) => {
        let values = [];
        for (let e of myDice) {
            values.push(e.value);
        };
        values.sort();
        let uniqueSet = new Set(values);
        values = [...uniqueSet];
        if (values.length > 4) {
            if (values[0] < (values[1] - 1)) {
                values.splice(0, 1);
            } else if (values[4] > (values[3] + 1)) {
                values.splice(4, 1);
            } else {
                values.splice(0, 1);
            }
        }
        let lowOne = [1, 2, 3, 4];
        let lowTwo = [2, 3, 4, 5];
        let lowThree = [3, 4, 5, 6];
        if (JSON.stringify(values) === JSON.stringify(lowOne) || JSON.stringify(values) === JSON.stringify(lowTwo) || JSON.stringify(values) === JSON.stringify(lowThree)) {
            console.log("lowStraight found");
            return 30;
        } else {
            return 0;
        }
    }

    // Checks for High Straight
    highStraight = (myDice) => {
        let values = [];
        for (let e of myDice) {
            values.push(e.value);
            values.sort();
        }
        let highOne = [1, 2, 3, 4, 5];
        let highTwo = [2, 3, 4, 5, 6];
        if (JSON.stringify(values) === JSON.stringify(highOne) || JSON.stringify(values) === JSON.stringify(highTwo)) {
            return 40;
        } else {
            return 0;
        }
    }

    // Compares dice to find most matches
    checkMostMatches = (myDice, counter) => {
        let values = [];
        let oldArray = [];
        let save;
        for (let e of myDice) {
            values.push(e.value);
            console.log("Values: " + values);
        }
        for (let hold of myDice) {
            console.log("Checking for multiples of " + hold.value);
            let newArray = (values.filter(el => el === hold.value));
            if (newArray.length > 0) {
                if (newArray.length > oldArray.length) {
                    oldArray = newArray;
                    save = hold.value;
                } else if (newArray.length === oldArray.length) {
                    if (hold.value > save) {
                        oldArray = newArray;
                        save = hold.value;
                    }
                }
            }
        }
        counter = (save * (oldArray.length));
        let transfer = {
            array: oldArray,
            value: save,
            counter: counter
        }
        return transfer
    }

    // Compares matches for smallest match
    checkLeastMatches = (myDice) => {
        let values = [];
        console.log(values.length)
        let oldArray = [0, 0, 0];
        for (let e of myDice) {
            values.push(e.value);
            console.log("Values: " + values);
        }
        for (let hold of myDice) {
            let newArray = (values.filter(el => el === hold.value));
            if (newArray.length < oldArray.length) {
                oldArray = newArray;
            }
        }
        return oldArray
    }

    // checks to clear score
    checkClear = () => {
        let leftScores = this.state.leftScores;
        let rightScores = this.state.rightScores;
        let loca = this.state.location;
        for (let w of leftScores) {
            if (w.score >= 0 && w.entered === false) {
                w.score = 0;
                w.class = "col-2";
                this.setState({
                    w: w
                })
            }
        }
        for (let w of rightScores) {
            if (w.score >= 0 && w.entered === false) {
                w.score = 0;
                w.class = "col-2";
                this.setState({
                    w: w
                })
            }
        }
        if (loca >= 13) {
            loca = 1;
            this.setState({
                location: loca
            })
        }
    }

    // Saves the score
    setScore = () => {
        let loca = this.state.location;
        loca = loca - 1;
        let leftScores = this.state.leftScores;
        let rightScores = this.state.rightScores;
        let turn = this.state.turn;

        if (loca < 7) {
            for (let e of leftScores) {
                if (e.value === loca) {
                    e.entered = true;
                    e.class = "col-2";
                    let total = this.state.total;
                    total = total + e.score;
                    turn = turn - 1;
                    this.setState({
                        location: 1,
                        e: e,
                        rolls: 0,
                        turn: turn,
                        dice: [],
                        total: total
                    })
                }
            }
        } else if (loca > 6 && loca < 14) {
            for (let e of rightScores) {
                if (e.value === loca) {
                    e.entered = true;
                    e.class = "col-2";
                    let total = this.state.total;
                    total = total + e.score;
                    turn = turn - 1;
                    this.setState({
                        location: 1,
                        e: e,
                        rolls: 0,
                        turn: turn,
                        dice: [],
                        total: total
                    })
                }
            }
        }
    }



    // rest for new game
    reset = () => {
        this.resetScores();
        this.setState({
            dice: [],
            counter: 0,
            rolls: 0,
            maybe: 0,
            score: 0,
            turn: 12
        })
    }

    resetScores = () => {
        let scores = this.state.leftScores;
        for (let e of scores) {
            if (e.score > 0) {
                e.score = 0;
                e.entered = false;
                this.setState({
                    e: e
                })
            }
        }
    }




    render() {
        return (
            <div id="body" className="container-fluid">
                <section className="row d-flex justify-content-center">
                    <section className="col-10">
                        <section className="row">

                            <table className="col-5 table">
                                <thead className="row justify-content-center">
                                </thead>
                                <tbody>
                                    {this.state.leftScores.map(item => (
                                        <Tray
                                            key={item.value}
                                            text={item.text}
                                            score={item.score}
                                            class={item.class}
                                        />
                                    ))}
                                </tbody>
                            </table>
                            <table className="col-5 table">
                                <thead className="row justify-content-center">
                                </thead>
                                <tbody>
                                    {this.state.rightScores.map(item => (
                                        <Tray
                                            key={item.value}
                                            text={item.text}
                                            score={item.score}
                                            class={item.class}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    </section>
                </section>
                <section className="row">
                    {this.state.dice.map(item => (
                        <Picture
                            class={item.class}
                            key={item.id}
                            id={item.id}
                            handleClick={this.handleDiceClick}
                            image={item.image}
                        />
                    ))}
                </section>


                <section className="row d-flex justify-content-center">
                    <section className="col-3">
                        <h2> Score: {this.state.total} </h2>
                    </section>
                    <section className="col-3">
                        <h3> Rolls Used: {this.state.rolls}</h3>
                    </section>
                </section>
                <section className="row d-flex justify-content-center">
                    {/* <!-- Store Button --> */}
                    <Button
                        click={this.myDice.bind(this, data)}
                        text="Roll Dice"
                    ></Button>
                    <section className="col-1"></section>
                    <Button
                        click={this.cycleScores}
                        text="Cycle Scores"
                    ></Button>
                    <section className="col-1"></section>
                    <Button
                        click={this.setScore}
                        text="Select Score"
                    ></Button>
                    <section className="col-1"></section>
                    <Button
                        click={this.reset}
                        text="Reset"
                    ></Button>
                </section>
            </div >
        );
    }
}

export default Drawing;