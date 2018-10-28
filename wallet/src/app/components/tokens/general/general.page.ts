import { Component, OnInit, OnDestroy, DoCheck } from '@angular/core'

/*Services*/
import { AccountService } from '../../../services/account.service'
import { TokenService } from '../../../services/token.service';
import { Web3 } from '../../../services/web3.service';
import { DialogService } from '../../../services/dialog.service';


@Component({
  selector: 'general-page',
  templateUrl: './general.html'
})

export class GeneralPage implements OnInit, OnDestroy, DoCheck {
  tokens:  any[];
  hideZero: boolean;
  allTokens: any[];
  alphabetically: number;
  byBalance: number;
  dialog = null;

  constructor(protected _account: AccountService, private _token: TokenService, private _web3: Web3, private _dialog: DialogService) {
    this.hideZero = false;
    this.alphabetically = 0;
    this.byBalance = 0;
    this.allTokens = this._account.tokens.filter(x=>x);
  }

  ngOnInit() {
      Promise.resolve().then(() => { this.dialog = this._dialog.openLoadingDialog();});
  }
    

  ngOnDestroy(){
    this._account.clearIntervalTokens();
  }

  ngDoCheck() {
    if(this._account.updatedTokens && this.dialog!=null){
      this.dialog.close();
    }
    if(this._account.updatedTokens && this._account.tokenInterval==null){
      this.setTokens();
      this._account.startIntervalTokens();
    }
    if(JSON.stringify(this.allTokens) != JSON.stringify(this._account.tokens)){
      this.setTokens();
      this.allTokens = this._account.tokens.filter(x=>x);
    }
  }

  openExternal(txHash){
    const shell = require('electron').shell;
    let net = (this._web3.network == 1) ? "" : "ropsten.";
    shell.openExternal('https://'+net+'etherscan.io/token/'+txHash+'?a='+this._account.account.address);
  }

  async setTokens() {
    this.tokens =  this._account.tokens.filter(token => !token.deleted);
    if(!this.hideZero){
      this.tokens =  this._account.tokens.filter(token => !token.deleted);
    }else{
      this.tokens = this._account.tokens.filter(token => token.balance > 0 && !token.deleted);
    }

    await this.sortAlphabetically();
    await this.sortByBalance();
  }
  
  toggleHideZero(){
    this.hideZero = !this.hideZero;
    this.setTokens();
  }

  changeAlphabetically(){
    this.byBalance = 0;
    switch(this.alphabetically){
      case 0:
        this.alphabetically = 1;
        break;
      case 1:
        this.alphabetically = 2;
        break;
      case 2:
        this.alphabetically = 1;
        break;  
    }
    this.sortAlphabetically();
  }

  sortAlphabetically(): void {
    switch(this.alphabetically){
      case 1:
        this.tokens.sort((a,b)=> (a.tokenSymbol).localeCompare(b.tokenSymbol));
        break;
      case 2:
        this.tokens.sort((a,b)=> (b.tokenSymbol).localeCompare(a.tokenSymbol));
        break;
    }
  }

  changeByBalance(): void {
    this.alphabetically = 0;
    switch(this.byBalance){
      case 0:
        this.byBalance = 1;
        break;
      case 1:
        this.byBalance = 2;
        break;
      case 2:
        this.byBalance = 1;
        break;  
    }
    this.sortByBalance();
  }

  sortByBalance(): void {
    switch(this.byBalance){
      case 1:
        this.tokens.sort((a,b)=> a.balance-b.balance);
        break;
      case 2:
        this.tokens.sort((a,b)=> b.balance-a.balance);
        break;
    }
  }
}