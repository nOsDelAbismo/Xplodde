import { Component } from '@angular/core'

/*Services*/
import { WalletService } from '../../services/wallet.service'
import { AccountService } from '../../services/account.service'
import { DialogService } from '../../services/dialog.service'

/*Dialog*/
import { MdDialog } from '@angular/material';
import { MdDialogRef } from '@angular/material';



@Component({
  selector: 'newAccount-dialog',
  templateUrl: './newAccount-dialog.component.html'
})

export class NewAccountDialogComponent {
  nameAccount:string;
  passErr;
  pass2Err;
  checkPassErr;

  protected pass;
  protected pass2;

  constructor(public dialogRef: MdDialogRef<NewAccountDialogComponent>, private _wallet: WalletService,
              private _account: AccountService, public dialog: MdDialog,private dialogService: DialogService) {
      
    if(this._wallet.wallet == null ){
      this.nameAccount= "Account 1"
    }else{
      this.nameAccount = "Account "+(this._wallet.wallet.length+1);
    }
  }


  async createAccount(name, pass, pass2){
    let error:string = "";

    if(this.checkPass(pass, pass2) == false){
      this.checkPassErr = true;
      
      return false
    }
    if(pass==null || pass2 == null){
      if(pass == null){
        this.passErr = true;
      }else{
        this.passErr = null;
      }
      if(pass2 == null){
        this.pass2Err = true;
      }else{
        this.pass2Err = null;
      }
  
      return false;
    }

    try{
      this._wallet.newAccount(name, pass);
      if(!localStorage.getItem('acc')){
        this._account.getAccountData();
      }
    }catch(e){
      
      error = "Account name and password are required fields, please, try it again.";
      
      
    }
    let title = (error=="")? 'Your account has been successfully created' : 'Unable to create account';
    let message = (error=="")? 'You can find it in the wallet list' : 'Something was wrong';

    let dialogRef = this.dialogService.openErrorDialog(title, message, error);
   
    this.dialogRef.close();
  }
  
  checkPass(pass, pass2){
    if(pass != pass2){
      document.getElementById('pass2').className += " error";
      return false
    } 
    return true
  }

  closeDialog(){
    this.dialogRef.close();
  }


}
