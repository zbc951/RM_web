import { Component} from '@angular/core';
@Component({
    selector: 'about-bank-card',
    templateUrl: 'about-bank-card.component.html'
})
export class AboutBankCardComponent { 
}

@Component({
    selector: 'about-deposit-serial',
    templateUrl: 'about-deposit-serial.component.html'
})
export class AboutDepositSerialComponent { 
    selectItem = 'Serial';
}

@Component({
    selector: 'about-withdraw',
    templateUrl: 'about-withdraw.component.html'
})
export class aboutWithdrawComponent { 
}