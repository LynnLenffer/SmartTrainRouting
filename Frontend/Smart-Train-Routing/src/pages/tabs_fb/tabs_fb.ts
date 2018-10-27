import { Component } from '@angular/core';

import {addVotegroupPage} from "../voting_add/voting_add";
import {VotingsFbPage} from "../votings_fb/votings_fb";
import {GraphenWeeklyPage} from "../graph_weekly/graph_weekly";

@Component({
  templateUrl: 'tabs_fb.html'
})
export class TabsPage {

  tab1Root = VotingsFbPage;
  tab2Root = addVotegroupPage;
  tab3Root = GraphenWeeklyPage;

  constructor() {}
}
