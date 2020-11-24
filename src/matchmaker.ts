namespace Matchmaker
{
    export class Matchmaker
    {
        protected _parser: Parser | null = null;
        protected _defaultTeamNames = ['Naughty Tomatoes', 'Strike Team 404', 'Suwon Tigers', 'Lucky Runners', 'Raccoon Ravagers', 'Pesky Pachimaris', 'Team 7', 'Team 8'];

        protected _tankPlayers: Player[] = [];
        protected _dpsPlayers: Player[] = [];
        protected _supPlayers: Player[] = [];
        protected _otherPlayers: Player[] = [];

        protected _teamCount: number = 0;
        protected _teams: Team[] = [];
        protected _compTeam: Team | null = null;

        protected _bench: Bench = new Bench();

        constructor() {}

        public async run()
        {
            if (!this.showButton(false))
            {
                // Do not run matchmaker
                throw Error("Matchmaker is Already Running");
            }

            this._parser = new Parser(this)
            const valid = this._parser.getAttendance();

            if (!valid)
            {
                // Do not run matchmaker
                throw Error;
            }

            this.sortPlayerIntoRoles(this._parser.playersToMatchmake);
            this._teamCount = Math.floor(this._parser.playersToMatchmake.length / 6);

            this.createTeams();
            this.randFillTeams();
            this.createBench();

            await this.startLoop();

            this.createCompTeam();

            this.displayResult();
        }

        /**
         * Show or Hide button. Returns true if matchmaker should continue, or false
         * to stop the matchmaker from executing (for instance if it is already running).
         * @param show Show or Hide button
         */
        public showButton(show: boolean): boolean
        {
            const button = document.getElementById("Generate");

            // If we can't find element, stop
            if (!button) { return false; }

            // If button already hidden, stop
            if (button.style.display === "none" && !show) { return false; }

            button.style.display = show ? "block" : "none";

            // Continue
            return true;
        }

        protected createTeams()
        {
            for (let i = 0; i < this._teamCount; i++)
            {
                this._teams.push(new Team(this._defaultTeamNames[i]));
            }

            // If we have uneven teams, we will make a final team from the bench later
            if (this._teams.length % 2 === 1)
            {
                this._compTeam = this._teams.pop() as Team;
            }
        }

        protected createBench()
        {
            this._tankPlayers.forEach((p) => this._bench.benchPlayer(p, Player.Role.TANK));
            this._dpsPlayers.forEach((p) => this._bench.benchPlayer(p, Player.Role.DPS));
            this._supPlayers.forEach((p) => this._bench.benchPlayer(p, Player.Role.SUP));
        }

        protected randFillTeams()
        {
            this._tankPlayers = this.shufflePlayers(this._tankPlayers);
            this._dpsPlayers = this.shufflePlayers(this._dpsPlayers);
            this._supPlayers = this.shufflePlayers(this._supPlayers);

            this._teams.forEach((t, i)=>
            {
                for (let j = 0; j < 2; j++)
                {
                    if (this._tankPlayers.length > 0)
                    {
                        t.assignPlayer(this._tankPlayers.pop() as Player, Player.Role.TANK);
                    }
                    if (this._dpsPlayers.length > 0)
                    {
                        t.assignPlayer(this._dpsPlayers.pop() as Player, Player.Role.DPS);
                    }
                    if (this._supPlayers.length > 0)
                    {
                        t.assignPlayer(this._supPlayers.pop() as Player, Player.Role.SUP);
                    }
                }
            });
        }

        protected createCompTeam()
        {
            if (!this._compTeam) { return; }

            for (let i = 0; i < 2; i++)
            {
                if (this._bench.tankPlayers.length > 0)
                {
                    const player = this._bench.tankPlayers.pop() as Player;
                    this._bench.unbench(player);
                    this._compTeam.assignPlayer(player, Player.Role.TANK);
                }
                if (this._bench.dpsPlayers.length > 0)
                {
                    const player = this._bench.dpsPlayers.pop() as Player;
                    this._bench.unbench(player);
                    this._compTeam.assignPlayer(player, Player.Role.DPS);
                }
                if (this._bench.supPlayers.length > 0)
                {
                    const player = this._bench.supPlayers.pop() as Player;
                    this._bench.unbench(player);
                    this._compTeam.assignPlayer(player, Player.Role.SUP);
                }
            }

            if (this._bench.remainingPlayers.length > 0 && this._compTeam.getGaps().length > 0)
            {
                this._compTeam.getGaps().forEach((r) =>
                {
                    this._bench.remainingPlayers.forEach((p) =>
                    {
                        if (p.canPlay(r))
                        {
                            this._compTeam?.assignPlayer(p, r);
                            this._bench.unbench(p);
                        }
                    });
                });
            }

            this._compTeam.setComp();

            this._teams.push(this._compTeam);
        }

        protected sortPlayerIntoRoles(players: Player[])
        {
            this._tankPlayers = [];
            this._dpsPlayers = [];
            this._supPlayers = [];

            players.forEach((p) =>
            {
                if (p.roles.preffered === Player.Role.TANK)
                {
                    this._tankPlayers.push(p);
                }
                else if (p.roles.preffered === Player.Role.DPS)
                {
                    this._dpsPlayers.push(p);
                }
                else if (p.roles.preffered === Player.Role.SUP)
                {
                    this._supPlayers.push(p);
                }
                else
                {
                    this._otherPlayers.push(p);
                    this._bench.benchPlayer(p, Player.Role.NONE);
                }
            });
        }

        protected startLoop()
        {
            let totalID = "";
            this._teams.forEach((t) => totalID += t.getID());
            let oldID = "";

            let counter = 0;
            while (oldID != totalID && counter < 20)
            {
                this.fillBlanks();
                this.balance();

                oldID = totalID;
                totalID = "";
                this._teams.forEach((t) => totalID += t.getID());
                counter++;
            }

            this._teams;
        }

        protected fillBlanks()
        {
            let count = 1;
            let fullCount = 0;
            let loopCount = 0;

            this._teams.forEach((t) =>
            {
                let gaps = t.getGaps();
                if (gaps.length === 0)
                {
                    console.log("No Gaps in team: "+t.name);
                    fullCount++;
                }
            });

            if (fullCount === this._teams.length) { return; }

            // Fill as many blanks on team as possible with bench players
            while (count != 0 && loopCount < 10)
            {
                loopCount++;
                count = 0;
                this._teams.forEach((t) =>
                {
                    let gaps = t.getGaps();
                    if (gaps.length > 0)
                    {
                        count += gaps.length;
                    }

                    gaps.forEach((r) =>
                    {
                        if (r === Player.Role.TANK)
                        {
                            if (this._bench.tankPlayers.length > 0)
                            {
                                const p = this._bench.tankPlayers.pop() as Player;
                                t.assignPlayer(p, Player.Role.TANK);
                                this._bench.unbench(p);
                                count--;
                            }
                        }
                        else if (r === Player.Role.DPS)
                        {
                            if (this._bench.dpsPlayers.length > 0)
                            {
                                const p = this._bench.dpsPlayers.pop() as Player;
                                t.assignPlayer(p, Player.Role.DPS);
                                this._bench.unbench(p);
                                count--;
                            }
                        }
                        else if (r === Player.Role.SUP)
                        {
                            if (this._bench.supPlayers.length > 0)
                            {
                                const p = this._bench.supPlayers.pop() as Player;
                                t.assignPlayer(p, Player.Role.SUP);
                                this._bench.unbench(p);
                                count--;
                            }
                        }
                    });
                });

                if (count === 0) { return; }

                // Slot in bench players that play gap roles
                this._teams.forEach((t) =>
                {
                    let gaps = t.getGaps();
                    gaps.forEach((r) =>
                    {
                        for (let i = 0; i < this._bench.remainingPlayers.length; i++)
                        {
                            const p = this._bench.remainingPlayers[i];
                            if (r === Player.Role.TANK && p.roles.tank)
                            {
                                t.assignPlayer(p, Player.Role.TANK);
                                this._bench.unbench(p);
                                count--;
                                break;
                            }
                            else if (r === Player.Role.DPS && p.roles.dps)
                            {
                                t.assignPlayer(p, Player.Role.DPS);
                                this._bench.unbench(p);
                                count--;
                                break;
                            }
                            else if (r === Player.Role.SUP && p.roles.sup)
                            {
                                t.assignPlayer(p, Player.Role.SUP);
                                this._bench.unbench(p);
                                count--;
                                break;
                            }
                        };
                    });
                });

                if (count === 0) { return; }

                // Try to swap people already in team to cover roles
                this._teams.forEach((t) =>
                {
                    let gaps = t.getGaps();
                    gaps.forEach((r) =>
                    {
                        for (let i = 0; i < t.allPlayers.length; i++)
                        {
                            const p = t.allPlayers[i];
                            if (r === Player.Role.TANK && p.roles.tank && p.roles.current != Player.Role.TANK)
                            {
                                t.swapPlayer(p, p.roles.current, Player.Role.TANK);
                                break;
                            }
                            else if (r === Player.Role.DPS && p.roles.dps && p.roles.current != Player.Role.DPS)
                            {
                                t.swapPlayer(p, p.roles.current, Player.Role.DPS);
                                break;
                            }
                            else if (r === Player.Role.SUP && p.roles.sup && p.roles.current != Player.Role.SUP)
                            {
                                t.swapPlayer(p, p.roles.current, Player.Role.SUP);
                                break;
                            }
                        };
                    });
                });

                this._teams;
            }
        }

        protected balance()
        {
            for (let i = 0; i < this._teams.length / 2; i+=2)
            {
                if (this._teams[i] && this._teams[i+1])
                {
                    this.doBalance(this._teams[i], this._teams[i+1]);
                }
            }
        }

        protected doBalance(team1: Team, team2: Team)
        {
            let avg1 = team1.getAverage();
            let avg2 = team2.getAverage();
            const startDiff = Math.abs(Math.round(avg1 - avg2));

            let switchesPossible = true;
            const allSwitches: string[] = [];

            const roleMap: Player.Role[] = [ Player.Role.TANK, Player.Role.DPS, Player.Role.SUP ];
            const switchMap = new Map<number, Switcher | BenchSwitcher>();

            let count = 0;

            while (switchesPossible && count < 20)
            {
                count++;
                avg1 = team1.getAverage();
                avg2 = team2.getAverage();
                const runningDiff = Math.abs(Math.round(avg1 - avg2));

                roleMap.forEach((role1) =>
                {
                    roleMap.forEach((role2) =>
                    {
                        const players1 = team1.getPlayers(role1);
                        const players2 = team2.getPlayers(role2);

                        players1.forEach((p1) =>
                        {
                            players2.forEach((p2) =>
                            {
                                const switcher = new Switcher(team1, role1, p1, team2, role2, p2);

                                const change = switcher.SRChange;
                                const key = Math.abs(runningDiff - change);

                                if (Math.abs(key) <= Math.abs(runningDiff) && change != 0 && switcher.switchPossible && allSwitches.indexOf(switcher.getID()) === -1)
                                {
                                    switchMap.set(key, switcher);
                                }
                            });
                        });
                    });
                });

                // Try switches with the bench
                roleMap.forEach((role) =>
                {
                    const players1 = team1.getPlayers(role);
                    const players2 = team2.getPlayers(role);
                    const playersBench = this._bench.remainingPlayers;

                    players1.forEach((p1) =>
                    {
                        playersBench.forEach((pb) =>
                        {
                            const switcher = new BenchSwitcher(team1, role, p1, this._bench, pb);

                            const change = switcher.SRChange;
                            const key = Math.abs(runningDiff + change);

                            if (Math.abs(key) <= Math.abs(runningDiff) && change != 0 && switcher.switchPossible && allSwitches.indexOf(switcher.getID()) === -1)
                            {
                                switchMap.set(key, switcher);
                            }
                        });
                    });

                    players2.forEach((p2) =>
                    {
                        playersBench.forEach((pb) =>
                        {
                            const switcher = new BenchSwitcher(team1, role, p2, this._bench, pb);

                            const change = switcher.SRChange;
                            const key = Math.abs(runningDiff + change);

                            if (Math.abs(key) <= Math.abs(runningDiff) && change != 0 && switcher.switchPossible && allSwitches.indexOf(switcher.getID()) === -1)
                            {
                                switchMap.set(key, switcher);
                            }
                        });
                    });
                });

                const switches: number[] = Array.from(switchMap.keys());
                if (switches.length === 0)
                {
                    switchesPossible = false;
                    break;
                }

                switches.sort((a, b) => b - a);

                const bestSwitch = switchMap.get(switches.shift() as number);
                if (bestSwitch instanceof Switcher || bestSwitch instanceof BenchSwitcher)
                {
                    const success = bestSwitch.makeSwitch();
                    allSwitches.push(bestSwitch.getID());
                }
            }
        }

        protected displayResult()
        {
            const table = document.getElementById("Table") as HTMLTableElement;

            if (table.children)
            {
                const children = Array.from(table.children);
                children.forEach((c) =>
                {
                    table.removeChild(c);
                });
            }

            const rows: HTMLTableRowElement[] = [];

            for (let i = 0; i < Math.ceil(this._teamCount / 2); i++)
            {
                rows.push(document.createElement("tr"));
            }

            this._teams.forEach((t, i) =>
            {
                const newCol = document.createElement("td");

                let result = t.name.bold() + "<br />" + "TANK: ";

                t.tankPlayers.forEach((p, j) =>
                {
                    result += p.callsign;
                    if (j != t.tankPlayers.length - 1)
                    {
                        result += " | ";
                    }
                });
                result += "<br />" + "DPS: ";

                t.dpsPlayers.forEach((p, j) =>
                {
                    result += p.callsign;
                    if (j != t.dpsPlayers.length - 1)
                    {
                        result += " | ";
                    }
                });
                result += "<br />" + "SUP: ";

                t.supPlayers.forEach((p, j) =>
                {
                    result += p.callsign;
                    if (j != t.supPlayers.length - 1)
                    {
                        result += " | ";
                    }
                });
                result += "<br />";

                result += "SR: "+t.getAverage().toString().bold();
                result += "<br />";

                newCol.innerHTML = result;

                for (let j = 0; j < rows.length; j++)
                {
                    if (rows[j].children.length < 2)
                    {
                        rows[j].appendChild(newCol);
                        break;
                    }
                }
            });

            rows.forEach((r) =>
            {
                table.appendChild(r);
            })
        }

        protected shufflePlayers(array: Player[]): Player[]
        {
            for (let i = array.length - 1; i > 0; i--)
            {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }

            return array;
        }
    }
}