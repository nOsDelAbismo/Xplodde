import { Component, OnInit, DoCheck }  from '@angular/core'
import { Web3 } from '../../services/web3.service';
import { AccountService } from '../../services/account.service';
import { DialogService } from '../../services/dialog.service';
import { ContractService } from '../../services/contract.service';
import { EventsService } from '../../services/events.service';

@Component({
    selector: 'app-network',
    templateUrl: './network.component.html',
})
export class NetWorkComponent implements OnInit, DoCheck{
    networks: any[] = [{chain:1, name: "Main Ethereum Network"}, {chain:3, name: "Ropsten Test Network"}]
    net: any;
    show: boolean = false;
    loading: boolean =  false;
    dialog;
    constructor(private _web3: Web3, private _account: AccountService, private _contract: ContractService, private _events: EventsService, private _dialog: DialogService) {

    }
    ngOnInit(){
        this.net = (this._web3.network == 1)? this.networks[0]: this.networks[1];
    }

    ngDoCheck(){
        if(this._account.updated == true && this.loading){
            this.loading = false;
            this.dialog.close();
            this.show = !this.show;
        }
    }

    toggleShow(){
        this.show = !this.show;
    }

    async selectNetwork(network: any){
        if(this.net.chain == network.chain ){
            this.show = !this.show;
            return false
        }
        this._account.updated = false;
        this.loading = true;
        this.dialog = this._dialog.openLoadingDialog();
        this.net = network;
        this._web3.setNetwork(network.chain);
        this._contract.setContract();
        this._events.getEvents();
        
        if('address' in this._account.account){
                await this._account.refreshAccountData();

        }else{
            this.dialog.close();
            this.show = !this.show;
        }
        
    }
}
