import { Component,  Inject, OnInit} from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import { Web3 } from '../../services/web3.service';
import { ResendTxDialogComponent } from '../dialogs/resendTx-dialog.component';


@Component({
    selector: 'show-tx',
    templateUrl: './showTx-dialog.component.html'
})

export class ShowTxDialogComponent implements OnInit{
    submited = false;
    constructor(@Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<ShowTxDialogComponent>, private _web3: Web3, private dialog: MdDialog){
    }

    ngOnInit(){
    }

    closeDialog(){
        this.dialogRef.close();
    }

    resend(){
        this.dialogRef.close();
        this.dialog.open(ResendTxDialogComponent, {
            width: '660px',
            height: '',
            data: this.data
          });
    }

    openExternal(txHash){
        const shell = require('electron').shell;
        let net = (this._web3.network==1) ? "":"ropsten.";
        shell.openExternal('https://'+net+'etherscan.io/tx/'+txHash);
}

}